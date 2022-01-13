import MethodHandler from "./modules/bbaMethodHandler/MethodHandler";

export * from "./types";

export const bbaMethodHandler = new MethodHandler();
export class BBAMethodHandler extends MethodHandler {}