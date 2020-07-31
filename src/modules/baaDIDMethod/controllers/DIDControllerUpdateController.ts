import { chainCurrency, ChainCurrencyType } from "@blobaa/ardor-ts";
import { UpdateDIDControllerParams, UpdateDIDControllerResponse } from "../../../types";
import { IDIDControllerUpdateService } from "../../internal-types";


export default class DIDControllerUpdateController {
    private readonly service: IDIDControllerUpdateService;


    constructor(service: IDIDControllerUpdateService) {
        this.service = service;
    }


    public async run(url: string, params: UpdateDIDControllerParams): Promise<UpdateDIDControllerResponse> {
        if (params.fee) {
            params.feeNQT = chainCurrency.convertToBaseUnit(params.fee, ChainCurrencyType.IGNIS);
            delete params.fee;
        }
        return await this.service.run(url, params);
    }
}