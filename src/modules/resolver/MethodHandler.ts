import { IRequest, Request } from "@blobaa/ardor-ts";
import { IResolution, CreateDIDParams, UpdateDIDParams, RevokeDIDParams, ResolveDIDParams, CreateDIDResponse, UpdateDIDResponse, RevokeDIDResponse, ResolveDIDResponse } from "../../types";
import DIDCreateMethodController from "./controllers/DIDCreateMethodController";
import CreationService from "./services/CreationService";


export default class MethodHandler implements IResolution {
    private readonly request: IRequest;


    constructor(request = new Request()) {
        this.request = request;
    }


    public async createDID(url: string, params: CreateDIDParams): Promise<CreateDIDResponse> {
        const controller = new DIDCreateMethodController(new CreationService(this.request));
        return await controller.run(url, params);
    }


    updateDID(url: string, params: UpdateDIDParams): Promise<UpdateDIDResponse> {
        throw new Error("Method not implemented.");
    }
    revokeDID(url: string, params: RevokeDIDParams): Promise<RevokeDIDResponse> {
        throw new Error("Method not implemented.");
    }
    resolveDID(url: string, params: ResolveDIDParams): Promise<ResolveDIDResponse> {
        throw new Error("Method not implemented.");
    }
}