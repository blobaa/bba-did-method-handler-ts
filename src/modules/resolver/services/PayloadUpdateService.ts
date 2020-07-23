import { IRequest, ChainId, account, SetAccountPropertyParams } from "@blobaa/ardor-ts";
import { UpdateDIDDocumentParams, UpdateDIDDocumentResponse, ErrorCode, PayloadStorageType } from "../../../types";
import { IUpdatePayloadService, IPayloadStorage } from "../../internal-types";
import DID from "../../lib/DID";
import Attestation from "../../lib/Attestation";
import ErrorHelper from "../../lib/ErrorHelper";
import ArdorCloudStorage from "../../lib/ArdorCloudStorage";
import DataFields from "../../lib/DataField";


export default class PayloadUpdateService implements IUpdatePayloadService {
    private readonly request: IRequest;


    constructor(request: IRequest) {
        this.request = request;
    }


    public async run(url: string, params: UpdateDIDDocumentParams): Promise<UpdateDIDDocumentResponse> {
        const did = new DID();
        const error = did.consumeDIDString(params.did);

        if (error.code !== ErrorCode.NO_ERROR) {
            return Promise.reject(error);
        }


        const attestation = new Attestation(this.request);
        const info = await attestation.parseTrustChain(url, ChainId.IGNIS, did.fullHash);


        const currentControllerAccount = info.accounts[info.accounts.length - 1];
        const specifiedControllerAccount = account.convertPassphraseToAccountRs(params.passphrase);

        if (currentControllerAccount !== specifiedControllerAccount) {
            const _error = ErrorHelper.createError(ErrorCode.WRONG_CONTROLLER_ACCOUNT, [specifiedControllerAccount, currentControllerAccount]);
            return Promise.reject(_error);
        }


        let payloadStorage = {} as IPayloadStorage;
        if (info.dataFields.payloadStorageType === PayloadStorageType.ARDOR_CLOUD_STORAGE) {
            payloadStorage = new ArdorCloudStorage(this.request, params.passphrase, ChainId.IGNIS, url, params.feeNQT);
        }

        const reference = await payloadStorage.storeData(params.newPayload);


        const dataFields = new DataFields(info.dataFields);
        dataFields.payloadReference = reference;

        const propertyParams: SetAccountPropertyParams = {
            chain: ChainId.IGNIS,
            property: dataFields.didId,
            value: dataFields.createDataFieldsString(),
            recipient: account.convertPassphraseToAccountRs(params.passphrase),
            secretPhrase: params.passphrase,
            feeNQT: params.feeNQT
        };

        await this.request.setAccountProperty(url, propertyParams);


        return new Promise(resolve => resolve({ fullHash: "", requestProcessingTime: 0 }));
    }
}