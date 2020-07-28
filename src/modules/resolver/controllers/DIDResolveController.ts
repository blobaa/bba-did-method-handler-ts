import { ResolveDIDParams, ResolveDIDResponse } from "../../../types";
import { IDIDResolutionService } from "../../internal-types";


export default class DIDResolveController {
    private readonly service: IDIDResolutionService;


    constructor(service: IDIDResolutionService) {
        this.service = service;
    }


    public async run(url: string, params: ResolveDIDParams): Promise<ResolveDIDResponse> {
        return await this.service.run(url, params);
    }
}