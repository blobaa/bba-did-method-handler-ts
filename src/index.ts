import MethodHandler from "./modules/baaMethodHandler/MethodHandler";

export * from "./types";

export const baaMethodHandler = new MethodHandler();
export class BaaMethodHandler extends MethodHandler {}