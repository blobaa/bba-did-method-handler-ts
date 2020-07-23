import { IRequest, Request } from "@blobaa/ardor-ts";
import { CreateDIDParams, CreateDIDResponse, IResolution, ResolveDIDParams, ResolveDIDResponse, RevokeDIDParams, RevokeDIDResponse, UpdateDIDControllerParams, UpdateDIDControllerResponse, UpdateDIDDocumentParams, UpdateDIDDocumentResponse } from "../../types";
import RequestWrapper from "../lib/RequestWrapper";
import DIDControllerUpdateController from "./controllers/DIDControllerUpdateController";
import DIDCreateController from "./controllers/DIDCreateController";
import DIDPayloadUpdateController from "./controllers/DIDPayloadUpdateController";
import DIDResolveController from "./controllers/DIDResolveController";
import DIDRevokeController from "./controllers/DIDRevokeController";
import CreationService from "./services/CreationService";
import ResolutionService from "./services/ResolutionService";
import RevocationService from "./services/RevocationService";
import ControllerUpdateService from "./services/ControllerUpdateService";
import PayloadUpdateService from "./services/PayloadUpdateService";


export default class MethodHandler implements IResolution {
    private readonly request: IRequest;


    constructor(request = new Request()) {
        this.request = new RequestWrapper(request);
    }


    public async createDID(url: string, params: CreateDIDParams): Promise<CreateDIDResponse> {
        const controller = new DIDCreateController(new CreationService(this.request));
        return await controller.run(url, params);
    }


    public async resolveDID(url: string, params: ResolveDIDParams): Promise<ResolveDIDResponse> {
        const controller = new DIDResolveController(new ResolutionService(this.request));
        return await controller.run(url, params);
    }


    public async updateDIDDocument(url: string, params: UpdateDIDDocumentParams): Promise<UpdateDIDDocumentResponse> {
        const controller = new DIDPayloadUpdateController(new PayloadUpdateService(this.request));
        return await controller.run(url, params);
    }


    public async updateDIDController(url: string, params: UpdateDIDControllerParams): Promise<UpdateDIDControllerResponse> {
        const controller = new DIDControllerUpdateController(new ControllerUpdateService(this.request));
        return await controller.run(url, params);
    }


    public async revokeDID(url: string, params: RevokeDIDParams): Promise<RevokeDIDResponse> {
        const controller = new DIDRevokeController(new RevocationService(this.request));
        return await controller.run(url, params);
    }
}