import { IRequest } from "@blobaa/ardor-ts";
import { RevokeDIDParams, RevokeDIDResponse } from "../../../types";
import { IRevocationService } from "../../internal-types";


export default class RevocationService implements IRevocationService {
    private readonly request: IRequest;


    constructor(request: IRequest) {
        this.request = request;
    }


    public async run(url: string, params: RevokeDIDParams): Promise<RevokeDIDResponse> {
        return new Promise(resolve => resolve({ fullHash: "", requestProcessingTime: 0 }));
    }
}