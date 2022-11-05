import Big, { BigSource } from "big.js";
import { ArrayWithTypes } from "./array-type";
import type { ArrayWithTypesOpts } from "./array-type";
export declare const dbgLog: (file: string, trace: string | string[], ...logs: Array<string | any>) => void;
export interface SessionUser {
    _id: string;
    username: string;
    password?: string;
    lists: string[];
}
export interface PatchUserParams {
    username: string;
    token: string;
}
export interface DeleteListParams {
    id: string;
    token?: string;
}
export interface FetchSubsetParams {
    offset?: number;
    limit?: number;
}
export declare type FetchListParams = FetchSubsetParams & {
    id?: string;
} & ({
    token: string;
} | {
    token?: never;
});
export interface SaveListParams {
    token?: string;
    parts: string[];
}
export declare type EditListParams = SaveListParams & {
    id: string;
};
export interface LoginCredentials {
    username: string;
    password: string;
}
export interface LoginOrSigninCredentials {
    username: string;
    password: string;
    createUser?: boolean;
}
export interface List {
    _id: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    user?: string;
    parts: string[];
}
export interface SessionType {
    token?: string;
    success: boolean;
    user?: SessionUser;
    conflict?: boolean;
    nonexistant?: boolean;
    preexisting?: string[];
    incorrect?: string[];
}
interface DBAckRes {
    acknowledged: boolean;
}
interface DBDeleteRes {
    deletedCount?: number;
}
interface DBModifyRes {
    modifiedCount?: number;
    upsertedId?: string | null;
    upsertedCount?: number;
    matchedCount?: number;
}
export declare type DeleteResponce = DBAckRes & DBDeleteRes;
export declare type ModifyResponce = DBAckRes & DBModifyRes;
export interface NewsStory {
    _id: string;
    title: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    content?: string;
    link?: string;
}
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
    _id: string;
    name: string;
    type: PCPartType;
    oem?: string;
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
export declare const idFilterBuilder: (opts?: Omit<ArrayWithTypesOpts<string>, "type">) => ArrayWithTypes<string>;
export declare const oemFilterBuilder: (opts?: Omit<ArrayWithTypesOpts<string>, "type">) => ArrayWithTypes<string>;
export declare const typeFilterBuilder: (opts?: Omit<ArrayWithTypesOpts<PCPartType>, "type" | "typeCoercer" | "isTypeCoercible">) => ArrayWithTypes<PCPartType>;
export declare class PCPartSearchURI {
    #private;
    constructor(config?: {
        ids?: string | string[];
        types?: string | string[];
        oems?: string | string[];
        maxPrice?: Big | string;
        minPrice?: Big | string;
    });
    set minPriceFilter(newValue: Exclude<BigSource, number> | undefined);
    get minPriceFilter(): Big | undefined;
    set maxPriceFilter(newValue: Exclude<BigSource, number> | undefined);
    get maxPriceFilter(): Big | undefined;
    get filterIDs(): ArrayWithTypes<string>;
    get filterTypes(): ArrayWithTypes<PCPartType>;
    get filterOEMs(): ArrayWithTypes<string>;
    toURI(): URLSearchParams;
    toURIEncoded(): URLSearchParams;
    toString(): string;
}
export declare const filterDB: (data: PCPartInfo[], query: qs.ParsedQs | PCPartSearchParamsState | Record<string, string | string[]> | Record<string, any>) => PCPartInfo[];
export {};
//# sourceMappingURL=api.d.ts.map