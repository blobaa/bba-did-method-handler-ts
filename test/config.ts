
const config = {
    test: {
        createDID: true,
        resolveDID: true,
        updateDIDController: true,
        updateDIDDocument: true
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
            var11: "dummy-variable-11",
            var12: "dummy-variable-12"
        },
        doc2: {
            var21: "dummy-variable-21",
            var22: "dummy-variable-22"
        },
    }
};


export default config;