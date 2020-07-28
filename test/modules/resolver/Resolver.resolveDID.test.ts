import { GetTransactionParams, Transaction, GetBlockchainTransactionsParams } from "@blobaa/ardor-ts";
import { Error, ErrorCode, ResolveDIDParams, Resolver, resolver } from "../../../src/index";
import config from "../../config";
import RequestMock, { GetTransactionCallback, GetBlockchainTransactionCallback } from "../../mocks/RequestMock";
import DefaultTransaction from "../lib/DefaultTransaction";


if (config.test.resolveDID) {
    describe("Resolver resolveDID method tests", () => {

        // test("resolveDID DID string format errors", async () => {
        //     const didParams: ResolveDIDParams = {
        //         did: "dd:baa:t:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f"
        //     };
        //     try {
        //         await resolver.resolveDID(config.node.url.testnet, didParams);
        //         fail("should not reach here");
        //     } catch (e) {
        //         const error = e as Error;
        //         expect(error.code).toBe(ErrorCode.INVALID_DID_IDENTIFIER);
        //         expect(error.description).toBeDefined();
        //     }


        //     didParams.did = "did:aa:t:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f";
        //     try {
        //         await resolver.resolveDID(config.node.url.testnet, didParams);
        //         fail("should not reach here");
        //     } catch (e) {
        //         const error = e as Error;
        //         expect(error.code).toBe(ErrorCode.INVALID_DID_METHOD);
        //         expect(error.description).toBeDefined();
        //     }


        //     didParams.did = "did:baa:i:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f";
        //     try {
        //         await resolver.resolveDID(config.node.url.testnet, didParams);
        //         fail("should not reach here");
        //     } catch (e) {
        //         const error = e as Error;
        //         expect(error.code).toBe(ErrorCode.INVALID_DID_NETWORK_TYPE);
        //         expect(error.description).toBeDefined();
        //     }


        //     didParams.did = "did:baa:t:ica5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f";
        //     try {
        //         await resolver.resolveDID(config.node.url.testnet, didParams);
        //         fail("should not reach here");
        //     } catch (e) {
        //         const error = e as Error;
        //         expect(error.code).toBe(ErrorCode.INVALID_DID_METHOD_SPECIFIC_IDENTIFIER);
        //         expect(error.description).toBeDefined();
        //     }


        //     didParams.did = "did:baa:t:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565";
        //     try {
        //         await resolver.resolveDID(config.node.url.testnet, didParams);
        //         fail("should not reach here");
        //     } catch (e) {
        //         const error = e as Error;
        //         expect(error.code).toBe(ErrorCode.INVALID_DID_METHOD_SPECIFIC_IDENTIFIER);
        //         expect(error.description).toBeDefined();
        //     }


        //     didParams.did = "did:baa:t:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565fe";
        //     try {
        //         await resolver.resolveDID(config.node.url.testnet, didParams);
        //         fail("should not reach here");
        //     } catch (e) {
        //         const error = e as Error;
        //         expect(error.code).toBe(ErrorCode.INVALID_DID_METHOD_SPECIFIC_IDENTIFIER);
        //         expect(error.description).toBeDefined();
        //     }

        // });


        test("resolveDID success", async () => {
             const getTransactionCallback: GetTransactionCallback = (params: GetTransactionParams) => {
                const transaction = DefaultTransaction.create();
                console.log("HERE");
                // expect(params.chain).toBe(ChainId.IGNIS);
                // expect(params.data).toBe(config.dummyDidDocument.doc1);
                // expect(params.name).toBe("blobaa-did-document-payload");
                // expect(params.secretPhrase).toBe(config.account.alice.secret);
                return transaction;
            };

            const getBcTransactionsCallback: GetBlockchainTransactionCallback = (params: GetBlockchainTransactionsParams) => {
                const transactions: Transaction[] = [];
                transactions.push(DefaultTransaction.create());
                // expect(params.chain).toBe(ChainId.IGNIS);
                // expect(params.secretPhrase).toBe(config.account.alice.secret);
                // expect(params.recipient).toBe(config.account.alice.address);

                return transactions;
            };

            const testResolver = new Resolver(new RequestMock(undefined, undefined, getTransactionCallback, getBcTransactionsCallback ));


            const didParams: ResolveDIDParams = {
                did: config.did.normal
            };
            const response = await testResolver.resolveDID(config.node.url.testnet, didParams);
            console.log(response);
        });
    });
} else {
    test("dummy", () => {
        expect(true).toBeTruthy();
    });
}