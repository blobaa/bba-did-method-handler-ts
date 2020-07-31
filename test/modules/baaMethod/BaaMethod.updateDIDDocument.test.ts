import { ChainId, GetTransactionParams, SetAccountPropertyParams, UploadTaggedDataParams } from "@blobaa/ardor-ts";
import { Error, ErrorCode, BaaMethod, UpdateDIDDocumentParams } from "../../../src/index";
import config from "../../config";
import RequestMock, { GetTransactionCallback, SetAccountPropertyCallback, UploadTaggedDataCallback } from "../../mocks/RequestMock";
import DefaultTransaction from "../lib/DefaultTransaction";


if (config.test.updateDIDDocument) {
    describe("BaaMethod updateDIDDocument method tests", () => {

        test("updateDIDDocument success", async () => {
            const getTransactionCallback: GetTransactionCallback = (params: GetTransactionParams) => { // 1. get account property
                const transaction = DefaultTransaction.create();
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

                return transaction;
            };


            const uploadTaggedDataCallback: UploadTaggedDataCallback = (params: UploadTaggedDataParams) => { // 2. set new did document
                expect(params.chain).toBe(ChainId.IGNIS);
                expect(params.data).toBe(JSON.stringify(config.didDocument.doc2.cleaned));
                expect(params.name).toBe("blobaa-did-document-payload");
                expect(params.secretPhrase).toBe(config.account.alice.secret);

                return "3648ae8aa18516650a24054ecfe8c29d6b5698907629c552e296fdbda49abb82";
            };


            const setAccountPropertyCallback: SetAccountPropertyCallback = (params: SetAccountPropertyParams) => { // 3. update attestation
                expect(params.chain).toBe(ChainId.IGNIS);
                expect(params.secretPhrase).toBe(config.account.alice.secret);
                expect(params.recipient).toBe(config.account.alice.address);
                expect(params.property).toBe("did://dUZPPiukfaKyLuAaGUcZ");
                expect(params.value).toBe("001|a|0000-0000-0000-00000|c|3648ae8aa18516650a24054ecfe8c29d6b5698907629c552e296fdbda49abb82");

                return "5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f";
            };


            const testMethod = new BaaMethod(new RequestMock(setAccountPropertyCallback, uploadTaggedDataCallback, getTransactionCallback ));


            const didParams: UpdateDIDDocumentParams = {
                did: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f",
                passphrase: config.account.alice.secret,
                newDidDocumentTemplate: config.didDocument.doc2.cleaned
            };

            const response = await testMethod.updateDIDDocument(config.node.url.testnet, didParams);

            expect(response.did).toBe("did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f");
            expect(response.newDidDocument).toEqual(config.didDocument.doc2.resolved);
        });


        test("updateDIDController wrong controller error", async () => {
            const getTransactionCallback: GetTransactionCallback = (params: GetTransactionParams) => {
                const transaction = DefaultTransaction.create();

                expect(params.chain).toBe(ChainId.IGNIS);
                expect(params.fullHash).toBe("5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f");

                transaction.attachment = {
                    property: "did://dUZPPiukfaKyLuAaGUcZ",
                    value: "001|a|0000-0000-0000-00000|c|1ec58d15c6fa43de48fee4702cec26c2ac96002c2a114b06e87fdef72e795340"
                };
                transaction.senderRS = config.account.charlie.address;
                transaction.recipientRS = config.account.charlie.address;
                transaction.block = "10";
                transaction.blockTimestamp = 1000;

                return transaction;
            };


            const testMethod = new BaaMethod(new RequestMock(undefined, undefined, getTransactionCallback));


            const didParams: UpdateDIDDocumentParams = {
                did: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f",
                passphrase: config.account.alice.secret,
                newDidDocumentTemplate: config.didDocument.doc2.cleaned
            };

            try {
                await testMethod.updateDIDDocument(config.node.url.testnet, didParams);
                fail("should not reach here");
            } catch (e) {
                const error = e as Error;
                expect(error.code).toBe(ErrorCode.WRONG_CONTROLLER_ACCOUNT);
                expect(error.description).toBeTruthy();
            }
        });
    });
} else {
    test("dummy", () => {
        expect(true).toBeTruthy();
    });
}