import { ChainId, SetAccountPropertyParams, UploadTaggedDataParams } from "@blobaa/ardor-ts";
import { CreateDIDParams, Error, ResolveDIDParams, Resolver, resolver, ErrorCode } from "../../../src/index";
import config from "../../config";
import RequestMock, { SetAccountPropertyCallback, UploadTaggedDataCallback } from "../../mocks/RequestMock";


describe("Resolver module tests", () => {

    if (config.test.createDID) {
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


        test("createDID testnet success", async () => {
            const uploadTaggedDataCallback: UploadTaggedDataCallback = (params: UploadTaggedDataParams) => {
                return config.dummyHash.dataCloud;
            };

            const setAccountPropertyCallback: SetAccountPropertyCallback = (params: SetAccountPropertyParams) => {
                return config.dummyHash.property;
            };

            const testResolver = new Resolver(new RequestMock(setAccountPropertyCallback, uploadTaggedDataCallback ));


            const didParams: CreateDIDParams = {
                payload: config.dummyPayload,
                passphrase: config.account.alice.secret
            };

            const response = await testResolver.createDID(config.node.url.testnet, didParams);
            const didElements = response.did.split(":");
            const didPrefix = didElements[0];
            const didMethod = didElements[1];
            const didTxHash = didElements[2];

            expect(didPrefix).toBe("did");
            expect(didMethod).toBe("baa");
            expect(didTxHash).toBe(config.dummyHash.property);
        });
    }


    if (config.test.resolveDID) {
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


        test("resolveDID error", async () => {
            const didParams: ResolveDIDParams = {
                did: config.did.normal
            };

            const testResolver = new Resolver(new RequestMock());

            didParams.did = config.did.rotated;
            try {
                await testResolver.resolveDID(config.node.url.testnet, didParams);
                fail("should not reach here");
            } catch (e) {
                const error = e as Error;
                expect(error.code).toBe(ErrorCode.DID_RESOLUTION_ERROR);
                expect(error.description).toBeDefined();
            }
        });
    }

});