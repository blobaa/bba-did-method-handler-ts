import { chainCurrency, ChainCurrencyType } from "@blobaa/ardor-ts";
import { UpdateDIDControllerParams, UpdateDIDControllerResponse } from "../../../types";
import { IUpdateControllerService } from "../../internal-types";


export default class DIDControllerUpdateController {
    private readonly service: IUpdateControllerService;


    constructor(service: IUpdateControllerService) {
        this.service = service;
    }


    public async run(url: string, params: UpdateDIDControllerParams): Promise<UpdateDIDControllerResponse> {
        if (params.fee) {
            params.fee = chainCurrency.convertToBaseUnit(params.fee, ChainCurrencyType.IGNIS);
        }
        return await this.service.run(url, params);
    }
}