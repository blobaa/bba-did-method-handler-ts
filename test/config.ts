
const config = {
    test: {
        createDID: true,
        resolveDID: true,
        updateDIDController: true,
        updateDIDDocument: true,
        deactivateDID: true
    },
    node: {
        url: {
            testnet: "https://testardor.jelurida.com",
            mainnet: "https://ardor.jelurida.com"
        }
    },
    account: {
        alice: {
            address: "ARDOR-S27P-EHWT-8D2L-937R7",
            secret: "wash old rain spice ordinary frame mansion dance heavy below slight illness"
        },
        bob: {
            address: "ARDOR-YQ26-W5RK-6ATW-G9HRT",
            secret: "people sock unveil trash master enroll jar marine poem index frost next"
        },
        charlie: {
            address: "ARDOR-A5ZZ-S43Z-45W6-DCLYB",
            secret: "desperate party awkward choose more attempt belief fish just echo grey yet"
        },
        david: {
            address: "ARDOR-DN2R-M98S-KHN4-8ASUT",
            secret: "naked thread reason wonder open wife princess least crowd lick nightmare trouble"
        },
        erwin: {
            address: "ARDOR-3U2L-ZZJ2-MFT8-AVR3J",
            secret: "grew void simple flirt actually depress leg sick coward garden pride comfort"
        },
        frank: {
            address: "ARDOR-568B-CVYX-LQUN-GT6KG",
            secret: "somehow haunt memory forever pull mouth stage sink depress couch desperate waste"
        }
    },
    didDocument: {
        doc1: {
            resolved: {
                "@context": [
                    "https://www.w3.org/ns/did/v1",
                    "https://w3id.org/security/v1",
                    "https://my-new.awesome-context.com/my/context"
                ],
                id: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f",
                publicKey: [
                    {
                        id: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f#z6MkhX7oxAYm63t2hMg6U1FYQ2FVGyBf8YNG4zzstQyekcTc",
                        type: "Ed25519VerificationKey2018",
                        controller: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f",
                        publicKeyBase58: "44rmMvJKkWPZarqPnSHhYvhVTPuoif7uNz5x491dqPgE"
                    },
                    {
                        id: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f#z6MkvGDwhDSDTzKgd2ZZadirpVUaSxCMdVabeXgGRyCmmVGb",
                        type: "Ed25519VerificationKey2018",
                        controller: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f",
                        publicKeyBase58: "Goxu6yBn8SqDWXiru4m1yPvadNvWDcLExWmLbhEkrGVD"
                    }
                ],
                authentication: [
                    "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f#z6MkhX7oxAYm63t2hMg6U1FYQ2FVGyBf8YNG4zzstQyekcTc",
                    "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f#z6MkvGDwhDSDTzKgd2ZZadirpVUaSxCMdVabeXgGRyCmmVGb",
                    {
                        id: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f#z6Mkkc4SViBwcGSd6NqCKpUCBC6XTAL2G51EZAwFpf32iBL8",
                        type: "Ed25519VerificationKey2018",
                        controller: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f",
                        publicKeyBase58: "79oPuTwWGix9yszVeFWML6YXdb4ArBkssA2KzP51nxYk"
                    }
                ],
                assertionMethod: [
                    "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f#z6MkhX7oxAYm63t2hMg6U1FYQ2FVGyBf8YNG4zzstQyekcTc",
                    "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f#z6MkhX7oxAYm63t2hMg6U1FYQ2FVGyBf8YNG4zzstQyekcTc"
                ],
                capabilityInvocation: [
                    {
                        id: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f#z6MktheJs184FyRTwFrEcvqjiB9DocrHfSKHrTYqVefTrVvV",
                        type: "Ed25519VerificationKey2018",
                        controller: "did:baa:0335f47981b5524ec7e441392961e383ec2cf2381c12fb0119a6782a00387868",
                        publicKeyBase58: "FFPGGkscvRvzpm1XwMsts5bDz3aSFZ4wASdufNhSwH97"
                    }
                ],
                service: [
                    {
                        id: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f#vcs",
                        type: "VerifiableCredentialService",
                        serviceEndpoint: "https://example.com/vc/"
                    },
                    {
                        id: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f#mys",
                        type: "MyService",
                        serviceEndpoint: "https://my.domain.com/mys/",
                        prop: "an additional custom property"
                    }
                ]
            },
            cleaned: {
                "@context": [
                    "https://www.w3.org/ns/did/v1",
                    "https://w3id.org/security/v1",
                    "https://my-new.awesome-context.com/my/context"
                ],
                id: "",
                publicKey: [
                    {
                        id: "#z6MkhX7oxAYm63t2hMg6U1FYQ2FVGyBf8YNG4zzstQyekcTc",
                        type: "Ed25519VerificationKey2018",
                        controller: "",
                        publicKeyBase58: "44rmMvJKkWPZarqPnSHhYvhVTPuoif7uNz5x491dqPgE"
                    },
                    {
                        id: "#z6MkvGDwhDSDTzKgd2ZZadirpVUaSxCMdVabeXgGRyCmmVGb",
                        type: "Ed25519VerificationKey2018",
                        controller: "",
                        publicKeyBase58: "Goxu6yBn8SqDWXiru4m1yPvadNvWDcLExWmLbhEkrGVD"
                    }
                ],
                authentication: [
                    "#z6MkhX7oxAYm63t2hMg6U1FYQ2FVGyBf8YNG4zzstQyekcTc",
                    "#z6MkvGDwhDSDTzKgd2ZZadirpVUaSxCMdVabeXgGRyCmmVGb",
                    {
                        id: "#z6Mkkc4SViBwcGSd6NqCKpUCBC6XTAL2G51EZAwFpf32iBL8",
                        type: "Ed25519VerificationKey2018",
                        controller: "",
                        publicKeyBase58: "79oPuTwWGix9yszVeFWML6YXdb4ArBkssA2KzP51nxYk"
                    }
                ],
                assertionMethod: [
                    "#z6MkhX7oxAYm63t2hMg6U1FYQ2FVGyBf8YNG4zzstQyekcTc",
                    "#z6MkhX7oxAYm63t2hMg6U1FYQ2FVGyBf8YNG4zzstQyekcTc"
                ],
                capabilityInvocation: [
                    {
                        id: "#z6MktheJs184FyRTwFrEcvqjiB9DocrHfSKHrTYqVefTrVvV",
                        type: "Ed25519VerificationKey2018",
                        controller: "did:baa:0335f47981b5524ec7e441392961e383ec2cf2381c12fb0119a6782a00387868",
                        publicKeyBase58: "FFPGGkscvRvzpm1XwMsts5bDz3aSFZ4wASdufNhSwH97"
                    }
                ],
                service: [
                    {
                        id: "#vcs",
                        type: "VerifiableCredentialService",
                        serviceEndpoint: "https://example.com/vc/"
                    },
                    {
                        id: "#mys",
                        type: "MyService",
                        serviceEndpoint: "https://my.domain.com/mys/",
                        prop: "an additional custom property"
                    }
                ]
            },
        },
        doc2: {
            resolved: {
                "@context": [
                    "https://www.w3.org/ns/did/v1",
                    "https://w3id.org/security/v1",
                    "https://my-new.awesome-context.com/my/context"
                ],
                id: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f",
                authentication: [
                    {
                        id: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f#z6Mkq9xgFG4xrukSK83GpR6TgMnWKfxXkDu97G3xBv5rGnyR",
                        type: "Ed25519VerificationKey2018",
                        controller: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f",
                        publicKeyBase58: "Bhhdf1pXXNFyCdCa8r8cqGEWW6ggLLenRF92Me7qMaC3"
                    }
                ]
            },
            resolvedTestnet: {
                "@context": [
                    "https://www.w3.org/ns/did/v1",
                    "https://w3id.org/security/v1",
                    "https://my-new.awesome-context.com/my/context"
                ],
                id: "did:baa:t:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f",
                authentication: [
                    {
                        id: "did:baa:t:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f#z6Mkq9xgFG4xrukSK83GpR6TgMnWKfxXkDu97G3xBv5rGnyR",
                        type: "Ed25519VerificationKey2018",
                        controller: "did:baa:t:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f",
                        publicKeyBase58: "Bhhdf1pXXNFyCdCa8r8cqGEWW6ggLLenRF92Me7qMaC3"
                    }
                ]
            },
            cleaned: {
                "@context": [
                    "https://www.w3.org/ns/did/v1",
                    "https://w3id.org/security/v1",
                    "https://my-new.awesome-context.com/my/context"
                ],
                id: "",
                authentication: [
                    {
                        id: "#z6Mkq9xgFG4xrukSK83GpR6TgMnWKfxXkDu97G3xBv5rGnyR",
                        type: "Ed25519VerificationKey2018",
                        controller: "",
                        publicKeyBase58: "Bhhdf1pXXNFyCdCa8r8cqGEWW6ggLLenRF92Me7qMaC3"
                    }
                ]
            }
        },
    }
};


export default config;