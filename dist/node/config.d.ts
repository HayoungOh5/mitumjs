export type Setting<T> = {
    get: () => T;
    set: (val: T) => T;
};
export declare const Version: Setting<string>;
export declare const NetworkID: Setting<string>;
export type RangeConfig = {
    value?: number;
    min: number;
    max: number;
    satisfy: (target: number) => boolean;
};
export declare const Config: {
    SUFFIX: {
        DEFAULT: RangeConfig;
        ZERO_ADDRESS: RangeConfig;
    };
    CURRENCY_ID: RangeConfig;
    CONTRACT_ID: RangeConfig;
    SEED: RangeConfig;
    THRESHOLD: RangeConfig;
    WEIGHT: RangeConfig;
    ADDRESS: {
        DEFAULT: RangeConfig;
        ZERO: RangeConfig;
        NODE: RangeConfig;
    };
    KEYS_IN_ACCOUNT: RangeConfig;
    AMOUNTS_IN_ITEM: RangeConfig;
    ITEMS_IN_FACT: RangeConfig;
    OP_SIZE: RangeConfig;
    KEY: {
        MITUM: {
            PRIVATE: RangeConfig;
            PUBLIC: RangeConfig;
        };
    };
    DMILE: {
        MERKLE_ROOT: RangeConfig;
    };
    DID: {
        PUBLIC_KEY: RangeConfig;
    };
};
