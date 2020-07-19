import { chainCurrency, ChainCurrencyType } from "@blobaa/ardor-ts";
import { UpdateDIDPayloadParams, UpdateDIDPayloadResponse } from "../../../types";
import { IUpdatePayloadService } from "../../internal-types";


export default class DIDPayloadUpdateController {
    private readonly service: IUpdatePayloadService;


    constructor(service: IUpdatePayloadService) {
        this.service = service;
    }


    public async run(url: string, params: UpdateDIDPayloadParams): Promise<UpdateDIDPayloadResponse> {
        if (params.fee) {
            params.fee = chainCurrency.convertToBaseUnit(params.fee, ChainCurrencyType.IGNIS);
        }
        return await this.service.run(url, params);
    }
}