import { ResolveDIDParams, ResolveDIDResponse } from "../../../types";
import { IResolutionService } from "../../internal-types";


export default class DIDResolveController {
    private readonly service: IResolutionService;


    constructor(service: IResolutionService) {
        this.service = service;
    }


    public async run(url: string, params: ResolveDIDParams): Promise<ResolveDIDResponse> {
        return await this.service.run(url, params);
    }
}