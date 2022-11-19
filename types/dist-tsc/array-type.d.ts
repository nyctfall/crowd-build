declare type typeofTypes = "undefined" | "object" | "boolean" | "number" | "bigint" | "string" | "symbol" | "function";
export interface ArrayWithTypesOpts<T> {
    type: T | typeofTypes;
    typeCoercer?: (arg0: any) => T | undefined;
    isTypeCoercible?: (arg0: any) => boolean;
    initArray?: T[];
    seal?: boolean;
    freeze?: boolean;
}
export declare class ArrayWithTypes<T> {
    #private;
    constructor({ type, typeCoercer, isTypeCoercible, initArray, seal, freeze }: ArrayWithTypesOpts<T>);
    get length(): number;
    get isType(): (arg: any) => boolean;
    get check(): (arg: any) => T | undefined;
    get type(): string | T;
    get(index: number): T;
    set(index: number, value: T): NonNullable<T> | undefined;
    getArray(): T[];
    get array(): T[];
    fill(value: T, start?: number, end?: number): T[] | undefined;
    splice(start: number, deleteCount?: number, ...items: T[]): T[];
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
export interface ArrayTypeConfig<T> {
    type: T | typeofTypes;
    coercer?: (arg0: any) => T | undefined;
    verifier?: (arg0: any) => boolean;
    initArray?: T[];
    seal?: boolean;
    freeze?: boolean;
}
export declare class ArrayTypeSafeMethods<T> extends Array<T> {
    #private;
    static get [Symbol.species](): ArrayConstructor;
    constructor({ type, coercer, verifier, initArray, seal, freeze }: ArrayTypeConfig<T>);
    get verifier(): (arg: any) => boolean;
    get coercer(): (arg: any) => T | undefined;
    get type(): typeofTypes | T;
    toArray(): T[];
    get array(): T[];
    fill(value: T, start?: number, end?: number): this;
    splice(start: number, deleteCount?: number, ...items: T[]): T[];
    push(...items: T[]): number;
}
export declare function ArrayTypeSafeProxy<T>(config: ArrayTypeConfig<T>): ArrayTypeSafeMethods<T>;
export {};
//# sourceMappingURL=array-type.d.ts.map