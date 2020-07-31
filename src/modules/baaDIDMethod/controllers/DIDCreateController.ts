import { chainCurrency, ChainCurrencyType } from "@blobaa/ardor-ts";
import { IDIDCreationService } from "../../internal-types";
import { CreateDIDParams, CreateDIDResponse } from "../../../types";


export default class DIDCreateController {
    private readonly service: IDIDCreationService;


    constructor(service: IDIDCreationService) {
        this.service = service;
    }


    public async run(url: string, params: CreateDIDParams): Promise<CreateDIDResponse> {
        if (params.fee) {
            params.feeNQT = chainCurrency.convertToBaseUnit(params.fee, ChainCurrencyType.IGNIS);
            delete params.fee;
        }
        return await this.service.run(url, params);
    }
}