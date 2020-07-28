import { account, ChainId, IRequest, SetAccountPropertyParams } from "@blobaa/ardor-ts";
import { ErrorCode, DeactivateDIDParams, DeactivateDIDResponse, State } from "../../../types";
import { IDIDRevocationService } from "../../internal-types";
import Attestation from "../../lib/Attestation";
import DataFields from "../../lib/DataField";
import DID from "../../lib/DID";
import ErrorHelper from "../../lib/ErrorHelper";


export default class RevocationService implements IDIDRevocationService {
    private readonly request: IRequest;


    constructor(request: IRequest) {
        this.request = request;
    }


    public async run(url: string, params: DeactivateDIDParams): Promise<DeactivateDIDResponse> {
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


        const dataFields = new DataFields(info.dataFields);
        dataFields.state = State.INACTIVE;

        const propertyParams: SetAccountPropertyParams = {
            chain: ChainId.IGNIS,
            property: dataFields.didId,
            value: dataFields.createDataFieldsString(),
            recipient: account.convertPassphraseToAccountRs(params.passphrase),
            secretPhrase: params.passphrase,
            feeNQT: params.feeNQT
        };

        await this.request.setAccountProperty(url, propertyParams);


        return { deactivatedDid: did.createDidString() };
    }
}