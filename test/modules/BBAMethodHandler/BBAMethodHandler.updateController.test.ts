import { ChainId, GetTransactionParams, SetAccountPropertyParams } from "@blobaa/ardor-ts";
import { ACCOUNT_PREFIX } from "../../../src/constants";
import { BBAMethodHandler, Error, ErrorCode, UpdateDIDControllerParams } from "../../../src/index";
import config from "../../config";
import RequestMock, { GetTransactionCallback, SetAccountPropertyCallback } from "../../mocks/RequestMock";
import DefaultTransaction from "../lib/DefaultTransaction";


if (config.test.updateDIDController) {
    describe("BBAMethodHandler updateDIDController method tests", () => {

        test("updateDIDController success", async () => {
            let getTransactionCounter = 0;
            const getTransactionCallback: GetTransactionCallback = (params: GetTransactionParams) => {
                const transaction = DefaultTransaction.create();

                if (getTransactionCounter === 0) { // 1. get account property
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

                getTransactionCounter++;
                return transaction;
            };


            let setAccountPropertyCounter = 0;
            const setAccountPropertyCallback: SetAccountPropertyCallback = (params: SetAccountPropertyParams) => {
                let fullHash = "";

                if (setAccountPropertyCounter === 0) { // 2. update old account attestation
                    expect(params.chain).toBe(ChainId.IGNIS);
                    expect(params.secretPhrase).toBe(config.account.alice.secret);
                    expect(params.recipient).toBe(config.account.alice.address);
                    expect(params.property).toBe("did://dUZPPiukfaKyLuAaGUcZ");
                    const attestationString = "001|d|" + config.account.bob.address.substr(ACCOUNT_PREFIX.length) + "|c|1ec58d15c6fa43de48fee4702cec26c2ac96002c2a114b06e87fdef72e795340";
                    expect(params.value).toBe(attestationString);

                    fullHash = "08129ea7736580d5cbc383637356d7bfebf8b4558f740bba8d925c88f98afbae";
                }

                if (setAccountPropertyCounter === 1) { // 3. set new account attestation
                    expect(params.chain).toBe(ChainId.IGNIS);
                    expect(params.secretPhrase).toBe(config.account.bob.secret);
                    expect(params.recipient).toBe(config.account.bob.address);
                    expect(params.property).toBe("did://dUZPPiukfaKyLuAaGUcZ");
                    expect(params.value).toBe("001|a|0000-0000-0000-00000|c|1ec58d15c6fa43de48fee4702cec26c2ac96002c2a114b06e87fdef72e795340");

                    fullHash = "f30e8cff75e5111da9943c123733d697120914bbef1b5010732ad409cbf29ee2";
                }

                setAccountPropertyCounter++;
                return fullHash;
            };


            const testHandler = new BBAMethodHandler(new RequestMock(setAccountPropertyCallback, undefined, getTransactionCallback));


            const didParams: UpdateDIDControllerParams = {
                did: "did:bba:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f",
                passphrase: config.account.alice.secret,
                newPassphrase: config.account.bob.secret
            };

            const response = await testHandler.updateDIDController(config.node.url.testnet, didParams);
            expect(response.newControllerAccount).toBe(config.account.bob.address);
            expect(response.oldControllerAccount).toBe(config.account.alice.address);
            expect(response.did).toBe("did:bba:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f");
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


            const testHandler = new BBAMethodHandler(new RequestMock(undefined, undefined, getTransactionCallback));


            const didParams: UpdateDIDControllerParams = {
                did: "did:bba:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f",
                passphrase: config.account.alice.secret,
                newPassphrase: config.account.bob.secret
            };

            try {
                await testHandler.updateDIDController(config.node.url.testnet, didParams);
                fail("should not reach here");
            } catch (e) {
                const error = e as Error;
                expect(error.code).toBe(ErrorCode.WRONG_CONTROLLER_ACCOUNT);
                expect(error.description).toBeTruthy();
            }
        });
    });
} else {
    test("dummy", () => {
        expect(true).toBeTruthy();
    });
}