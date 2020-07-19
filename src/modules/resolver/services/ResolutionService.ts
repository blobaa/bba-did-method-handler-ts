import { IRequest, ChainId } from "@blobaa/ardor-ts";
import { ResolveDIDParams, ResolveDIDResponse, ErrorCode } from "../../../types";
import { IResolutionService } from "../../internal-types";
import DIDFields from "../../lib/DIDFields";


export default class ResolutionService implements IResolutionService {
    private readonly request: IRequest;


    constructor(request: IRequest) {
        this.request = request;
    }


    public async run(url: string, params: ResolveDIDParams): Promise<ResolveDIDResponse> {
        const didFields = new DIDFields();
        const error = didFields.consumeDIDString(params.did);
        if (error.code !== ErrorCode.NO_ERROR) {
            return Promise.reject(error);
        }
        // const resp = await this.request.getTransaction(url, { chain: ChainId.IGNIS, fullHash: params.did });
        // console.log(resp);
        return new Promise(resolve => resolve({ fullHash: "", requestProcessingTime: 0 }));
    }
}