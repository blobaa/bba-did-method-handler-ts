import { Error, ErrorCode, ResolveDIDParams, Resolver, resolver } from "../../../src/index";
import config from "../../config";
import RequestMock from "../../mocks/RequestMock";


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
    });
} else {
    test("dummy", () => {
        expect(true).toBeTruthy();
    });
}