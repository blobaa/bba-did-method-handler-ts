import { ChainId, IRequest } from "@blobaa/ardor-ts";
import { ErrorCode, PayloadStorageType, ResolveDIDParams, ResolveDIDResponse } from "../../../types";
import { IPayloadStorage, IResolutionService } from "../../internal-types";
import ArdorCloudStorage from "../../lib/ArdorCloudStorage";
import Attestation from "../../lib/Attestation";
import DID from "../../lib/DID";


export default class ResolutionService implements IResolutionService {
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


        let payloadStorage = {} as IPayloadStorage;
        if (info.dataFields.payloadStorageType === PayloadStorageType.ARDOR_CLOUD_STORAGE) {
            payloadStorage = new ArdorCloudStorage(this.request, ChainId.IGNIS, url, info.accounts);
        }

        const payload = await payloadStorage.retrieveData(info.dataFields.payloadReference);

        /* check payload */
        console.log(payload);


        return { fullHash: "", requestProcessingTime: 0 };
    }
}