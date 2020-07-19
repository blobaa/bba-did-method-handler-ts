import { IRequest } from "@blobaa/ardor-ts";
import { UpdateDIDControllerParams, UpdateDIDControllerResponse } from "../../../types";
import { IUpdateControllerService } from "../../internal-types";


export default class UpdateControllerService implements IUpdateControllerService {
    private readonly request: IRequest;


    constructor(request: IRequest) {
        this.request = request;
    }


    public async run(url: string, params: UpdateDIDControllerParams): Promise<UpdateDIDControllerResponse> {
        return new Promise(resolve => resolve({ fullHash: "", requestProcessingTime: 0 }));
    }
}