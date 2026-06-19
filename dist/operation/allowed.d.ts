import { Address } from "../key";
import { AllowedOperation } from "./base";
export declare const did: {
    registerModel(contract: string | Address): AllowedOperation;
    create(contract: string | Address): AllowedOperation;
    updateDocument(contract: string | Address): AllowedOperation;
};
export declare const allowedOperation: {
    readonly currency: {
        transfer(): AllowedOperation;
    };
    readonly account: {
        create(): AllowedOperation;
        updateKey(): AllowedOperation;
    };
    readonly contract: {
        create(): AllowedOperation;
        withdraw(): AllowedOperation;
        updateRecipient(): AllowedOperation;
        updateHandler(): AllowedOperation;
    };
    readonly did: {
        registerModel(contract: string | Address): AllowedOperation;
        create(contract: string | Address): AllowedOperation;
        updateDocument(contract: string | Address): AllowedOperation;
    };
    readonly credential: {
        registerModel(contract: string | Address): AllowedOperation;
        addTemplate(contract: string | Address): AllowedOperation;
        issue(contract: string | Address): AllowedOperation;
        revoke(contract: string | Address): AllowedOperation;
    };
    readonly dao: {
        registerModel(contract: string | Address): AllowedOperation;
        updateModelConfig(contract: string | Address): AllowedOperation;
        propose(contract: string | Address): AllowedOperation;
        cancelProposal(contract: string | Address): AllowedOperation;
        register(contract: string | Address): AllowedOperation;
        preSnap(contract: string | Address): AllowedOperation;
        postSnap(contract: string | Address): AllowedOperation;
        vote(contract: string | Address): AllowedOperation;
        execute(contract: string | Address): AllowedOperation;
    };
    readonly nft: {
        registerModel(contract: string | Address): AllowedOperation;
        updateModelConfig(contract: string | Address): AllowedOperation;
        mint(contract: string | Address): AllowedOperation;
        approveAll(contract: string | Address): AllowedOperation;
        approve(contract: string | Address): AllowedOperation;
        transfer(contract: string | Address): AllowedOperation;
        addSignature(contract: string | Address): AllowedOperation;
    };
    readonly payment: {
        registerModel(contract: string | Address): AllowedOperation;
        deposit(contract: string | Address): AllowedOperation;
        updateAccountSetting(contract: string | Address): AllowedOperation;
        withdraw(contract: string | Address): AllowedOperation;
        transfer(contract: string | Address): AllowedOperation;
    };
    readonly point: {
        registerModel(contract: string | Address): AllowedOperation;
        mint(contract: string | Address): AllowedOperation;
        transfer(contract: string | Address): AllowedOperation;
        approve(contract: string | Address): AllowedOperation;
        burn(contract: string | Address): AllowedOperation;
        transferFrom(contract: string | Address): AllowedOperation;
    };
    readonly storage: {
        registerModel(contract: string | Address): AllowedOperation;
        createData(contract: string | Address): AllowedOperation;
        deleteData(contract: string | Address): AllowedOperation;
        updateData(contract: string | Address): AllowedOperation;
    };
    readonly timestamp: {
        registerModel(contract: string | Address): AllowedOperation;
        issue(contract: string | Address): AllowedOperation;
    };
    readonly token: {
        registerModel(contract: string | Address): AllowedOperation;
        mint(contract: string | Address): AllowedOperation;
        transfer(contract: string | Address): AllowedOperation;
        approve(contract: string | Address): AllowedOperation;
        burn(contract: string | Address): AllowedOperation;
        transferFrom(contract: string | Address): AllowedOperation;
    };
};
