import { BroadcastTransactionParams, BroadcastTransactionResponse, DecodeTokenParams, DecodeTokenResponse, DeleteAccountPropertyParams, GetAccountPropertiesParams, GetAccountPropertiesResponse, GetBalanceParams, GetBalanceResponse, GetBlockchainTransactionsParams, GetBlockchainTransactionsResponse, GetBundlerRatesParams, GetBundlerRatesResponse, GetTransactionParams, IRequest, objectAny, SendMessageParams, SendMoneyParams, SetAccountPropertyParams, Transaction, UploadTaggedDataParams, DownloadTaggedDataParams, DownloadTaggedDataResponse } from "@blobaa/ardor-ts";
import { Error, ErrorCode } from "../../types";


export default class RequestWrapper implements IRequest {
    private request: IRequest;


    constructor(request: IRequest) {
        this.request = request;
    }


    private getError(error: objectAny): Error {
        if (error.syscall) {
            return {
                code: ErrorCode.CONNECTION_ERROR,
                description: "Connection error. Could not connect to node."
            };
        }
        if (error.errorCode) {
            return {
                code: ErrorCode.NODE_ERROR,
                description: error.errorDescription
            };
        }
        return error as Error;
    }


    public async downloadTaggedData(url: string, params: DownloadTaggedDataParams): Promise<DownloadTaggedDataResponse> {
         try {
            return await this.request.downloadTaggedData(url, params);
        } catch (error) {
            return Promise.reject(this.getError(error));
        }
    }


    public async getBlockchainTransactions(url: string, params: GetBlockchainTransactionsParams): Promise<GetBlockchainTransactionsResponse> {
        try {
            return await this.request.getBlockchainTransactions(url, params);
        } catch (error) {
            return Promise.reject(this.getError(error));
        }
    }


    public async getTransaction(url: string, params: GetTransactionParams): Promise<Transaction> {
        try {
            return await this.request.getTransaction(url, params);
        } catch (error) {
            return Promise.reject(this.getError(error));
        }
    }


    public async setAccountProperty(url: string, params: SetAccountPropertyParams): Promise<BroadcastTransactionResponse> {
        try {
            return await this.request.setAccountProperty(url, params);
        } catch (error) {
            return Promise.reject(this.getError(error));
        }
    }


    public async uploadTaggedData(url: string, params: UploadTaggedDataParams): Promise<BroadcastTransactionResponse> {
        try {
            return await this.request.uploadTaggedData(url, params);
        } catch (error) {
            return Promise.reject(this.getError(error));
        }
    }


    public async broadcastTransaction(url: string, params: BroadcastTransactionParams): Promise<BroadcastTransactionResponse> {
        throw new Error("Method not implemented.");
    }


    public async decodeToken(url: string, params: DecodeTokenParams): Promise<DecodeTokenResponse> {
        throw new Error("Method not implemented.");
    }


    public async deleteAccountProperty(url: string, params: DeleteAccountPropertyParams): Promise<BroadcastTransactionResponse> {
        throw new Error("Method not implemented.");
    }


    public async getAccountProperties(url: string, params: GetAccountPropertiesParams): Promise<GetAccountPropertiesResponse> {
        throw new Error("Method not implemented.");
    }


    public async getBalance(url: string, params: GetBalanceParams): Promise<GetBalanceResponse> {
        throw new Error("Method not implemented.");
    }


    public async getBundlerRates(url: string, params: GetBundlerRatesParams): Promise<GetBundlerRatesResponse> {
        throw new Error("Method not implemented.");
    }


    public async sendMessage(url: string, params: SendMessageParams): Promise<BroadcastTransactionResponse> {
        throw new Error("Method not implemented.");
    }


    public async sendMoney(url: string, params: SendMoneyParams): Promise<BroadcastTransactionResponse> {
        throw new Error("Method not implemented.");
    }

}