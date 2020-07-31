import { chainCurrency, ChainCurrencyType } from "@blobaa/ardor-ts";
import { UpdateDIDDocumentParams, UpdateDIDDocumentResponse } from "../../../types";
import { IDIDDocumentUpdateService } from "../../internal-types";


export default class DIDDocumentUpdateController {
    private readonly service: IDIDDocumentUpdateService;


    constructor(service: IDIDDocumentUpdateService) {
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