import { account, ChainId, IRequest, SetAccountPropertyParams } from "@blobaa/ardor-ts";
import { DID_ID_LENGTH } from "../../../constants";
import { CreateDIDParams, CreateDIDResponse, DIDNetworkType, DIDDocStorageType, State } from "../../../types";
import { IDIDCreationService, IDIDDocumentStorage } from "../../internal-types";
import ArdorCloudStorage from "../../lib/ArdorCloudStorage";
import DID from "../../lib/DID";
import DataFields from "./../../lib/DataField";
import Nonce from "./../../lib/Nonce";


export default class CreationService implements IDIDCreationService {
    private readonly request: IRequest;


    constructor(request: IRequest) {
        this.request = request;
    }


    public async run(url: string, params: CreateDIDParams): Promise<CreateDIDResponse> {
        const payloadStorageType = DIDDocStorageType.ARDOR_CLOUD_STORAGE;

        let documentStorage = {} as IDIDDocumentStorage;
        if (payloadStorageType === DIDDocStorageType.ARDOR_CLOUD_STORAGE) {
            documentStorage = new ArdorCloudStorage(this.request, params.passphrase, ChainId.IGNIS, url, params.feeNQT);
        }
        const reference = await documentStorage.storeData(params.didDocument);


        const dataFields = new DataFields();
        dataFields.payloadReference = reference;
        dataFields.didId = Nonce.generate(DID_ID_LENGTH);
        dataFields.state = State.ACTIVE;

        const propertyParams: SetAccountPropertyParams = {
            chain: ChainId.IGNIS,
            property: dataFields.didId,
            value: dataFields.createDataFieldsString(),
            recipient: account.convertPassphraseToAccountRs(params.passphrase),
            secretPhrase: params.passphrase,
            feeNQT: params.feeNQT
        };

        const propertyResponse = await this.request.setAccountProperty(url, propertyParams);


        const didFields = new DID();
        didFields.networkType = params.isTestnetDid ? DIDNetworkType.TESTNET : DIDNetworkType.MAINNET;
        didFields.fullHash = propertyResponse.fullHash;
        const did = didFields.createDidString();

        return { did, didDocument: params.didDocument };
    }
}