
const config = {
    test: {
        createDID: true,
        resolveDID: true,
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
        erin: {
            address: "ARDOR-3U2L-ZZJ2-MFT8-AVR3J",
            secret: "grew void simple flirt actually depress leg sick coward garden pride comfort"
        },
        frank: {
            address: "ARDOR-568B-CVYX-LQUN-GT6KG",
            secret: "somehow haunt memory forever pull mouth stage sink depress couch desperate waste"
        }
    },
    dummyHash: {
        dataCloud: "1ec58d15c6fa43de48fee4702cec26c2ac96002c2a114b06e87fdef72e795340",
        property: "d870c95990be4cdb3d10703507932c17bf40bc67c71018d100123e2c49963e72"
    },
    dummyDidDocument: {
        doc1: {
            var11: "dummy-variable-11",
            var12: "dummy-variable-12"
        },
        doc2: {
            var21: "dummy-variable-21",
            var22: "dummy-variable-22"
        },
    },
    did: {
        dummy: "did:baa:5ca5fb0b6c59f126f674eb504b7302c69ede9cf431d01dba07809314302e565f",
        normal: "did:baa:t:0335f47981b5524ec7e441392961e383ec2cf2381c12fb0119a6782a00387868",
        rotated: "did:baa:t:6f49df11f1f7908b36593e014d3df14062a1d08fd43d3516aa8802aa8782ee8d"
    }
};


export default config;