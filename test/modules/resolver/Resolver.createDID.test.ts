import { ChainId, SetAccountPropertyParams, UploadTaggedDataParams } from "@blobaa/ardor-ts";
import { CreateDIDParams, Resolver } from "../../../src/index";
import config from "../../config";
import RequestMock, { SetAccountPropertyCallback, UploadTaggedDataCallback } from "../../mocks/RequestMock";


if (config.test.createDID) {
    describe("Resolver createDID method tests", () => {

        test("createDID testnet success", async () => {
            const uploadTaggedDataCallback: UploadTaggedDataCallback = (params: UploadTaggedDataParams) => { // 1. set did document
                expect(params.chain).toBe(ChainId.IGNIS);
                expect(params.data).toBe(JSON.stringify(config.didDocument.doc2.cleaned));
                expect(params.name).toBe("blobaa-did-document-payload");
                expect(params.secretPhrase).toBe(config.account.alice.secret);

                return "1ec58d15c6fa43de48fee4702cec26c2ac96002c2a114b06e87fdef72e795340";
            };


            const setAccountPropertyCallback: SetAccountPropertyCallback = (params: SetAccountPropertyParams) => { // 2. self attest account
                expect(params.chain).toBe(ChainId.IGNIS);
                expect(params.secretPhrase).toBe(config.account.alice.secret);
                expect(params.recipient).toBe(config.account.alice.address);

                const didPropertyElements = params.property.split("//");
                const didPropertyPrefix = didPropertyElements[0] + "//";
                const didId = didPropertyElements[1];
                expect(didPropertyPrefix).toBe("did://");
                expect(didId.length).toBe(20);

                return "5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f";
            };


            const testResolver = new Resolver(new RequestMock(setAccountPropertyCallback, uploadTaggedDataCallback ));


            const didParams: CreateDIDParams = {
                didDocumentTemplate: config.didDocument.doc2.resolved,
                passphrase: config.account.alice.secret,
                isTestnetDid: true
            };

            const response = await testResolver.createDID(config.node.url.testnet, didParams);

            const didElements = response.did.split(":");
            const didPrefix = didElements[0];
            const didMethod = didElements[1];
            const didNetwork = didElements[2];
            const didTxHash = didElements[3];

            expect(didPrefix).toBe("did");
            expect(didMethod).toBe("baa");
            expect(didNetwork).toBe("t");
            expect(didTxHash).toBe("5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f");

            expect(response.didDocument).toEqual(config.didDocument.doc2.resolvedTestnet);
        });


        test("createDID success", async () => {
            const uploadTaggedDataCallback: UploadTaggedDataCallback = (params: UploadTaggedDataParams) => {
                return "1ec58d15c6fa43de48fee4702cec26c2ac96002c2a114b06e87fdef72e795340";
            };

            const setAccountPropertyCallback: SetAccountPropertyCallback = (params: SetAccountPropertyParams) => {
                return "5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f";
            };

            const testResolver = new Resolver(new RequestMock(setAccountPropertyCallback, uploadTaggedDataCallback ));


            const didParams: CreateDIDParams = {
                didDocumentTemplate: config.didDocument.doc1.cleaned,
                passphrase: config.account.alice.secret
            };

            const response = await testResolver.createDID(config.node.url.testnet, didParams);
            const didElements = response.did.split(":");
            const didPrefix = didElements[0];
            const didMethod = didElements[1];
            const didTxHash = didElements[2];

            expect(didPrefix).toBe("did");
            expect(didMethod).toBe("baa");
            expect(didTxHash).toBe("5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f");

            expect(response.didDocument).toEqual(config.didDocument.doc1.resolved);
        });
    });
} else {
    test("dummy", () => {
        expect(true).toBeTruthy();
    });
}


