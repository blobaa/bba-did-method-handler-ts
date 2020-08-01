import { IRequest, Request } from "@blobaa/ardor-ts";
import { CreateDIDParams, CreateDIDResponse, IBBAMethodHandler, ResolveDIDParams, ResolveDIDResponse, DeactivateDIDParams, DeactivateDIDResponse, UpdateDIDControllerParams, UpdateDIDControllerResponse, UpdateDIDDocumentParams, UpdateDIDDocumentResponse } from "../../types";
import RequestWrapper from "../lib/RequestWrapper";
import DIDControllerUpdateController from "./controllers/DIDControllerUpdateController";
import DIDCreateController from "./controllers/DIDCreateController";
import DIDDocumentUpdateController from "./controllers/DIDDocumentUpdateController";
import DIDResolveController from "./controllers/DIDResolveController";
import DIDRevokeController from "./controllers/DIDRevokeController";
import CreationService from "./services/CreationService";
import ResolutionService from "./services/ResolutionService";
import RevocationService from "./services/RevocationService";
import ControllerUpdateService from "./services/ControllerUpdateService";
import DocumentUpdateService from "./services/DocumentUpdateService";


export default class MethodHandler implements IBBAMethodHandler {
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
        const controller = new DIDDocumentUpdateController(new DocumentUpdateService(this.request));
        return await controller.run(url, params);
    }


    public async updateDIDController(url: string, params: UpdateDIDControllerParams): Promise<UpdateDIDControllerResponse> {
        const controller = new DIDControllerUpdateController(new ControllerUpdateService(this.request));
        return await controller.run(url, params);
    }


    public async deactivateDID(url: string, params: DeactivateDIDParams): Promise<DeactivateDIDResponse> {
        const controller = new DIDRevokeController(new RevocationService(this.request));
        return await controller.run(url, params);
    }
}