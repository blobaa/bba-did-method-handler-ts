import MethodHandler from "./modules/baaDIDMethod/MethodHandler";

export * from "./types";

export const baaDIDMethod = new MethodHandler();
export class BaaDIDMethod extends MethodHandler {}