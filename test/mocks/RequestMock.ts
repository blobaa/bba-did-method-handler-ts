import { GetAccountPropertiesParams, GetAccountPropertiesResponse, Request, SetAccountPropertyParams, SetAccountPropertyResponse, UploadTaggedDataParams, UploadTaggedDataResponse } from "@blobaa/ardor-ts";


export type SetAccountPropertyCallback = (params: SetAccountPropertyParams) => string;
export type GetAccountPropertyCallback = (params: GetAccountPropertiesParams) => { context: string; dataFieldsString: string };
export type UploadTaggedDataCallback = (params: UploadTaggedDataParams) => string;


export default class RequestMock extends Request {
    private readonly defaultResponse = { requestProcessingTime: 0, fullHash: "dummy" };

    private setAccPropCallback: SetAccountPropertyCallback;
    private getAccPropCallback: GetAccountPropertyCallback;
    private uploadDataCallback: UploadTaggedDataCallback;


    constructor(setAccPropCallback?: SetAccountPropertyCallback,
                uploadTaggedDataCallback?: UploadTaggedDataCallback,
                getAccPropCallback?: GetAccountPropertyCallback) {
        super();
        this.getAccPropCallback = getAccPropCallback || this.defaultGetAccPropCallback;
        this.setAccPropCallback = setAccPropCallback || this.defaultSetAccPropCallback;
        this.uploadDataCallback = uploadTaggedDataCallback || this.defaultUploadDataCallback;
    }

    private defaultGetAccPropCallback: GetAccountPropertyCallback = (params: GetAccountPropertiesParams) => { return { context: "", dataFieldsString: "" } }
    private defaultSetAccPropCallback: SetAccountPropertyCallback = (params: SetAccountPropertyParams) => { return "" }
    private defaultUploadDataCallback: UploadTaggedDataCallback = (params: UploadTaggedDataParams) => { return "" }


    public getAccountProperties = (url: string, params: GetAccountPropertiesParams): Promise<GetAccountPropertiesResponse> => {
        const callbackReturn = this.getAccPropCallback(params);
        return Promise.resolve(this.assembleAccountPropertyResponse(callbackReturn.context, callbackReturn.dataFieldsString));
    }

    private assembleAccountPropertyResponse = (property: string, value: string): GetAccountPropertiesResponse => {
        const resp = {
            recipientRS: "",
            recipient: "",
            requestProcessingTime: 0,
            /*eslint-disable @typescript-eslint/no-explicit-any*/
            properties: [] as any
            /*eslint-enable @typescript-eslint/no-explicit-any*/
        };
        if (value !== "none") {
            resp.properties.push({
                setterRS: "",
                property,
                setter: "",
                value
            });
        }
        return resp as GetAccountPropertiesResponse;
    }


    public setAccountProperty = (url: string, params: SetAccountPropertyParams): Promise<SetAccountPropertyResponse> => {
        const callbackReturn = this.setAccPropCallback(params);
        return Promise.resolve(this.assembleBroadcastResponse(callbackReturn));
    }

    private assembleBroadcastResponse = (fullHash = "", requestProcessingTime = 0): { requestProcessingTime: number; fullHash: string } => {
        return { requestProcessingTime, fullHash };
    }


    public uploadTaggedData = (url: string, params: UploadTaggedDataParams): Promise<UploadTaggedDataResponse> => {
        const callbackReturn = this.uploadDataCallback(params);
        return Promise.resolve(this.assembleBroadcastResponse(callbackReturn));
    }
}