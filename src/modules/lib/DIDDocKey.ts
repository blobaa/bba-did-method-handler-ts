import * as cryptoLd from "crypto-ld";
import { secureAny } from "../../types";


export enum KeyType {
    Ed25519,
    RSA
}


export type DIDDocKeyMaterial = {
    privateKeyBase58?: string;
    publicKeyBase58?: string;
    privateKeyPem?: string;
    publicKeyPem?: string;
    controller: string;
    type: string;
    id: string;
}


export type DIDDocPublicKey = {
    publicKeyBase58?: string;
    publicKeyPem?: string;
    controller: string;
    type: string;
    id: string;
}


enum KeyTypeString {
    Ed25519 = "Ed25519VerificationKey2018",
    RSA = "RsaVerificationKey2018"
}


export default class DIDDocKey {
    private keyPair: secureAny = {};
    private _keyType: KeyType = KeyType.Ed25519;
    private _id = "";
    private _controller = "";


    constructor(did: string, keyType = KeyType.Ed25519, controller?: string) {
        this._keyType = keyType;
        this._id = did;
        this._controller = controller || did;
    }


    /*eslint-disable @typescript-eslint/explicit-function-return-type*/
    get type() {
        if (this._keyType === KeyType.Ed25519) {
            return KeyTypeString.Ed25519;
        }
        if (this._keyType === KeyType.RSA) {
            return KeyTypeString.RSA;
        }
    }
    /*eslint-enable @typescript-eslint/explicit-function-return-type*/

    /*eslint-disable @typescript-eslint/explicit-function-return-type*/
    get publicKey() {
        if (this._keyType === KeyType.Ed25519) {
            return this.keyPair.publicKeyBase58;
        }
        if (this._keyType === KeyType.RSA) {
            return this.keyPair.publicKeyPem;
        }
    }
    /*eslint-enable @typescript-eslint/explicit-function-return-type*/

    /*eslint-disable @typescript-eslint/explicit-function-return-type*/
    get privateKey() {
        if (this._keyType === KeyType.Ed25519) {
            return this.keyPair.privateKeyBase58;
        }
        if (this._keyType === KeyType.RSA) {
            return this.keyPair.privateKeyPem;
        }
    }
    /*eslint-enable @typescript-eslint/explicit-function-return-type*/

    /*eslint-disable @typescript-eslint/explicit-function-return-type*/
    get id() {
        return this._id;
    }
    /*eslint-enable @typescript-eslint/explicit-function-return-type*/

    /*eslint-disable @typescript-eslint/explicit-function-return-type*/
    get keyType() {
        return this._keyType;
    }
    /*eslint-enable @typescript-eslint/explicit-function-return-type*/

    /*eslint-disable @typescript-eslint/explicit-function-return-type*/
    get controller() {
        return this._controller;
    }
    /*eslint-enable @typescript-eslint/explicit-function-return-type*/


    public async generate(): Promise<void> {
        if (this._keyType === KeyType.Ed25519) {
            this.keyPair = await cryptoLd.Ed25519KeyPair.generate();
        }

        if (this._keyType === KeyType.RSA) {
            this.keyPair = await cryptoLd.RSAKeyPair.generate();
        }

        this.keyPair.id = this._id + "#" + this.keyPair.fingerprint();
        this.keyPair.controller = this.controller;
    }


    public publish(): DIDDocPublicKey {
        return this.keyPair.publicNode();
    }


    public async exportKeyMaterial(): Promise<DIDDocKeyMaterial> {
        return await this.keyPair.export();
    }


    public importKeyPair(privateKey: string, publicKey: string): void {
        if (this.keyType === KeyType.Ed25519) {
            this.keyPair = new cryptoLd.Ed25519KeyPair({ publicKeyBase58: publicKey, privateKeyBase58: privateKey });
        }

        if (this.keyType === KeyType.RSA) {
            this.keyPair = new cryptoLd.RSAKeyPair({ privateKeyPem: privateKey, publicKeyPem: publicKey });
        }

        this.keyPair.id = this._id + "#" + this.keyPair.fingerprint();
        this.keyPair.controller = this.controller;
    }
}