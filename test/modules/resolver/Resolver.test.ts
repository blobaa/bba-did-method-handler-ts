import { resolver } from "../../../src/index";


describe("Resolver module tests", () => {

    test("createDID success", async () => {
        try {
            const result = await resolver.createDID();
            console.log(result);
            expect(result).toBe("create");
        } catch (e) {
            fail("should not reach here");
        }
    });

});