import DIDMethodHandler from "./modules/resolver/DIDMethodHandler";

export * from "./types";

export const resolver = new DIDMethodHandler();
export class Resolver extends DIDMethodHandler {}