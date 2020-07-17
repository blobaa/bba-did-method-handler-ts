

export default class MethodHandler {

    public async createDID(): Promise<string> {
        return new Promise((resolve, reject) => resolve("create"));
    }
}