import { ChildTransactionSubtype, ChildTransactionType, GetTransactionParams, IRequest } from "@blobaa/ardor-ts";
import { ErrorCode, State } from "../../types";
import DataFields from "./DataField";
import ErrorHelper from "./ErrorHelper";


export type AttestationInfo = {
    dataFields: DataFields;
    accounts: string[];
}


export class Attestation {
    private readonly request: IRequest;


    constructor(request: IRequest) {
        this.request = request;
    }


    public async parseTrustChain(url: string, params: GetTransactionParams): Promise<AttestationInfo> {
        const transaction = await this.request.getTransaction(url, params);

        if (!this.isSetPropertyTransactionType(transaction.type,transaction.subtype)) {
            const _error = Promise.reject(ErrorHelper.createError(ErrorCode.DID_RESOLUTION_ERROR));
            return _error;
        }

        if (!this.isSelfAttestation(transaction.sender, transaction.recipient)) {
            const _error = Promise.reject(ErrorHelper.createError(ErrorCode.DID_RESOLUTION_ERROR));
            return _error;
        }


        const attestation = transaction.attachment as {property: string; value: string};
        const dataFields = new DataFields();

        let error = dataFields.checkDidId(attestation.property);
        if (error.code !== ErrorCode.NO_ERROR) {
            return Promise.reject(error);
        }
        dataFields.didId = attestation.property;

        error = dataFields.consumeDataFieldString(attestation.value);
        if (error.code !== ErrorCode.NO_ERROR) {
            return Promise.reject(error);
        }

        if (!this.isAttestationActive(dataFields.state)) {
            const _error = Promise.reject(ErrorHelper.createError(ErrorCode.DID_RESOLUTION_ERROR));
            return _error;
        }


        /* TODO: current account */

        const accountRS = transaction.senderRS;
        return { accounts: [accountRS], dataFields };
    }

    private isSetPropertyTransactionType(type: number, subType: number): boolean {
        return (type === ChildTransactionType.ACCOUNT_PROPERTY && subType === ChildTransactionSubtype.ACCOUNT_PROPERTY__SET);
    }

    private isSelfAttestation(sender: string, receiver: string): boolean {
        return (sender === receiver);
    }

    private isAttestationActive(state: State): boolean {
        return (state === State.ACTIVE);
    }
}