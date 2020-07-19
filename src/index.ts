import MethodHandler from "./modules/resolver/MethodHandler";

export * from "./types";

export const resolver = new MethodHandler();
export class Resolver extends MethodHandler {}