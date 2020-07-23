import { chainCurrency, ChainCurrencyType } from "@blobaa/ardor-ts";
import { UpdateDIDDocumentParams, UpdateDIDDocumentResponse } from "../../../types";
import { IUpdatePayloadService } from "../../internal-types";


export default class DIDPayloadUpdateController {
    private readonly service: IUpdatePayloadService;


    constructor(service: IUpdatePayloadService) {
        this.service = service;
    }


    public async run(url: string, params: UpdateDIDDocumentParams): Promise<UpdateDIDDocumentResponse> {
        if (params.fee) {
            params.feeNQT = chainCurrency.convertToBaseUnit(params.fee, ChainCurrencyType.IGNIS);
            delete params.fee;
        }
        return await this.service.run(url, params);
    }
}