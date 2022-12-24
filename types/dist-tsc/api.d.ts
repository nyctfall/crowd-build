import Big, { BigSource } from "big.js";
import { ArrayWithTypes } from "./array-type";
import type { ArrayWithTypesOpts } from "./array-type";
import { dbgLog } from "./logger";
export { dbgLog };
export * from "./logger";
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
export type FetchListParams = FetchSubsetParams & {
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
export type EditListParams = SaveListParams & {
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
export type DeleteResponce = DBAckRes & DBDeleteRes;
export type ModifyResponce = DBAckRes & DBModifyRes;
export declare enum HTTPStatusCode {
    "Continue" = 100,
    "Switching Protocols" = 101,
    "Processing" = 102,
    "Early Hints" = 103,
    "OK" = 200,
    "Created" = 201,
    "Accepted" = 202,
    "Non-Authoritative Information" = 203,
    "No Content" = 204,
    "Reset Content" = 205,
    "Partial Content" = 206,
    "Multi-Status" = 207,
    "Already Reported" = 208,
    "IM Used" = 226,
    "Multiple Choices" = 300,
    "Moved Permanently" = 301,
    "Found" = 302,
    "See Other" = 303,
    "Not Modified" = 304,
    "Use Proxy" = 305,
    "unused" = 306,
    "Temporary Redirect" = 307,
    "Permanent Redirect" = 308,
    "Bad Request" = 400,
    "Unauthorized" = 401,
    "Payment Required" = 402,
    "Forbidden" = 403,
    "Not Found" = 404,
    "Method Not Allowed" = 405,
    "Not Acceptable" = 406,
    "Proxy Authentication Required" = 407,
    "Request Timeout" = 408,
    "Conflict" = 409,
    "Gone" = 410,
    "Length Required" = 411,
    "Precondition Failed" = 412,
    "Payload Too Large" = 413,
    "URI Too Long" = 414,
    "Unsupported Media Type" = 415,
    "Range Not Satisfiable" = 416,
    "Expectation Failed" = 417,
    "I'm a teapot" = 418,
    "Misdirected Request" = 421,
    "Unprocessable Entity" = 422,
    "Locked" = 423,
    "Failed Dependency" = 424,
    "Too Early" = 425,
    "Upgrade Required" = 426,
    "Precondition Required" = 428,
    "Too Many Requests" = 429,
    "Request Header Fields Too Large" = 431,
    "Unavailable For Legal Reasons" = 451,
    "Internal Server Error" = 500,
    "Not Implemented" = 501,
    "Bad Gateway" = 502,
    "Service Unavailable" = 503,
    "Gateway Timeout" = 504,
    "HTTP Version Not Supported" = 505,
    "Variant Also Negotiates" = 506,
    "Insufficient Storage" = 507,
    "Loop Detected" = 508,
    "Not Extended" = 510,
    "Network Authentication Required" = 511
}
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
export interface PCPartTypeInfo {
    platform?: "desktop" | "mobile" | "server" | "embedded";
    unlocked?: boolean;
    codename?: Capitalize<string>;
    architechure?: string;
    PCIe?: `${number}.${number}`;
    PIB?: string | boolean;
    socket?: string;
    memory?: `${"Q" | "D" | "S"}DR${string}`;
    memorySpeed?: `DDR${number}-${number}`;
    memoryChannels?: number;
    cores?: number;
    pCores?: number | boolean;
    eCores?: number | boolean;
    threads?: number;
    SMT?: boolean;
    hyperthreading?: boolean;
    baseClock?: `${number}${"G" | "M" | "K"}Hz`;
    boostClock?: `${number}${"G" | "M" | "K"}Hz`;
    TjMax?: `${number}C`;
    TDP?: `${number}W`;
    L1Cache?: `${number}${"M" | "K"}B` | boolean;
    L2Cache?: `${number}${"M" | "K"}B` | boolean;
    L3Cache?: `${number}${"M" | "K"}B` | boolean;
    graphincs?: string | boolean;
    graphincsArchitechure?: string;
    graphincsCores?: number;
    graphincsBaseClock?: `${number}${"G" | "M" | "K"}Hz`;
    graphincsBoostClock?: `${number}${"G" | "M" | "K"}Hz`;
    processNode?: string;
    productFamily?: string;
    productLine?: string;
    productIdBoxed?: string;
    productIdTray?: string;
}
export interface PCPartInfo {
    _id: string;
    name: string;
    type: PCPartType;
    oem?: string;
    model?: string;
    released?: string;
    typeInfo?: PCPartTypeInfo;
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
export declare const filterDB: (data: PCPartInfo[], query: PCPartSearchParamsState | Record<string, string | string[]> | Record<string, any>) => PCPartInfo[];
export declare const storageAvailable: (type: "localStorage" | "sessionStorage") => boolean | undefined;
//# sourceMappingURL=api.d.ts.map