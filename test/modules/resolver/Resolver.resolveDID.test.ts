import { ChainId, ChildTransactionSubtype, ChildTransactionType, GetBlockchainTransactionsParams, GetTransactionParams } from "@blobaa/ardor-ts";
import { Error, ErrorCode, ResolveDIDParams, Resolver, resolver } from "../../../src/index";
import config from "../../config";
import RequestMock, { GetBlockchainTransactionCallback, GetTransactionCallback } from "../../mocks/RequestMock";
import DefaultTransaction from "../lib/DefaultTransaction";


if (config.test.resolveDID) {
    describe("Resolver resolveDID method tests", () => {

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


        test("resolveDID success", async () => {
            let getTransactionCounter = 0;
            const getTransactionCallback: GetTransactionCallback = (params: GetTransactionParams) => {
                const transaction = DefaultTransaction.create();

                if (getTransactionCounter === 0) { // get account property
                    expect(params.chain).toBe(ChainId.IGNIS);
                    expect(params.fullHash).toBe("5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f");

                    transaction.attachment = {
                        property: "did://dUZPPiukfaKyLuAaGUcZ",
                        value: "001|a|0000-0000-0000-00000|c|1ec58d15c6fa43de48fee4702cec26c2ac96002c2a114b06e87fdef72e795340"
                    };
                    transaction.senderRS = config.account.alice.address;
                    transaction.recipientRS = config.account.alice.address;
                    transaction.block = "10";
                    transaction.blockTimestamp = 11111;
                }

                if (getTransactionCounter === 1) { // get did document
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

            const getBcTransactionsCallback: GetBlockchainTransactionCallback = (params: GetBlockchainTransactionsParams) => {
                expect(params.account).toBe(config.account.alice.address);
                expect(params.chain).toBe(ChainId.IGNIS);
                expect(params.type).toBe(ChildTransactionType.ACCOUNT_PROPERTY);
                expect(params.subType).toBe(ChildTransactionSubtype.ACCOUNT_PROPERTY__SET);
                expect(params.timestamp).toBe(11111 + 1);
                expect(params.requireBlock).toBe("10");
                return [];
            };

            const testResolver = new Resolver(new RequestMock(undefined, undefined, getTransactionCallback, getBcTransactionsCallback ));


            const didParams: ResolveDIDParams = {
                did: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f"
            };

            const response = await testResolver.resolveDID(config.node.url.testnet, didParams);
            expect(response.didDocument).toEqual(config.didDocument.doc1);
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
    });
} else {
    test("dummy", () => {
        expect(true).toBeTruthy();
    });
}