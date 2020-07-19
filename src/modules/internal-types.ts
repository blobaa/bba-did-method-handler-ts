import { CreateDIDParams, CreateDIDResponse, UpdateDIDPayloadParams, UpdateDIDPayloadResponse } from "../types";


export interface ICreationService {
    run(url: string, params: CreateDIDParams): Promise<CreateDIDResponse>;
}

export interface IUpdatePayloadService {
    run(url: string, params: UpdateDIDPayloadParams): Promise<UpdateDIDPayloadResponse>;
}
