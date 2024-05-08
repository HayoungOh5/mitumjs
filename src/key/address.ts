import { AddressType } from "./types"
import { SUFFIX } from "../alias"
import { Config } from "../node"
import { CurrencyID } from "../common"
import { IBuffer, IString } from "../types"
import { ECODE, MitumError, StringAssert, Assert } from "../error"
import { getChecksum } from "../utils";

abstract class BaseAddress implements IBuffer, IString {
    private s: string
    readonly type: AddressType

    constructor(s: string, type?: AddressType) {
        this.s = s

        if (type) {
            this.type = type
        } else if (this.s.endsWith(SUFFIX.ADDRESS.MITUM)) {
            this.type = "mitum"
        } else if (this.s.endsWith(SUFFIX.ADDRESS.ETHER)) {
            this.type = "ether"
        } else if (this.s.endsWith(SUFFIX.ADDRESS.NODE)) {
            this.type = "node"
        } else if (this.s.endsWith(SUFFIX.ADDRESS.ZERO)) {
            this.type = "zero"
        } else {
            throw MitumError.detail(ECODE.INVALID_ADDRESS, "address type not detected")
        }
    }

    toBuffer(): Buffer {
        return Buffer.from(this.s)
    }

    toString(): string {
        return this.s
    }
}

// temporarily only allow address with '0x' + checksumed 40 digit hex + 'mca'
export class Address extends BaseAddress {
    constructor(s: string) {
        super(s)
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_ADDRESS, "The address must be a 45-character string"))
            .empty().not()
            .satisfyConfig(Config.ADDRESS.DEFAULT)
            .excute()

        StringAssert.with(s, MitumError.detail(ECODE.INVALID_ADDRESS_TYPE, "The address must be starting with '0x' and ending with 'mca'"))
            .startsWith('0x')
            .endsWith(SUFFIX.ADDRESS.MITUM)
            .excute()

        Assert.check(
            /^[0-9a-fA-F]+$/.test(s.slice(2, 42)),
            MitumError.detail(ECODE.INVALID_ADDRESS, `${s.slice(2, 42)} is not a hexadecimal number`),
        )

        StringAssert.with(s, MitumError.detail(ECODE.INVALID_ADDRESS_CHECKSUM, "bad address checksum"))
            .equal('0x' + getChecksum(s.slice(2, 42)) + SUFFIX.ADDRESS.MITUM)
            .excute()
    }

    static from(s: string | Address): Address {
        return s instanceof Address ? s : new Address(s)
    }
}

export class NodeAddress extends BaseAddress {
    constructor(s: string) {
        super(s, "node")
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_ADDRESS, "invalid node address"))
            .empty().not()
            .endsWith(SUFFIX.ADDRESS.NODE)
            .satisfyConfig(Config.ADDRESS.NODE)
            .excute()
    }

    static from(s: string | NodeAddress): NodeAddress {
        return s instanceof NodeAddress ? s : new NodeAddress(s)
    }
}

export class ZeroAddress extends BaseAddress {
    readonly currency: CurrencyID

    constructor(s: string) {
        super(s, "zero")
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_ADDRESS, "invalid zero address"))
            .empty().not()
            .endsWith(SUFFIX.ADDRESS.ZERO)
            .satisfyConfig(Config.ADDRESS.ZERO)
            .excute()

        this.currency = new CurrencyID(s.substring(0, s.length - Config.SUFFIX.ZERO_ADDRESS.value!))
    }

    static from(s: string | ZeroAddress): ZeroAddress {
        return s instanceof ZeroAddress ? s : new ZeroAddress(s)
    }
}