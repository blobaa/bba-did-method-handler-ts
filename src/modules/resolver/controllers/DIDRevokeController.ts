import { chainCurrency, ChainCurrencyType } from "@blobaa/ardor-ts";
import { RevokeDIDParams, RevokeDIDResponse } from "../../../types";
import { IRevocationService } from "../../internal-types";


export default class DIDRevokeController {
    private readonly service: IRevocationService;


    constructor(service: IRevocationService) {
        this.service = service;
    }


    public async run(url: string, params: RevokeDIDParams): Promise<RevokeDIDResponse> {
        if (params.fee) {
            params.fee = chainCurrency.convertToBaseUnit(params.fee, ChainCurrencyType.IGNIS);
        }
        return await this.service.run(url, params);
    }
}