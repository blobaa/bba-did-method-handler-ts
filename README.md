# bba-did-method-handler-ts

A handler for the `bba` DID [method](https://github.com/blobaa/bba-did-method-specification) written in TypeScript.


## Table of Contents

<details><summary><i>click to expand</i></summary>
<p><br/>

- [bba-did-method-handler-ts](#bba-did-method-handler-ts)
  - [Table of Contents](#table-of-contents)
  - [Background](#background)
  - [Install](#install)
  - [Usage](#usage)
    - [Create and Register DID and DID Document](#create-and-register-did-and-did-document)
    - [Resolve DID](#resolve-did)
    - [Update DID Document](#update-did-document)
    - [Update DID Controller Account](#update-did-controller-account)
    - [Deactivate DID](#deactivate-did)
    - [Error Handling](#error-handling)
    - [Module Instantiation](#module-instantiation)
  - [API](#api)
    - [createDID](#createdid)
    - [resolveDID](#resolvedid)
    - [updateDIDDocument](#updatediddocument)
    - [updateDIDController](#updatedidcontroller)
    - [deactivateDID](#deactivatedid)
  - [Contributing](#contributing)
  - [License](#license)

</p>
</details>


## Background

This library implements a handler for the `bba` DID [method](https://github.com/blobaa/bba-did-method-specification) to enable the [Ardor](https://ardorplatform.org) Blockchain to act as a [DPKI](https://www.weboftrust.info/downloads/dpki.pdf) (Public Utility) within the [Trust over IP](https://trustoverip.org/wp-content/uploads/sites/98/2020/05/toip_introduction_050520.pdf) Stack for Self-Sovereign Identity ([SSI](https://www.manning.com/books/self-sovereign-identity)).


## Install

```
npm install @blobaa/bba-did-method-handler-ts
```


## Usage

### Create and Register DID and DID Document

````typescript
import { DIDDocKey, DIDDocRelationship, DIDDocRelationshipType, DIDDocument } from "@blobaa/did-document-ts";
import { CreateDIDParams, bbaMethodHandler } from "@blobaa/bba-did-method-handler-ts";


const createDID = async(): Promise<void> => {

    /* Even though not necessary, it is recommended to create a DID Document Template with
      the @blobaa/did-document-ts package.
    */

    /* create or import DID Document public keys  */
    const key = new DIDDocKey();
    await key.generate();
    const publicKey = key.publish();

    /* create verification relationships */
    const authentication = new DIDDocRelationship({
        relationshipType: DIDDocRelationshipType.AUTHENTICATION,
        publicKeys: [ publicKey ]
    });

    /* create document template */
    const document = new DIDDocument({
        relationships: [ authentication ]
    });

    const didDocTsTemplate = document.publish();


    /* You can also use an otherwise created template */
    const didDocTemplate = {
        "@context": [ "https://www.w3.org/ns/did/v1", "https://w3id.org/security/v1" ],
        id: "", // already existing DIDs will be overwritten in the resolution process
        authentication: [
            {
                id: "#z6Mkq9uAju2ezpgoT8q88pqMDLcZ4wJQXZiNKpT4SyJ8xCDQ",
                type: "Ed25519VerificationKey2018",
                publicKeyBase58: "Bhe89enDfHCLLdzRTFsWNF4ZFN2Z7gU1doY8chL82yS2"
            }
        ]
    };


    /* set parameters */
    const params: CreateDIDParams = {
        didDocumentTemplate: didDocTemplate,
        passphrase: "<controller account passphrase>",
        isTestnetDid: true
    };

    try {

        /* create and register DID and DID Document */
        const response = await bbaMethodHandler.createDID("https://testardor.jelurida.com", params);

        console.log("DID:", response.did); // did:bba:t:0239684aef4c0d597b4ca5588f69327bed1fedfd576de35e5099c32807bb520e
        console.log("DID Document:", JSON.stringify(response.didDocument, undefined, 4));
        /*
        {
            "@context": [
                "https://www.w3.org/ns/did/v1",
                "https://w3id.org/security/v1"
            ],
            "id": "did:bba:t:0239684aef4c0d597b4ca5588f69327bed1fedfd576de35e5099c32807bb520e",
            "authentication": [
                {
                    "id": "did:bba:t:0239684aef4c0d597b4ca5588f69327bed1fedfd576de35e5099c32807bb520e#z6Mkq9uAju2ezpgoT8q88pqMDLcZ4wJQXZiNKpT4SyJ8xCDQ",
                    "type": "Ed25519VerificationKey2018",
                    "publicKeyBase58": "Bhe89enDfHCLLdzRTFsWNF4ZFN2Z7gU1doY8chL82yS2"
                }
            ]
        }
        */

    } catch (e) { /* see error handling */ }
};

createDID();
````


### Resolve DID

````typescript
import { ResolveDIDParams, bbaMethodHandler } from "@blobaa/bba-did-method-handler-ts";


const resolveDID = async(): Promise<void> => {

    /* set parameters */
    const params: ResolveDIDParams = {
        did:"did:bba:t:0239684aef4c0d597b4ca5588f69327bed1fedfd576de35e5099c32807bb520e"
    };

    try {

        /* resolve DID */
        const response = await bbaMethodHandler.resolveDID("https://testardor.jelurida.com", params);

        console.log("DID:", response.did); // did:bba:t:0239684aef4c0d597b4ca5588f69327bed1fedfd576de35e5099c32807bb520e
        console.log("DID Document", JSON.stringify(response.didDocument, undefined, 4));
        /*
        {
            "@context": [
                "https://www.w3.org/ns/did/v1",
                "https://w3id.org/security/v1"
            ],
            "id": "did:bba:t:0239684aef4c0d597b4ca5588f69327bed1fedfd576de35e5099c32807bb520e",
            "authentication": [
                {
                    "id": "did:bba:t:0239684aef4c0d597b4ca5588f69327bed1fedfd576de35e5099c32807bb520e#z6Mkq9uAju2ezpgoT8q88pqMDLcZ4wJQXZiNKpT4SyJ8xCDQ",
                    "type": "Ed25519VerificationKey2018",
                    "publicKeyBase58": "Bhe89enDfHCLLdzRTFsWNF4ZFN2Z7gU1doY8chL82yS2"
                }
            ]
        }
        */

    } catch (e) { /* see error handling */ }
};

resolveDID();
````


### Update DID Document

````typescript
import { DIDDocKey, DIDDocRelationship, DIDDocRelationshipType, DIDDocument } from "@blobaa/did-document-ts";
import { bbaMethodHandler, UpdateDIDDocumentParams } from "@blobaa/bba-did-method-handler-ts";


const updateDIDDocument = async(): Promise<void> => {

    /* create new DID Document template */
    const key = new DIDDocKey();
    await key.generate();
    const publicKey = key.publish();

    const authentication = new DIDDocRelationship({
        relationshipType: DIDDocRelationshipType.AUTHENTICATION,
        publicKeysAsRef: [ publicKey ]
    });

    const assertion = new DIDDocRelationship({
        relationshipType: DIDDocRelationshipType.ASSERTION_METHOD,
        publicKeysAsRef: [ publicKey ]
    });

    const document = new DIDDocument({
        relationships: [ authentication, assertion ],
        publicKeys: [ publicKey ]
    });

    const didDocTsTemplate = document.publish();


    /* set parameters */
    const params: UpdateDIDDocumentParams = {
        did:"did:bba:t:0239684aef4c0d597b4ca5588f69327bed1fedfd576de35e5099c32807bb520e",
        newDidDocumentTemplate: didDocTsTemplate,
        passphrase: "<controller account passphrase>"
    };

    try {

        /* update DID Document */
        const response = await bbaMethodHandler.updateDIDDocument("https://testardor.jelurida.com", params);

        console.log("DID:", response.did); // did:bba:t:0239684aef4c0d597b4ca5588f69327bed1fedfd576de35e5099c32807bb520e
        console.log("new DID Document", JSON.stringify(response.newDidDocument, undefined, 4));
        /*
        {
            "@context": [
                "https://www.w3.org/ns/did/v1",
                "https://w3id.org/security/v1"
            ],
            "id": "did:bba:t:0239684aef4c0d597b4ca5588f69327bed1fedfd576de35e5099c32807bb520e",
            "publicKey": [
                {
                    "id": "did:bba:t:0239684aef4c0d597b4ca5588f69327bed1fedfd576de35e5099c32807bb520e#z6MkpM57tyJhB47CwL5mPE8T7C87Sj35dQ1mWZvRyw4TKt3B",
                    "type": "Ed25519VerificationKey2018",
                    "publicKeyBase58": "Atp5Jj4FqWcjpqF4hfAcG6a7d9mEDWmQpZ1W9f6SQfFo"
                }
            ],
            "authentication": [
                "did:bba:t:0239684aef4c0d597b4ca5588f69327bed1fedfd576de35e5099c32807bb520e#z6MkpM57tyJhB47CwL5mPE8T7C87Sj35dQ1mWZvRyw4TKt3B"
            ],
            "assertionMethod": [
                "did:bba:t:0239684aef4c0d597b4ca5588f69327bed1fedfd576de35e5099c32807bb520e#z6MkpM57tyJhB47CwL5mPE8T7C87Sj35dQ1mWZvRyw4TKt3B"
            ]
        }
        */

    } catch (e) { /* see error handling */ }
};

updateDIDDocument();
````

### Update DID Controller Account

````typescript
import { bbaMethodHandler, UpdateDIDControllerParams } from "@blobaa/bba-did-method-handler-ts";


const updateDIDController = async(): Promise<void> => {

    /* set parameters */
    const params: UpdateDIDControllerParams = {
        did:"did:bba:t:0239684aef4c0d597b4ca5588f69327bed1fedfd576de35e5099c32807bb520e",
        passphrase: "<old controller account passphrase>",
        newPassphrase: "<new controller account passphrase>"
    };

    try {

        /* update DID Controller Account */
        const response = await bbaMethodHandler.updateDIDController("https://testardor.jelurida.com", params);

        console.log("DID:", response.did); // did:bba:t:0239684aef4c0d597b4ca5588f69327bed1fedfd576de35e5099c32807bb520e
        console.log("old Account:", response.oldControllerAccount); // "ARDOR-S27P-EHWT-8D2L-937R7"
        console.log("new Account:", response.newControllerAccount); // "ARDOR-YQ26-W5RK-6ATW-G9HRT"

    } catch (e) { /* see error handling */ }
};

updateDIDController();
````


### Deactivate DID

````typescript
import { DeactivateDIDParams, bbaMethodHandler } from "@blobaa/bba-did-method-handler-ts";


const deactivateDID = async(): Promise<void> => {

    /* set parameters */
    const params: DeactivateDIDParams = {
        did:"did:bba:t:0239684aef4c0d597b4ca5588f69327bed1fedfd576de35e5099c32807bb520e",
        passphrase: "<controller account passphrase>",
    };

    try {

        /* deactivate DID */
        const response = await bbaMethodHandler.deactivateDID("https://testardor.jelurida.com", params);

        console.log("deactivated DID:", response.deactivatedDid); // did:bba:t:0239684aef4c0d597b4ca5588f69327bed1fedfd576de35e5099c32807bb520e

    } catch (e) { /* see error handling */ }
};

deactivateDID();
````


### Error Handling

There is an unified error handling for all APIs. Every API throws an error in case of any failures or unmet conditions. Every error implements the 'Error' interface of this library. The interface consist of two data fields. The code field contains a value of the 'ErrorCode' enum to indicate the error reason. The description field contains a human readable description of the error reason.

````typescript
import { bbaMethodHandler, Error, ErrorCode, ResolveDIDParams } from "@blobaa/bba-did-method-handler-ts";


const errorHandlingExample = async(): Promise<void> => {

    const params: ResolveDIDParams = {
        did:"did:bba:t:0239684aef4c0d597b4ca5588f69327bed1fedfd576de35e5099c32807bb520e"
    };

    try {

        /* resolve DID */
        await bbaMethodHandler.resolveDID("https://testardor.jelurida.com", params);

    } catch (e) {

        /* all errors implement the library's Error interface */
        const error = e as Error;

        /* every error has an error code that corresponds to the ErrorCode enum */
        if (error.code === ErrorCode.DID_DEACTIVATED) {
            //  handle did deactivated error here
        }

        console.log(error.code);
        console.log(error.description);
    }
};

errorHandlingExample();
````


### Module Instantiation

The handler module is pre-instantiated and importable via the lower case module name. If you need the class definition, import it via the upper case name.

````typescript
import { bbaMethodHandler, BBAMethodHandler, ResolveDIDParams } from "@blobaa/bba-did-method-handler-ts";


const moduleInstantiationExample = async (): Promise<void> => {

    const params: ResolveDIDParams = {
        did:"did:bba:t:45e6df15dc0a7d91dcccd24fda3b52c3983a214fb0eed0938321c11ec99403cf"
    };

    try {

        /* use the default instance */
        const response = await bbaMethodHandler.resolveDID("https://testardor.jelurida.com", params);
        console.log(response);

        /* use your own instance */
        const myBBAMethodHandler = new BBAMethodHandler();
        const response = await myBBAMethodHandler.resolveDID("https://testardor.jelurida.com", params);
        console.log(response);

    } catch (e) { /* error handling */}
};

moduleInstantiationExample();
````


## API

The library provides a bba method handler module for handling the CRUD operations. You can import the class definition with the upper case notation `BBAMethodHandler` or use the pre-instantiated `bbaMethodHandler` object. It provides the following five asynchronous functions:


### createDID

The `createDID` function lets you create a bba DID. It provides the following interface:


````typescript
type CreateDIDParams = {
    didDocumentTemplate: objectAny; // DDOT used for the DID Document
    passphrase: string; // DID controller passphrase
    isTestnetDid?: boolean; // network type selector
    fee?: number; // fees in IGNIS
    feeNQT?: number; // fees in IGNIS NQT
    // automatic fee calculation is used if no fee is specified
}

type CreateDIDResponse = {
    did: string; // created DID
    didDocument: objectAny; // DID Document linked to the DID
}

async createDID(url: string, params: CreateDIDParams): Promise<CreateDIDResponse>
````


### resolveDID

The `resolveDID` function lets you resolve a bba DID. It provides the following interface:


````typescript
type ResolveDIDParams = {
    did: string; // DID to be resolved
}

type ResolveDIDResponse = {
    did: string; // resolved DID
    didDocument: objectAny; // resolved DID Document
}

async resolveDID(url: string, params: ResolveDIDParams): Promise<ResolveDIDResponse>
````


### updateDIDDocument

The `updateDIDDocument` function lets you update a DID Document. It provides the following interface:


````typescript
type UpdateDIDDocumentParams = {
    newDidDocumentTemplate: objectAny; // new DDOT
    passphrase: string; // DID controller passphrase
    did: string; // DID to be updated
    fee?: number; // fees in IGNIS
    feeNQT?: number; // fees in IGNIS NQT
    // automatic fee calculation is used if no fee is specified
}

type UpdateDIDDocumentResponse = {
    did: string; // updated DID
    newDidDocument: objectAny; // updated DID Document
}

async updateDIDDocument(url: string, params: UpdateDIDDocumentParams): Promise<UpdateDIDDocumentResponse>
````


### updateDIDController

The `updateDIDController` function lets you update a DID controller. It provides the following interface:


````typescript
type UpdateDIDControllerParams = {
    passphrase: string; // current DID controller passphrase
    newPassphrase: string; // new DID controller passphrase
    did: string; // DID to be updated
    fee?: number; // fees in IGNIS
    feeNQT?: number; // fees in IGNIS NQT
    // automatic fee calculation is used if no fee is specified
}

type UpdateDIDControllerResponse = {
    did: string; // DID to be updated
    newControllerAccount: string; // new DID controller account
    oldControllerAccount: string; // old DID controller account
}

async updateDIDController(url: string, params: UpdateDIDControllerParams): Promise<UpdateDIDControllerResponse>
````


### deactivateDID

The `deactivateDID` function lets you deactivate a DID. It provides the following interface:


````typescript
type DeactivateDIDParams = {
    did: string; // DID to be deactivated
    passphrase: string; // DID controller passphrase
    fee?: number; // fees in IGNIS
    feeNQT?: number; // fees in IGNIS NQT
    // automatic fee calculation is used if no fee is specified
}

type DeactivateDIDResponse = {
    deactivatedDid: string; // deactivated DID
};

async deactivateDID(url: string, params: DeactivateDIDParams): Promise<DeactivateDIDResponse>
````


## Contributing

PRs accepted.

If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.


## License

[MIT](./LICENSE) © Attila Aldemir

