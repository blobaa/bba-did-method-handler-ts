import { ChainId, IRequest, account, SetAccountPropertyParams, secureAny } from "@blobaa/ardor-ts";
import { ErrorCode, UpdateDIDControllerParams, UpdateDIDControllerResponse, State, objectAny } from "../../../types";
import { IUpdateControllerService } from "../../internal-types";
import { Attestation } from "../../lib/Attestation";
import DID from "../../lib/DID";
import ErrorHelper from "../../lib/ErrorHelper";
import DataFields from "../../lib/DataField";


export default class ControllerUpdateService implements IUpdateControllerService {
    private readonly request: IRequest;


    constructor(request: IRequest) {
        this.request = request;
    }


    public async run(url: string, params: UpdateDIDControllerParams): Promise<UpdateDIDControllerResponse> {
        const did = new DID();
        const error = did.consumeDIDString(params.did);
        if (error.code !== ErrorCode.NO_ERROR) {
            return Promise.reject(error);
        }

        const attestation = new Attestation(this.request);
        const info = await attestation.parseTrustChain(url, ChainId.IGNIS, did.fullHash);

        const currentControllerAccount = info.accounts[info.accounts.length - 1];
        const specifiedControllerAccount = account.convertPassphraseToAccountRs(params.passphrase);
        if (currentControllerAccount !== specifiedControllerAccount) {
            const _error = ErrorHelper.createError(ErrorCode.WRONG_CONTROLLER_ACCOUNT, [specifiedControllerAccount, currentControllerAccount]);
            return Promise.reject(_error);
        }


        return new Promise(resolve => resolve({ fullHash: "", requestProcessingTime: 0 }));
    }

    private async updateControllerAccount(url: string, chainId: ChainId.IGNIS, params: UpdateDIDControllerParams, dataFields: DataFields): Promise<void> {
        const currentControllerAccount = account.convertPassphraseToAccountRs(params.passphrase);
        const newControllerAccount = account.convertPassphraseToAccountRs(params.newPassphrase);
        const currentControllerDataFields = new DataFields(dataFields);
        const newControllerDataFields = new DataFields(dataFields);

        currentControllerDataFields.redirectAccount = newControllerAccount;
        currentControllerDataFields.state = State.DEPRECATED;


        const updateCurrentControllerParams: SetAccountPropertyParams = {
            chain: chainId,
            property: currentControllerDataFields.didId,
            value: currentControllerDataFields.createDataFieldsString(),
            recipient: currentControllerAccount,
            secretPhrase: params.passphrase,
            feeNQT: params.feeNQT
        };

        const setNewControllerParams: SetAccountPropertyParams = {
            chain: chainId,
            property: newControllerDataFields.didId,
            value: newControllerDataFields.createDataFieldsString(),
            recipient: newControllerAccount,
            secretPhrase: params.newPassphrase,
            feeNQT: params.feeNQT
        };

    //     // try {
    //     //     const responses = await Promise.all([
    //     //         this.helper.createAttestationTransaction(url, params.passphrase, newAttestedAccount, newDataFields, params.feeNQT),
    //     //         this.helper.createAttestationTransaction(url, params.passphrase, currentAttestedAccount, currentDataFields, params.feeNQT)
    //     //     ]);
    //     //     return { transactionId: responses[0].fullHash };
    //     // } catch (e) {
    //     //     return Promise.reject(Helper.getError(e));
    //     // }
    // }

    // private async createTransaction(url: string, params: objectAny, requestType: RequestType): Promise<objectAny> {
    //     switch (requestType) {
    //         case ErrorCode.WRONG_CONTROLLER_ACCOUNT: {
    //             error.description = "Wrong controller Account. " + "Account " + _params[0] + "does not control DID. Current controller is " + _params[1] + ".";
    //             return error;
    //         }
    //         default:
    //             return { code: ErrorCode.UNKNOWN, description: "An unknown error occurred." };
    //     }
    //     }
    }


}