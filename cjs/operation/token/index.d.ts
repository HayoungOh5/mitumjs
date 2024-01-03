import { RegisterTokenFact } from "./register-token.js";
import { MintFact } from "./mint.js";
import { BurnFact } from "./burn.js";
import { TransferFact } from "./transfer.js";
import { ApproveFact } from "./approve.js";
import { TransferFromFact } from "./transfer-from.js";
import { ContractGenerator, Operation } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { Big, IP, LongString } from "../../types/index.js";
export declare class Token extends ContractGenerator {
    constructor(networkID: string, api?: string | IP, delegateIP?: string | IP);
    registerToken(contractAddr: string | Address, sender: string | Address, currency: string | CurrencyID, name: string | LongString, symbol: string | CurrencyID, initialSupply?: string | number | Big): Operation<RegisterTokenFact>;
    mint(contractAddr: string | Address, sender: string | Address, currency: string | CurrencyID, receiver: string | Address, amount: string | number | Big): Operation<MintFact>;
    burn(contractAddr: string | Address, sender: string | Address, currency: string | CurrencyID, target: string | Address, amount: string | number | Big): Operation<BurnFact>;
    transfer(contractAddr: string | Address, sender: string | Address, currency: string | CurrencyID, receiver: string | Address, amount: string | number | Big): Operation<TransferFact>;
    transferFrom(contractAddr: string | Address, sender: string | Address, currency: string | CurrencyID, receiver: string | Address, target: string | Address, amount: string | number | Big): Operation<TransferFromFact>;
    approve(contractAddr: string | Address, sender: string | Address, currency: string | CurrencyID, approved: string | Address, amount: string | number | Big): Operation<ApproveFact>;
    getTokenInfo(contractAddr: string | Address): Promise<any>;
    getAllowance(contractAddr: string | Address, owner: string | Address, spender: string | Address): Promise<{
        amount: any;
    } | null | undefined>;
    getTokenBalance(contractAddr: string | Address, owner: string | Address): Promise<any>;
}
