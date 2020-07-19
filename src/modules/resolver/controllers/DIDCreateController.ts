import { chainCurrency, ChainCurrencyType } from "@blobaa/ardor-ts";
import { ICreationService } from "../../internal-types";
import { CreateDIDParams, CreateDIDResponse } from "../../../types";


export default class DIDCreateController {
    private readonly service: ICreationService;


    constructor(service: ICreationService) {
        this.service = service;
    }


    public async run(url: string, params: CreateDIDParams): Promise<CreateDIDResponse> {
        if (params.fee) {
            params.fee = chainCurrency.convertToBaseUnit(params.fee, ChainCurrencyType.IGNIS);
        }
        return await this.service.run(url, params);
    }
}