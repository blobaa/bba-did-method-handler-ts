import { ChainId, SetAccountPropertyParams, UploadTaggedDataParams } from "@blobaa/ardor-ts";
import { Resolver } from "../../../src/index";
import { CreateDIDParams } from "../../../src/types";
import config from "../../config";
import RequestMock, { SetAccountPropertyCallback, UploadTaggedDataCallback } from "../../mocks/RequestMock";



describe("Resolver module tests", () => {

    test("createDID testnet success", async () => {
        const uploadTaggedDataCallback: UploadTaggedDataCallback = (params: UploadTaggedDataParams) => {
            expect(params.chain).toBe(ChainId.IGNIS);
            expect(params.data).toBe(JSON.stringify(config.dummyPayload));
            expect(params.name).toBe("blobaa-did-document-payload");
            expect(params.secretPhrase).toBe(config.account.alice.secret);
            return config.dummyHash.dataCloud;
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

            return config.dummyHash.property;
        };

        const testResolver = new Resolver(new RequestMock(setAccountPropertyCallback, uploadTaggedDataCallback ));


        const didParams: CreateDIDParams = {
            payload: config.dummyPayload,
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
        expect(didTxHash).toBe(config.dummyHash.property);
    });

});