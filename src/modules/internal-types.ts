import { CreateDIDParams, CreateDIDResponse } from "../types";


export interface ICreationService {
    run(url: string, params: CreateDIDParams): Promise<CreateDIDResponse>;
}
