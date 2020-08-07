import { chainCurrency, ChainCurrencyType } from "@blobaa/ardor-ts";
import { DeactivateDIDParams, DeactivateDIDResponse } from "../../../types";
import { IDIDRevocationService } from "../../internal-types";


export default class DIDDeactivateController {
    private readonly service: IDIDRevocationService;


    constructor(service: IDIDRevocationService) {
        this.service = service;
    }


    public async run(url: string, params: DeactivateDIDParams): Promise<DeactivateDIDResponse> {
        if (params.fee) {
            params.feeNQT = chainCurrency.convertToBaseUnit(params.fee, ChainCurrencyType.IGNIS);
            delete params.fee;
        }
        return await this.service.run(url, params);
    }
}