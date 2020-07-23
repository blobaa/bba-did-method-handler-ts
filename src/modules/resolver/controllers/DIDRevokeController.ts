import { chainCurrency, ChainCurrencyType } from "@blobaa/ardor-ts";
import { DeactivateDIDParams, DeactivateDIDResponse } from "../../../types";
import { IRevocationService } from "../../internal-types";


export default class DIDRevokeController {
    private readonly service: IRevocationService;


    constructor(service: IRevocationService) {
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