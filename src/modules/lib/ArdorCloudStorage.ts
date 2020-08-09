import { ChainId, DownloadTaggedDataResponse, GetTransactionResponse, IRequest, UploadTaggedDataParams } from "@blobaa/ardor-ts";
import { DATA_CLOUD_NAME } from "../../constants";
import { ErrorCode } from "../../types";
import { IDataStorage } from "../internal-types";
import ErrorHelper from "./ErrorHelper";


export default class ArdorCloudStorage implements IDataStorage {
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


    public async storeData(data: string): Promise<string> {
        const params: UploadTaggedDataParams = {
            chain: this.chainId,
            name: DATA_CLOUD_NAME,
            data,
            secretPhrase: this.secretPhrase,
            feeNQT: this.feeNQT
        };

        const response = await this.request.uploadTaggedData(this.url, params);
        return response.fullHash;
    }


    public async retrieveData(reference: string): Promise<string> {
        const txInfo = await this.request.getTransaction(this.url, {
            chain: this.chainId,
            fullHash: reference
        });

        const data = await this.request.downloadTaggedData(this.url, {
            chain: this.chainId,
            fullHash: reference,
            retrieve: true
        });

        return this.extractData(txInfo, data);
    }

    private extractData(txInfo: GetTransactionResponse, data: DownloadTaggedDataResponse): Promise<string> {
        const issuer = txInfo.senderRS;

        if (!this.isDataAvailable(data)) {
            const error = ErrorHelper.createError(ErrorCode.DIDDOC_NOT_FOUND);
            return Promise.reject(error);
        }

        if (!this.isDataSelfSet(this.accounts, issuer)) {
            const error = ErrorHelper.createError(ErrorCode.INVALID_DIDDOC);
            return Promise.reject(error);
        }

        return Promise.resolve(data);
    }

    private isDataAvailable(data: string | undefined): boolean {
        return data ? true : false;
    }

    private isDataSelfSet(accounts: string[], issuer: string): boolean {
        let isSelfSet = false;
        this.accounts.forEach((account) => {
            if (account === issuer) {
                isSelfSet = true;
            }
        });
        return isSelfSet;
    }
}


