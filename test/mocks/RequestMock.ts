import { DownloadTaggedDataParams, DownloadTaggedDataResponse, GetBlockchainTransactionsParams, GetBlockchainTransactionsResponse, GetTransactionParams, GetTransactionResponse, Request, SetAccountPropertyParams, SetAccountPropertyResponse, Transaction, UploadTaggedDataParams, UploadTaggedDataResponse } from "@blobaa/ardor-ts";
import DefaultTransaction from "../modules/lib/DefaultTransaction";


export type SetAccountPropertyCallback = (params: SetAccountPropertyParams) => string;
export type UploadTaggedDataCallback = (params: UploadTaggedDataParams) => string;
export type GetTransactionCallback = (params: GetTransactionParams) => Transaction;
export type GetBlockchainTransactionCallback = (params: GetBlockchainTransactionsParams) => Transaction[];
export type DownloadTaggedDataCallback = (params: DownloadTaggedDataParams) => DownloadTaggedDataResponse;


export default class RequestMock extends Request {
    private setAccPropCallback: SetAccountPropertyCallback;
    private uploadDataCallback: UploadTaggedDataCallback;
    private getTransactionCallback: GetTransactionCallback;
    private getBcTransactionsCallback: GetBlockchainTransactionCallback;
    private downloadDataCallback: DownloadTaggedDataCallback;


    constructor(
        setAccPropCallback?: SetAccountPropertyCallback,
        uploadTaggedDataCallback?: UploadTaggedDataCallback,
        getTransactionCallback?: GetTransactionCallback,
        getBcTransactionsCallback?: GetBlockchainTransactionCallback,
        downloadDataCallback?: DownloadTaggedDataCallback
    ) {
        super();
        this.setAccPropCallback = setAccPropCallback || this.defaultSetAccPropCallback;
        this.uploadDataCallback = uploadTaggedDataCallback || this.defaultUploadDataCallback;
        this.getTransactionCallback = getTransactionCallback || this.defaultGetTransactionCallback;
        this.getBcTransactionsCallback = getBcTransactionsCallback || this.defaultGetBcTransactionsCallback;
        this.downloadDataCallback = downloadDataCallback || this.defaultDownloadDataCallback;
    }

    private defaultSetAccPropCallback: SetAccountPropertyCallback = (params: SetAccountPropertyParams) => {
        return "";
    }

    private defaultUploadDataCallback: UploadTaggedDataCallback = (params: UploadTaggedDataParams) => {
        return "";
    }

    private defaultGetTransactionCallback: GetTransactionCallback = (params: GetTransactionParams) => {
        return DefaultTransaction.create();
    }

    private defaultGetBcTransactionsCallback: GetBlockchainTransactionCallback = (params: GetBlockchainTransactionsParams) => {
        return [];
    }

    private defaultDownloadDataCallback: DownloadTaggedDataCallback = (params: DownloadTaggedDataParams) => {
        return "";
    }


    public setAccountProperty(url: string, params: SetAccountPropertyParams): Promise<SetAccountPropertyResponse> {
        const callbackReturn = this.setAccPropCallback(params);
        return Promise.resolve(this.assembleBroadcastResponse(callbackReturn));
    }

    private assembleBroadcastResponse(fullHash = "", requestProcessingTime = 0): { requestProcessingTime: number; fullHash: string } {
        return { requestProcessingTime, fullHash };
    }


    public uploadTaggedData(url: string, params: UploadTaggedDataParams): Promise<UploadTaggedDataResponse> {
        const callbackReturn = this.uploadDataCallback(params);
        return Promise.resolve(this.assembleBroadcastResponse(callbackReturn));
    }


    public getTransaction(url: string, params: GetTransactionParams): Promise<GetTransactionResponse> {
        const callbackReturn = this.getTransactionCallback(params);
        return Promise.resolve(callbackReturn);
    }


    public getBlockchainTransactions(url: string, params: GetBlockchainTransactionsParams): Promise<GetBlockchainTransactionsResponse> {
        const callbackReturn = this.getBcTransactionsCallback(params);
        return Promise.resolve({ transactions: callbackReturn, requestProcessingTime: 0 });
    }


    public downloadTaggedData(url: string, params: DownloadTaggedDataParams): Promise<DownloadTaggedDataResponse> {
        const callbackReturn = this.downloadDataCallback(params);
        return  Promise.resolve(callbackReturn);
    }
}