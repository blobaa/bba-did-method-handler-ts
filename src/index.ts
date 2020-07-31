import MethodHandler from "./modules/baaMethod/MethodHandler";

export * from "./types";

export const baaMethod = new MethodHandler();
export class BaaMethod extends MethodHandler {}