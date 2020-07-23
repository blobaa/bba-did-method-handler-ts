import { ChainId, GetTransactionParams, IRequest, UploadTaggedDataParams, GetTransactionResponse } from "@blobaa/ardor-ts";
import { DATA_CLOUD_NAME } from "../../constants";
import { IPayloadStorage, objectAny } from "../internal-types";
import { ErrorCode } from "../../types";
import ErrorHelper from "./ErrorHelper";


export default class ArdorCloudStorage implements IPayloadStorage {
    private url = "";
    private chainId: ChainId;
    private accounts = [""];
    private secretPhrase = "";
    private request: IRequest;
    private feeNQT?: number;


    constructor(request: IRequest, secretPhrase: string, chainId: ChainId, url: string, feeNQT?: number) // constructor 1 (storeData)
    constructor(request: IRequest, chainId: ChainId, url: string, account: string[]) // constructor 2 (retrieveData)

    constructor(request: IRequest, secretPhraseOrChainId: string | ChainId, chainIdOrUrl: ChainId | string, urlOrAccounts: string | string[], feeNQT?: number) {
        if (typeof secretPhraseOrChainId === "string") { // constructor 1
            this.secretPhrase = secretPhraseOrChainId;
            this.chainId = chainIdOrUrl as ChainId;
            this.url = urlOrAccounts as string;
            this.feeNQT = feeNQT;
        } else { // constructor 2
            this.chainId = secretPhraseOrChainId as ChainId;
            this.url = chainIdOrUrl as string;
            this.accounts = urlOrAccounts as string[];
        }
        this.request = request;
    }


    public async storeData(data: objectAny): Promise<string> {
        const params: UploadTaggedDataParams = {
            chain: this.chainId,
            name: DATA_CLOUD_NAME,
            data: JSON.stringify(data),
            secretPhrase: this.secretPhrase,
            feeNQT: this.feeNQT
        };

        const response = await this.request.uploadTaggedData(this.url, params);
        return response.fullHash;
    }


    public async retrieveData(reference: string): Promise<objectAny> {
        const params: GetTransactionParams = {
            chain: this.chainId,
            fullHash: reference
        };

        const response = await this.request.getTransaction(this.url, params);
        return this.extractData(response);
    }

    private extractData(response: GetTransactionResponse): Promise<objectAny> {
        const data = response.attachment.data;
        const name = response.attachment.name;
        const issuer = response.senderRS;

        if (!this.isDIDPayload(data, name)) {
            const error = ErrorHelper.createError(ErrorCode.PAYLOAD_NOT_FOUND);
            return Promise.reject(error);
        }

        if (!this.isPayloadSelfSet(this.accounts, issuer)) {
            const error = ErrorHelper.createError(ErrorCode.INVALID_PAYLOAD);
            return Promise.reject(error);
        }

        try {
            const dataObject = JSON.parse(data);
            return dataObject;
        } catch (e) {
            const error = ErrorHelper.createError(ErrorCode.INVALID_PAYLOAD);
            return Promise.reject(error);
        }
    }

    private isDIDPayload(data: string | undefined, name: string | undefined): boolean {
        return (data && name && name === DATA_CLOUD_NAME) ? true : false;
    }

    private isPayloadSelfSet(accounts: string[], issuer: string): boolean {
        let isSelfSet = false;
        this.accounts.forEach((account) => {
            if (account === issuer) {
                isSelfSet = true;
            }
        });
        return isSelfSet;
    }
}


