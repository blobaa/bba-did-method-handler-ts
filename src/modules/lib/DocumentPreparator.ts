import { objectAny } from "@blobaa/ardor-ts";


export default class DocumentPreparator {
    private document: objectAny = {};


    constructor(document: objectAny) {
        this.document = { ...document };
        delete this.document.created;
        delete this.document.updated;
    }


    public getDocument(): objectAny {
        return this.document;
    }


    public clean(): void {
        const id = this.document.id || "";
        const keys = Object.keys(this.document);


        keys.forEach((key) => {
            if (key === "id") {
                this.document.id = "";
            }

            if (key === "publicKey" || key === "authentication" || key === "assertionMethod" || key === "service" ||
                key === "keyAgreement" || key === "capabilityInvocation" || key === "capabilityDelegation" ) {
                this.removeIdFromArray(this.document[key], id);
            }
        });
    }

    private removeIdFromArray(array: (objectAny | string)[], id: string): void {
        array.forEach((elements: {} | string, idx: number) => {
            if (typeof elements === "string") {
                const idProperty = array[idx];
                array[idx] = idProperty.replace(id, "");
            }

            if (typeof elements === "object") {
                const keys = Object.keys(array[idx]);
                keys.forEach((key) => {
                    if (key === "id") {
                        const idProperty = (array[idx] as objectAny).id;
                        (array[idx] as objectAny).id = idProperty.replace(id, "");
                    }
                    if (key === "controller") {
                        const controllerProperty: string = (array[idx] as objectAny).controller;
                        if (controllerProperty === id) {
                            (array[idx] as objectAny).controller = "";
                        }
                    }
                });
            }
        });
    }


    public addDID(did: string): void {
        const keys = Object.keys(this.document);


        keys.forEach((key) => {
            if (key === "id") {
                this.document.id = did;
            }

            if (key === "publicKey" || key === "authentication" || key === "assertionMethod" || key === "service" ||
                key === "keyAgreement" || key === "capabilityInvocation" || key === "capabilityDelegation" ) {
                this.addIdInArray(this.document[key], did);
            }
        });
    }

    private addIdInArray(array: (objectAny | string)[], id: string): void {
        array.forEach((elements: {} | string, idx: number) => {
            if (typeof elements === "string") {
                const idProperty = array[idx];
                array[idx] = id + idProperty;
            }

            if (typeof elements === "object") {
                const keys = Object.keys(array[idx]);
                keys.forEach((key) => {
                    if (key === "id") {
                        const idProperty = (array[idx] as objectAny).id;
                        (array[idx] as objectAny).id = id + idProperty;
                    }
                    if (key === "controller") {
                        const controllerProperty: string = (array[idx] as objectAny).controller;
                        if (controllerProperty === "") {
                            (array[idx] as objectAny).controller = id;
                        }
                    }
                });
            }
        });
    }


    public addCreationDate(date: string): void {
        this.document.created = date;
    }


    public addUpdateDate(date: string): void {
        this.document.updated = date;
    }
}