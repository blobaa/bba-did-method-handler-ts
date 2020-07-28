import { ChainId, IRequest } from "@blobaa/ardor-ts";
import { DIDDocStorageType, ErrorCode, ResolveDIDParams, ResolveDIDResponse } from "../../../types";
import { IDataStorage, IDIDResolutionService } from "../../internal-types";
import ArdorCloudStorage from "../../lib/ArdorCloudStorage";
import Attestation from "../../lib/Attestation";
import DID from "../../lib/DID";
import ErrorHelper from "../../lib/ErrorHelper";


export default class ResolutionService implements IDIDResolutionService {
    private readonly request: IRequest;


    constructor(request: IRequest) {
        this.request = request;
    }


    public async run(url: string, params: ResolveDIDParams): Promise<ResolveDIDResponse> {
        const did = new DID();
        const error = did.consumeDIDString(params.did);
        if (error.code !== ErrorCode.NO_ERROR) {
            return Promise.reject(error);
        }

        const attestation = new Attestation(this.request);
        const info = await attestation.parseTrustChain(url, ChainId.IGNIS, did.fullHash);


        let documentStorage = {} as IDataStorage;
        if (info.dataFields.documentStorageType === DIDDocStorageType.ARDOR_CLOUD_STORAGE) {
            documentStorage = new ArdorCloudStorage(this.request, ChainId.IGNIS, url, info.accounts);
        }


        const data = await documentStorage.retrieveData(info.dataFields.documentReference);
        try {
            const document = JSON.parse(data);
            return { didDocument: document };
        } catch (e) {
            return Promise.reject(ErrorHelper.createError(ErrorCode.INVALID_DIDDOC));
        }
    }
}