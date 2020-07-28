import { ChainId, SetAccountPropertyParams, UploadTaggedDataParams } from "@blobaa/ardor-ts";
import { CreateDIDParams, Resolver } from "../../../src/index";
import config from "../../config";
import RequestMock, { SetAccountPropertyCallback, UploadTaggedDataCallback } from "../../mocks/RequestMock";


if (config.test.createDID) {
    describe("Resolver createDID method tests", () => {

        test("createDID testnet success", async () => {
            const uploadTaggedDataCallback: UploadTaggedDataCallback = (params: UploadTaggedDataParams) => {
                expect(params.chain).toBe(ChainId.IGNIS);
                expect(params.data).toBe(JSON.stringify(config.didDocument.doc1));
                expect(params.name).toBe("blobaa-did-document-payload");
                expect(params.secretPhrase).toBe(config.account.alice.secret);
                return config.hash.dataCloud;
            };

            const setAccountPropertyCallback: SetAccountPropertyCallback = (params: SetAccountPropertyParams) => {
                expect(params.chain).toBe(ChainId.IGNIS);
                expect(params.secretPhrase).toBe(config.account.alice.secret);
                expect(params.recipient).toBe(config.account.alice.address);

                const didPropertyElements = params.property.split("//");
                const didPropertyPrefix = didPropertyElements[0] + "//";
                const didId = didPropertyElements[1];
                expect(didPropertyPrefix).toBe("did://");
                expect(didId.length).toBe(20);

                return config.hash.property;
            };

            const testResolver = new Resolver(new RequestMock(setAccountPropertyCallback, uploadTaggedDataCallback ));


            const didParams: CreateDIDParams = {
                didDocument: config.didDocument.doc1,
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
            expect(didTxHash).toBe(config.hash.property);

            expect(response.didDocument).toBe(config.didDocument.doc1);
        });


        test("createDID success", async () => {
            const uploadTaggedDataCallback: UploadTaggedDataCallback = (params: UploadTaggedDataParams) => {
                return config.hash.dataCloud;
            };

            const setAccountPropertyCallback: SetAccountPropertyCallback = (params: SetAccountPropertyParams) => {
                return config.hash.property;
            };

            const testResolver = new Resolver(new RequestMock(setAccountPropertyCallback, uploadTaggedDataCallback ));


            const didParams: CreateDIDParams = {
                didDocument: config.didDocument.doc1,
                passphrase: config.account.alice.secret
            };

            const response = await testResolver.createDID(config.node.url.testnet, didParams);
            const didElements = response.did.split(":");
            const didPrefix = didElements[0];
            const didMethod = didElements[1];
            const didTxHash = didElements[2];

            expect(didPrefix).toBe("did");
            expect(didMethod).toBe("baa");
            expect(didTxHash).toBe(config.hash.property);

            expect(response.didDocument).toBe(config.didDocument.doc1);
        });
    });
} else {
    test("dummy", () => {
        expect(true).toBeTruthy();
    });
}


