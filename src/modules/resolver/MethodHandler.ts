import { IRequest, Request } from "@blobaa/ardor-ts";
import { CreateDIDParams, CreateDIDResponse, IResolution, ResolveDIDParams, ResolveDIDResponse, RevokeDIDParams, RevokeDIDResponse, UpdateDIDPayloadParams, UpdateDIDPayloadResponse } from "../../types";
import DIDCreateController from "./controllers/DIDCreateController";
import DIDPayloadUpdateController from "./controllers/DIDPayloadUpdateController";
import CreationService from "./services/CreationService";
import UpdatePayloadService from "./services/UpdatePayloadService";


export default class MethodHandler implements IResolution {
    private readonly request: IRequest;


    constructor(request = new Request()) {
        this.request = request;
    }


    public async createDID(url: string, params: CreateDIDParams): Promise<CreateDIDResponse> {
        const controller = new DIDCreateController(new CreationService(this.request));
        return await controller.run(url, params);
    }


    public async updateDIDPayload(url: string, params: UpdateDIDPayloadParams): Promise<UpdateDIDPayloadResponse> {
        const controller = new DIDPayloadUpdateController(new UpdatePayloadService(this.request));
        return await controller.run(url, params);
    }


    // updateDIDController(url: string, params: UpdateDIDParams): Promise<UpdateDIDResponse> {
    //     throw new Error("Method not implemented.");
    // }


    revokeDID(url: string, params: RevokeDIDParams): Promise<RevokeDIDResponse> {
        throw new Error("Method not implemented.");
    }

    resolveDID(url: string, params: ResolveDIDParams): Promise<ResolveDIDResponse> {
        throw new Error("Method not implemented.");
    }
}