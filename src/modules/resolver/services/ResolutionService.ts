import { IRequest } from "@blobaa/ardor-ts";
import { ResolveDIDParams, ResolveDIDResponse } from "../../../types";
import { IResolutionService } from "../../internal-types";


export default class ResolutionService implements IResolutionService {
    private readonly request: IRequest;


    constructor(request: IRequest) {
        this.request = request;
    }


    public async run(url: string, params: ResolveDIDParams): Promise<ResolveDIDResponse> {
        return new Promise(resolve => resolve({ fullHash: "", requestProcessingTime: 0 }));
    }
}