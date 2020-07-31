import { account, ChainId, IRequest, SetAccountPropertyParams } from "@blobaa/ardor-ts";
import { ErrorCode, State, UpdateDIDControllerParams, UpdateDIDControllerResponse } from "../../../types";
import { IDIDControllerUpdateService } from "../../internal-types";
import Attestation from "../../lib/Attestation";
import DataFields from "../../lib/DataField";
import DID from "../../lib/DID";
import ErrorHelper from "../../lib/ErrorHelper";


export default class ControllerUpdateService implements IDIDControllerUpdateService {
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
        const newControllerAccount = account.convertPassphraseToAccountRs(params.newPassphrase);

        if (currentControllerAccount !== specifiedControllerAccount) {
            const _error = ErrorHelper.createError(ErrorCode.WRONG_CONTROLLER_ACCOUNT, [specifiedControllerAccount, currentControllerAccount]);
            return Promise.reject(_error);
        }

        if (currentControllerAccount === newControllerAccount) {
            return Promise.reject(ErrorHelper.createError(ErrorCode.SAME_CONTROLLER_ACCOUNTS));
        }

        await this.updateControllerAccount(url, ChainId.IGNIS, params, info.dataFields);


        return { newControllerAccount , oldControllerAccount: currentControllerAccount, did: params.did };
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

        await this.request.setAccountProperty(url, updateCurrentControllerParams);
        await this.request.setAccountProperty(url, setNewControllerParams);
    }
}