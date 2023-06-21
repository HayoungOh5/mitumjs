import { Item } from "../types/item";
import { Assert, ECODE, MitumError } from "../utils/error";
import { MitumConfig } from "../utils/config";
import { SortFunc } from "../utils/math";
export class CurrencyItem extends Item {
    constructor(hint, amounts, addressType) {
        super(hint);
        Assert.check(MitumConfig.AMOUNTS_IN_ITEM.satisfy(amounts.length), MitumError.detail(ECODE.INVALID_AMOUNTS, "amounts length out of range"));
        Assert.check(new Set(amounts.map((am) => am.currency.toString())).size ===
            amounts.length, MitumError.detail(ECODE.INVALID_AMOUNTS, "duplicate amounts found in amounts"));
        this.amounts = amounts;
        this.addressType = addressType ?? "";
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            amounts: this.amounts.sort(SortFunc).map((am) => am.toHintedObject()),
        };
    }
}
//# sourceMappingURL=currencyItem.js.map