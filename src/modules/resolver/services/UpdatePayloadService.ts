import { IRequest } from "@blobaa/ardor-ts";
import { UpdateDIDPayloadParams, UpdateDIDPayloadResponse } from "../../../types";
import { IUpdatePayloadService } from "../../internal-types";


export default class UpdatePayloadService implements IUpdatePayloadService {
    private readonly request: IRequest;


    constructor(request: IRequest) {
        this.request = request;
    }


    public async run(url: string, params: UpdateDIDPayloadParams): Promise<UpdateDIDPayloadResponse> {
        return new Promise(resolve => resolve({ fullHash: "", requestProcessingTime: 0 }));
    }
}