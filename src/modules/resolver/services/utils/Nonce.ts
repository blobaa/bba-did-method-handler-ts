
export default class Nonce {
    private static readonly NONCE_CHARACTER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";


    public static generate(length: number): string {
        let nonce = "";

        for (let i = 0; i < length; i++) {
            nonce += this.NONCE_CHARACTER_SET.charAt(Math.floor(Math.random() * this.NONCE_CHARACTER_SET.length));
        }
        return nonce;
    }
}