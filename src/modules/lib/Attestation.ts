import { ChainId, ChildTransactionSubtype, ChildTransactionType, GetBlockchainTransactionsParams, IRequest, Transaction } from "@blobaa/ardor-ts";
import { ACCOUNT_PREFIX, MAX_ROTATION_HOPS, TRANSACTION_TIME_WINDOW } from "../../constants";
import { ErrorCode, State, Error } from "../../types";
import DataFields from "./DataField";
import ErrorHelper from "./ErrorHelper";


export type AttestationInfo = {
    dataFields: DataFields;
    accounts: string[];
}


export default class Attestation {
    private readonly request: IRequest;


    constructor(request: IRequest) {
        this.request = request;
    }


    public async parseAttestationPath(url: string, chainId: ChainId, txFullHash: string): Promise<AttestationInfo> {
        let isFirstIteration = true;
        let dataFields = new DataFields();
        let transaction: Transaction;
        const accounts: string[] = [];
        let rotationHops = 0;
        let timestamp = 0;

        do {
            if (isFirstIteration) {
                transaction = await this.getDIDCreatorAttestationTransaction(url, chainId, txFullHash);
                accounts.push(transaction.senderRS);
                isFirstIteration = false;
            } else {
                const newAccount = ACCOUNT_PREFIX + dataFields.redirectAccount;
                accounts.push(newAccount);
                transaction = await this.getDIDKeyRotatedAttestationTransaction(url, chainId, newAccount, timestamp, dataFields.didId);
            }

            dataFields = this.getSelfAttestationDataFields(transaction);

            const dataFieldsAndTxTimestamp = await this.getLastValidDataFieldsAndTimestamp(url, transaction, dataFields);
            dataFields = new DataFields(dataFieldsAndTxTimestamp.dataFields);
            timestamp = dataFieldsAndTxTimestamp.txTimestamp;


            if (dataFields.state === State.INACTIVE) {
                return Promise.reject(ErrorHelper.createError(ErrorCode.DID_DEACTIVATED));
            }

            if (rotationHops === MAX_ROTATION_HOPS) {
                return Promise.reject(ErrorHelper.createError(ErrorCode.TOO_MANY_ROTATION_HOPS));
            }

            rotationHops++;
        } while (dataFields.state === State.DEPRECATED);

        return { accounts, dataFields };
    }

    private async getDIDCreatorAttestationTransaction(url: string, chain: ChainId, fullHash: string): Promise<Transaction>  {
        try {
            return await this.request.getTransaction(url, { chain, fullHash });
        } catch (e) {
            const error = e as Error;
            if (error.code === 502) {
                return Promise.reject(ErrorHelper.createError(ErrorCode.DID_NOT_FOUND));
            } else {
                return Promise.reject(error);
            }
        }
    }

    private async getDIDKeyRotatedAttestationTransaction( url: string, chainId: ChainId, account: string,
                                                           timestamp: number, didId: string ): Promise<Transaction> {
        const params: GetBlockchainTransactionsParams = {
            chain: chainId,
            account,
            timestamp: timestamp - TRANSACTION_TIME_WINDOW,
            type: ChildTransactionType.ACCOUNT_PROPERTY,
            subType: ChildTransactionSubtype.ACCOUNT_PROPERTY__SET
        };
        const response = await this.request.getBlockchainTransactions(url, params);

        const transaction = this.extractDIDPropertyTransactions(response.transactions, didId)[0];
        if (!transaction) {
            return Promise.reject(ErrorHelper.createError(ErrorCode.DID_RESOLUTION_ERROR));
        }

        return transaction;
    }

    private extractDIDPropertyTransactions(transactions: Transaction[], didId: string): Transaction[] {
        const sortedTransactions = transactions.sort((tx1, tx2) => {
            return (tx1.timestamp > tx2.timestamp) ? 1 : -1;
        });

        const filteredTransaction = sortedTransactions.filter((tx) => {
            const _didId = tx.attachment.property;
            return _didId === didId;
        });

        return filteredTransaction;
    }

    private getSelfAttestationDataFields(transaction: Transaction): DataFields {
        if (!this.isSetPropertyTransactionType(transaction.type,transaction.subtype)) {
            throw ErrorHelper.createError(ErrorCode.DID_RESOLUTION_ERROR);
        }

        if (!this.isSelfAttestation(transaction.sender, transaction.recipient)) {
            throw ErrorHelper.createError(ErrorCode.DID_RESOLUTION_ERROR);
        }


        const attestation = transaction.attachment as { property: string; value: string };

        const dataFields = new DataFields();
        let error = dataFields.checkDidId(attestation.property);
        if (error.code !== ErrorCode.NO_ERROR) {
            throw error;
        }
        dataFields.didId = attestation.property;

        error = dataFields.consumeDataFieldString(attestation.value);
        if (error.code !== ErrorCode.NO_ERROR) {
            throw error;
        }

        if (!this.isAttestationActive(dataFields.state)) {
            throw ErrorHelper.createError(ErrorCode.DID_DEACTIVATED);
        }

        return dataFields;
    }

    private isSetPropertyTransactionType(type: number, subType: number): boolean {
        return (type === ChildTransactionType.ACCOUNT_PROPERTY && subType === ChildTransactionSubtype.ACCOUNT_PROPERTY__SET);
    }

    private isSelfAttestation(sender: string, receiver: string): boolean {
        return (sender === receiver);
    }

    private isAttestationActive(state: State): boolean {
        return (state === State.ACTIVE);
    }

    private async getLastValidDataFieldsAndTimestamp(
        url: string,
        transaction:
        Transaction,
        dataFields: DataFields
    ): Promise<{
        dataFields: DataFields;
        txTimestamp: number;
    }> {
        const params: GetBlockchainTransactionsParams = {
            chain: ChainId.IGNIS,
            account: transaction.senderRS,
            type: ChildTransactionType.ACCOUNT_PROPERTY,
            subType: ChildTransactionSubtype.ACCOUNT_PROPERTY__SET,
            timestamp: transaction.blockTimestamp + 1, // start searching from next block based on block with initial transaction
            requireBlock: transaction.block  // make sure block with initial transaction is present in blockchain
        };
        const setPropertyTransactions = await this.request.getBlockchainTransactions(url, params);
        const didTransactions = this.extractDIDPropertyTransactions(setPropertyTransactions.transactions, dataFields.didId);
        return this.extractLastValidDataFieldsAndTxTimestamp(didTransactions, dataFields);
    }

    private extractLastValidDataFieldsAndTxTimestamp (transactions: Transaction[], dataFields: DataFields): { dataFields: DataFields; txTimestamp: number} {
        let newDataFields = new DataFields(dataFields);
        let txTimestamp = 0;

        for (let i = 0 ; i < transactions.length ; i++) {
            const transaction = transactions[i];
            const _dataFields = new DataFields();

            const error = _dataFields.consumeDataFieldString(transaction.attachment.value);
            if (error.code === ErrorCode.NO_ERROR) {
                newDataFields = new DataFields(_dataFields);
                newDataFields.didId = dataFields.didId;
                txTimestamp = transaction.timestamp;

                if (newDataFields.state === State.INACTIVE || newDataFields.state === State.DEPRECATED) {
                    break;
                }
            }
        }

        return { dataFields: newDataFields, txTimestamp } ;
    }
}