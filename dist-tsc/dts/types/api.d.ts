import Big from "big.js";
export declare enum PCPartType {
    CPU = "CPU",
    GPU = "GPU",
    RAM = "RAM",
    Cooler = "Cooler",
    Motherboard = "Motherboard",
    SSD = "SSD",
    HDD = "HDD",
    SSHD = "SSHD",
    PSU = "PSU",
    Case = "Case"
}
export interface PCPartInfo {
    name: string;
    type: PCPartType;
    id: string;
    manufacturer?: string;
    model?: string;
    released?: string;
    typeInfo?: Record<string, any>;
    rating?: string;
    ratings?: string;
    MSRP: string | number;
    img?: string;
}
export interface PCPartSearchParamsState {
    ids: string[];
    oems: string[];
    types: PCPartType[];
    minPrice?: string | Big;
    maxPrice?: string | Big;
}
declare type typeofTypes = "undefined" | "object" | "boolean" | "number" | "bigint" | "string" | "symbol" | "function";
declare class ArrayWithTypes<T> {
    #private;
    constructor({ type, typeCoercer, isTypeCoercible, initArray, seal, freeze }: {
        type: T | typeofTypes;
        typeCoercer?: (_: any) => T | undefined;
        isTypeCoercible?: (arg0: any) => boolean;
        initArray?: T[];
        seal?: boolean;
        freeze?: boolean;
    });
    get length(): number;
    get isType(): (arg: any) => boolean;
    get check(): (arg: any) => T | undefined;
    get type(): string | T;
    get(index: number): T;
    set(index: number, value: T): NonNullable<T> | undefined;
    getArray(): T[];
    get array(): T[];
    fill(value: T, start?: number, end?: number): T[] | undefined;
    splice(start: number, deleteCount?: number, ...items: T[]): T[] | undefined;
    push(...items: T[]): number | undefined;
    at: (index: number) => T | undefined;
    concat: {
        (...items: ConcatArray<T>[]): T[];
        (...items: (T | ConcatArray<T>)[]): T[];
    };
    copyWithin: (target: number, start: number, end?: number | undefined) => T[];
    entries: () => IterableIterator<[number, T]>;
    every: {
        <S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): this is S[];
        (predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean;
    };
    filter: {
        <S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
        (predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
    };
    find: {
        <S extends T>(predicate: (this: void, value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
        (predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined;
    };
    findIndex: (predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any) => number;
    flat: <A, D extends number = 1>(this: A, depth?: D | undefined) => FlatArray<A, D>[];
    flatMap: <U, This = undefined>(callback: (this: This, value: T, index: number, array: T[]) => U | readonly U[], thisArg?: This | undefined) => U[];
    forEach: (callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any) => void;
    includes: (searchElement: T, fromIndex?: number | undefined) => boolean;
    indexOf: (searchElement: T, fromIndex?: number | undefined) => number;
    join: (separator?: string | undefined) => string;
    keys: () => IterableIterator<number>;
    lastIndexOf: (searchElement: T, fromIndex?: number | undefined) => number;
    map: <U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any) => U[];
    pop: () => T | undefined;
    reduce: {
        (callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
        (callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
        <U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
    };
    reduceRight: {
        (callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
        (callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
        <U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
    };
    reverse: () => T[];
    shift: () => T | undefined;
    slice: (start?: number | undefined, end?: number | undefined) => T[];
    some: (predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any) => boolean;
    sort: (compareFn?: ((a: T, b: T) => number) | undefined) => T[];
    toLocaleString: () => string;
    toString: () => string;
    values: () => IterableIterator<T>;
}
export declare class PCPartSearchURI {
    #private;
    constructor(config?: {
        ids?: string | string[];
        types?: string | string[];
        oems?: string | string[];
        maxPrice?: Big | string;
        minPrice?: Big | string;
    });
    set minPriceFilter(newValue: Big | string | undefined);
    get minPriceFilter(): Big | undefined;
    set maxPriceFilter(newValue: Big | string | undefined);
    get maxPriceFilter(): Big | undefined;
    get filterIDs(): ArrayWithTypes<string>;
    get filterTypes(): ArrayWithTypes<PCPartType>;
    get filterOEMs(): ArrayWithTypes<string>;
    toURI(): URLSearchParams;
    toString(): string;
}
export declare const filterDB: (data: PCPartInfo[], query: qs.ParsedQs | PCPartSearchParamsState | Record<string, string | string[]> | Record<string, any>) => PCPartInfo[];
export {};
//# sourceMappingURL=api.d.ts.map