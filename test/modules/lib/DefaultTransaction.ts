import { ChainId, ChildTransactionSubtype, ChildTransactionType, Transaction } from "@blobaa/ardor-ts";


export default class DefaultTransaction {
    public static create(): Transaction {
        return {
            amountNQT: "0",
            attachment: {
                property: "dummy",
                value: "dummy",
            },
            block: "",
            blockTimestamp: 0,
            chain: ChainId.IGNIS,
            confirmations: 0,
            deadline: 0,
            ecBlockHeight: 0,
            ecBlockId: "0",
            feeNQT: "0",
            fullHash: "",
            fxtTransaction: "",
            height: 0,
            phased: false,
            recipient: "",
            recipientRS: "",
            requestProcessingTime: 0,
            sender: "",
            senderPublicKey: "",
            senderRS: "",
            signature: "",
            signatureHash: "",
            subtype: ChildTransactionSubtype.ACCOUNT_PROPERTY__SET,
            timestamp: 0,
            transactionIndex: 0,
            type: ChildTransactionType.ACCOUNT_PROPERTY,
            version: 0
        };
    }
}