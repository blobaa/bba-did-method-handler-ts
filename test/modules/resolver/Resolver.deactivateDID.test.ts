import { ChainId, GetTransactionParams, SetAccountPropertyParams } from "@blobaa/ardor-ts";
import { DeactivateDIDParams, Error, ErrorCode, Resolver } from "../../../src/index";
import config from "../../config";
import RequestMock, { GetTransactionCallback, SetAccountPropertyCallback } from "../../mocks/RequestMock";
import DefaultTransaction from "../lib/DefaultTransaction";


if (config.test.deactivateDID) {
    describe("Resolver deactivateDID method tests", () => {

        test("deactivateDID success", async () => {
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


            const setAccountPropertyCallback: SetAccountPropertyCallback = (params: SetAccountPropertyParams) => { // 2. update attestation
                expect(params.chain).toBe(ChainId.IGNIS);
                expect(params.secretPhrase).toBe(config.account.alice.secret);
                expect(params.recipient).toBe(config.account.alice.address);
                expect(params.property).toBe("did://dUZPPiukfaKyLuAaGUcZ");
                expect(params.value).toBe("001|i|0000-0000-0000-00000|c|1ec58d15c6fa43de48fee4702cec26c2ac96002c2a114b06e87fdef72e795340");

                return "5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f";
            };


            const testResolver = new Resolver(new RequestMock(setAccountPropertyCallback, undefined, getTransactionCallback));


            const didParams: DeactivateDIDParams = {
                did: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f",
                passphrase: config.account.alice.secret
            };

            const response = await testResolver.deactivateDID(config.node.url.testnet, didParams);

            expect(response.deactivatedDid).toBe("did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f");
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


            const testResolver = new Resolver(new RequestMock(undefined, undefined, getTransactionCallback));


            const didParams: DeactivateDIDParams = {
                did: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f",
                passphrase: config.account.alice.secret
            };

            try {
                await testResolver.deactivateDID(config.node.url.testnet, didParams);
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