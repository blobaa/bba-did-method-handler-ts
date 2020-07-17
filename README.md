# Blobaa DID Method Specification v1.0

## Method-specific DID syntax

The following ABNF defines the blobaa-specific DID scheme:

```ABNF
blobaa-did = "did:baa:" blboaa-identifier
blobaa-identifier = [ ardor-network ":" ] [ ardor-chain-id ":" ] ardor-tx-hash
ardor-network = "m" / "t"
ardor-chain-id = "2"
ardor-tx-hash = 64HEXDIG
```


did:bba:m:2:f30e8cff75e5111da9943c123733d697120914bbef1b5010732ad409cbf29ee2
did:bba:t:

f30e8cff75e5111da9943c123733d697120914bbef1b5010732ad409cbf29ee2

https://tools.ietf.org/html/rfc5234

http://cryptocoinjs.com/modules/misc/bs58/



## Props

