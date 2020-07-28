import { ChainId, ChildTransactionSubtype, ChildTransactionType, GetBlockchainTransactionsParams, GetTransactionParams, Transaction } from "@blobaa/ardor-ts";
import { ACCOUNT_PREFIX, TRANSACTION_TIME_WINDOW } from "../../../src/constants";
import { Error, ErrorCode, ResolveDIDParams, Resolver, resolver } from "../../../src/index";
import config from "../../config";
import RequestMock, { GetBlockchainTransactionCallback, GetTransactionCallback } from "../../mocks/RequestMock";
import DefaultTransaction from "../lib/DefaultTransaction";


if (config.test.resolveDID) {
    describe("Resolver resolveDID method tests", () => {

        test("resolveDID success", async () => {
            let getTransactionCounter = 0;
            const getTransactionCallback: GetTransactionCallback = (params: GetTransactionParams) => {
                const transaction = DefaultTransaction.create();

                if (getTransactionCounter === 0) { // 1. get account property
                    expect(params.chain).toBe(ChainId.IGNIS);
                    expect(params.fullHash).toBe("5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f");

                    transaction.attachment = {
                        property: "did://dUZPPiukfaKyLuAaGUcZ",
                        value: "001|a|0000-0000-0000-00000|c|1ec58d15c6fa43de48fee4702cec26c2ac96002c2a114b06e87fdef72e795340"
                    };
                    transaction.senderRS = config.account.alice.address;
                    transaction.recipientRS = config.account.alice.address;
                    transaction.block = "10";
                    transaction.blockTimestamp = 1000;
                }

                if (getTransactionCounter === 1) { // 3. get did document
                    expect(params.chain).toBe(ChainId.IGNIS);
                    expect(params.fullHash).toBe("1ec58d15c6fa43de48fee4702cec26c2ac96002c2a114b06e87fdef72e795340");

                    transaction.attachment = {
                        data: JSON.stringify(config.didDocument.doc1),
                        name: "blobaa-did-document-payload"
                    };
                    transaction.senderRS = config.account.alice.address;
                }

                getTransactionCounter++;
                return transaction;
            };


            let checkedForUpdate = false;
            const getBcTransactionsCallback: GetBlockchainTransactionCallback = (params: GetBlockchainTransactionsParams) => {
                // 2. get updated did attestations
                expect(params.account).toBe(config.account.alice.address);
                expect(params.chain).toBe(ChainId.IGNIS);
                expect(params.type).toBe(ChildTransactionType.ACCOUNT_PROPERTY);
                expect(params.subType).toBe(ChildTransactionSubtype.ACCOUNT_PROPERTY__SET);
                expect(params.timestamp).toBe(1000 + 1);
                expect(params.requireBlock).toBe("10");

                checkedForUpdate = true;
                return [];
            };


            const testResolver = new Resolver(new RequestMock(undefined, undefined, getTransactionCallback, getBcTransactionsCallback));


            const didParams: ResolveDIDParams = {
                did: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f"
            };

            const response = await testResolver.resolveDID(config.node.url.testnet, didParams);
            expect(response.didDocument).toEqual(config.didDocument.doc1);
            expect(checkedForUpdate).toBeTruthy();
        });


        test("resolveDID success with key rotation", async () => {
            let getTransactionCounter = 0;
            const getTransactionCallback: GetTransactionCallback = (params: GetTransactionParams) => {
                const transaction = DefaultTransaction.create();

                if (getTransactionCounter === 0) { // 1. get account property
                    transaction.attachment = {
                        property: "did://dUZPPiukfaKyLuAaGUcZ",
                        value: "001|a|0000-0000-0000-00000|c|1ec58d15c6fa43de48fee4702cec26c2ac96002c2a114b06e87fdef72e795340"
                    };
                    transaction.senderRS = config.account.alice.address;
                    transaction.recipientRS = config.account.alice.address;
                    transaction.block = "10";
                    transaction.blockTimestamp = 1000;
                }

                if (getTransactionCounter === 1) { // 5. get did document
                    expect(params.chain).toBe(ChainId.IGNIS);
                    expect(params.fullHash).toBe("1ec58d15c6fa43de48fee4702cec26c2ac96002c2a114b06e87fdef72e795340");

                    transaction.attachment = {
                        data: JSON.stringify(config.didDocument.doc1),
                        name: "blobaa-did-document-payload"
                    };
                    transaction.senderRS = config.account.alice.address;
                }

                getTransactionCounter++;
                return transaction;
            };


            let getBcTransactionsCounter = 0;
            let checkedForUpdate = false;
            const getBcTransactionsCallback: GetBlockchainTransactionCallback = (params: GetBlockchainTransactionsParams) => {
                const transactions: Transaction[] = [];

                if (getBcTransactionsCounter === 0) { // 2. get updated did attestations
                    transactions.push(DefaultTransaction.create());

                    const transaction = DefaultTransaction.create();
                    transaction.attachment = {
                        property: "did://dUZPPiukfaKyLuAaGUcZ",
                        value: "001|d|" + config.account.bob.address.substr(ACCOUNT_PREFIX.length) + "|c|1ec58d15c6fa43de48fee4702cec26c2ac96002c2a114b06e87fdef72e795340"
                    };
                    transaction.senderRS = config.account.alice.address;
                    transaction.recipientRS = config.account.alice.address;
                    transaction.block = "11";
                    transaction.blockTimestamp = 2000;
                    transaction.timestamp = 2000;

                    transactions.push(transaction);
                }

                if (getBcTransactionsCounter === 1) { // 3. get first valid transaction from referenced account
                    expect(params.chain).toBe(ChainId.IGNIS);
                    expect(params.account).toBe(config.account.bob.address);
                    expect(params.timestamp).toBe(2000 - TRANSACTION_TIME_WINDOW);
                    expect(params.type).toBe(ChildTransactionType.ACCOUNT_PROPERTY);
                    expect(params.subType).toBe(ChildTransactionSubtype.ACCOUNT_PROPERTY__SET);

                    transactions.push(DefaultTransaction.create());

                    const transaction = DefaultTransaction.create();
                    transaction.attachment = {
                        property: "did://dUZPPiukfaKyLuAaGUcZ",
                        value: "001|a|0000-0000-0000-00000|c|1ec58d15c6fa43de48fee4702cec26c2ac96002c2a114b06e87fdef72e795340"
                    };
                    transaction.senderRS = config.account.bob.address;
                    transaction.recipientRS = config.account.bob.address;
                    transaction.block = "12";
                    transaction.blockTimestamp = 3000;
                    transaction.timestamp = 3000;

                    transactions.push(transaction);
                }

                if (getBcTransactionsCounter === 2) { // 4. get updated did attestations at new account
                    expect(params.account).toBe(config.account.bob.address);
                    expect(params.chain).toBe(ChainId.IGNIS);
                    expect(params.type).toBe(ChildTransactionType.ACCOUNT_PROPERTY);
                    expect(params.subType).toBe(ChildTransactionSubtype.ACCOUNT_PROPERTY__SET);
                    expect(params.timestamp).toBe(3000 + 1);
                    expect(params.requireBlock).toBe("12");

                    checkedForUpdate = true;
                }

                getBcTransactionsCounter++;
                return transactions;
            };


            const testResolver = new Resolver(new RequestMock(undefined, undefined, getTransactionCallback, getBcTransactionsCallback ));


            const didParams: ResolveDIDParams = {
                did: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f"
            };

            const response = await testResolver.resolveDID(config.node.url.testnet, didParams);
            expect(response.didDocument).toEqual(config.didDocument.doc1);
            expect(checkedForUpdate).toBeTruthy();
        });


        test("resolveDID did inactive", async () => {
            let getTransactionCounter = 0;
            const getTransactionCallback: GetTransactionCallback = (params: GetTransactionParams) => {
                const transaction = DefaultTransaction.create();

                if (getTransactionCounter === 0) { // 1. get account property
                    expect(params.chain).toBe(ChainId.IGNIS);
                    expect(params.fullHash).toBe("5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f");

                    transaction.attachment = {
                        property: "did://dUZPPiukfaKyLuAaGUcZ",
                        value: "001|a|0000-0000-0000-00000|c|1ec58d15c6fa43de48fee4702cec26c2ac96002c2a114b06e87fdef72e795340"
                    };
                    transaction.senderRS = config.account.alice.address;
                    transaction.recipientRS = config.account.alice.address;
                    transaction.block = "10";
                    transaction.blockTimestamp = 1000;
                }

                if (getTransactionCounter === 1) { // 3. get did document
                    fail("should not reach here");
                }

                getTransactionCounter++;
                return transaction;
            };


            const getBcTransactionsCallback: GetBlockchainTransactionCallback = (params: GetBlockchainTransactionsParams) => {
                // 2. get updated did attestations
                const transactions: Transaction[] = [];
                transactions.push(DefaultTransaction.create());


                const deactivateTx = DefaultTransaction.create();
                deactivateTx.attachment = {
                    property: "did://dUZPPiukfaKyLuAaGUcZ",
                    value: "001|i|0000-0000-0000-00000|c|1ec58d15c6fa43de48fee4702cec26c2ac96002c2a114b06e87fdef72e795340"
                };
                deactivateTx.senderRS = config.account.alice.address;
                deactivateTx.recipientRS = config.account.alice.address;
                deactivateTx.block = "11";
                deactivateTx.blockTimestamp = 2000;
                deactivateTx.timestamp = 2000;

                transactions.push(deactivateTx);


                const reactivateTx = DefaultTransaction.create();
                reactivateTx.attachment = {
                    property: "did://dUZPPiukfaKyLuAaGUcZ",
                    value: "001|a|0000-0000-0000-00000|c|1ec58d15c6fa43de48fee4702cec26c2ac96002c2a114b06e87fdef72e795340"
                };
                reactivateTx.senderRS = config.account.alice.address;
                reactivateTx.recipientRS = config.account.alice.address;
                reactivateTx.block = "12";
                reactivateTx.blockTimestamp = 3000;
                reactivateTx.timestamp = 3000;

                transactions.push(reactivateTx);


                return transactions;
            };


            const testResolver = new Resolver(new RequestMock(undefined, undefined, getTransactionCallback, getBcTransactionsCallback));


            const didParams: ResolveDIDParams = {
                did: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f"
            };

            try {
                await testResolver.resolveDID(config.node.url.testnet, didParams);
                fail("should not reach here");
            } catch (e) {
                const error = e as Error;
                expect(error.code).toBe(ErrorCode.DID_DEACTIVATED);
                expect(error.description).toBeTruthy();
            }
        });


        test("resolveDID DID string format errors", async () => {
            const didParams: ResolveDIDParams = {
                did: "dd:baa:t:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f"
            };
            try {
                await resolver.resolveDID(config.node.url.testnet, didParams);
                fail("should not reach here");
            } catch (e) {
                const error = e as Error;
                expect(error.code).toBe(ErrorCode.INVALID_DID_IDENTIFIER);
                expect(error.description).toBeDefined();
            }


            didParams.did = "did:aa:t:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f";
            try {
                await resolver.resolveDID(config.node.url.testnet, didParams);
                fail("should not reach here");
            } catch (e) {
                const error = e as Error;
                expect(error.code).toBe(ErrorCode.INVALID_DID_METHOD);
                expect(error.description).toBeDefined();
            }


            didParams.did = "did:baa:i:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f";
            try {
                await resolver.resolveDID(config.node.url.testnet, didParams);
                fail("should not reach here");
            } catch (e) {
                const error = e as Error;
                expect(error.code).toBe(ErrorCode.INVALID_DID_NETWORK_TYPE);
                expect(error.description).toBeDefined();
            }


            didParams.did = "did:baa:t:ica5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f";
            try {
                await resolver.resolveDID(config.node.url.testnet, didParams);
                fail("should not reach here");
            } catch (e) {
                const error = e as Error;
                expect(error.code).toBe(ErrorCode.INVALID_DID_METHOD_SPECIFIC_IDENTIFIER);
                expect(error.description).toBeDefined();
            }


            didParams.did = "did:baa:t:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565";
            try {
                await resolver.resolveDID(config.node.url.testnet, didParams);
                fail("should not reach here");
            } catch (e) {
                const error = e as Error;
                expect(error.code).toBe(ErrorCode.INVALID_DID_METHOD_SPECIFIC_IDENTIFIER);
                expect(error.description).toBeDefined();
            }


            didParams.did = "did:baa:t:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565fe";
            try {
                await resolver.resolveDID(config.node.url.testnet, didParams);
                fail("should not reach here");
            } catch (e) {
                const error = e as Error;
                expect(error.code).toBe(ErrorCode.INVALID_DID_METHOD_SPECIFIC_IDENTIFIER);
                expect(error.description).toBeDefined();
            }

        });


        test("resolveDID no baa method property error", async () => {
             const getTransactionCallback: GetTransactionCallback = (params: GetTransactionParams) => {
                const transaction = DefaultTransaction.create();
                return transaction;
            };

            const testResolver = new Resolver(new RequestMock(undefined, undefined, getTransactionCallback));


            const didParams: ResolveDIDParams = {
                did: config.did.string
            };

            try {
                await testResolver.resolveDID(config.node.url.testnet, didParams);
                fail("should not success");
            } catch (e) {
                const error = e as Error;
                expect(error.code).toBe(ErrorCode.INVALID_PROPERTY_NAME);
                expect(error.description).toBeTruthy();
            }
        });


        /* TODO: add more failing tests */

    });
} else {
    test("dummy", () => {
        expect(true).toBeTruthy();
    });
}