"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbgLog = exports.dbgFileLogger = void 0;
const dbgLog = (file, trace, ...logs) => {
    try {
        console.log(`${"-".repeat(8)}${file}${"-".repeat(8)}\n`, `> ${[trace]
            .flat(1)
            .map(str => (str.endsWith(")") ? str : `${str}()`))
            .join(" > ")}:\n`, ...logs.map((varNameOrVal, index) => index % 2 === 1
            ? varNameOrVal
            : `${varNameOrVal?.startsWith?.("\n") ? "" : "\n"}${varNameOrVal}${varNameOrVal?.endsWith?.(":") ? "" : ":"}`));
    }
    catch (e) {
        console.error(e);
    }
};
exports.dbgLog = dbgLog;
const dbgErrorLog = (file, trace, ...logs) => {
    try {
        console.error(`ERR${"~".repeat(8)}${file}${"~".repeat(8)}ERR\n`, `> ${[trace]
            .flat(1)
            .map(str => (str.endsWith(")") ? str : `${str}()`))
            .join(" > ")}:\n`, ...logs.map((varNameOrVal, index) => index % 2 === 1
            ? varNameOrVal
            : `${varNameOrVal?.startsWith?.("\n") ? "" : "\n"}${varNameOrVal}${varNameOrVal?.endsWith?.(":") ? "" : ":"}`));
    }
    catch (e) {
        console.error(e);
    }
};
const dbgInfoLog = (file, trace, ...logs) => {
    try {
        console.info(`INFO${"~".repeat(8)}${file}${"~".repeat(8)}INFO\n`, `> ${[trace]
            .flat(1)
            .map(str => (str.endsWith(")") ? str : `${str}()`))
            .join(" > ")}:\n`, ...logs.map((varNameOrVal, index) => index % 2 === 1
            ? varNameOrVal
            : `${varNameOrVal?.startsWith?.("\n") ? "" : "\n"}${varNameOrVal}${varNameOrVal?.endsWith?.(":") ? "" : ":"}`));
    }
    catch (e) {
        console.error(e);
    }
};
const dbgWarnLog = (file, trace, ...logs) => {
    try {
        console.warn(`WARN${"~".repeat(8)}${file}${"~".repeat(8)}WARN\n`, `> ${[trace]
            .flat(1)
            .map(str => (str.endsWith(")") ? str : `${str}()`))
            .join(" > ")}:\n`, ...logs.map((varNameOrVal, index) => index % 2 === 1
            ? varNameOrVal
            : `${varNameOrVal?.startsWith?.("\n") ? "" : "\n"}${varNameOrVal}${varNameOrVal?.endsWith?.(":") ? "" : ":"}`));
    }
    catch (e) {
        console.error(e);
    }
};
const dbgDebugLog = (file, trace, ...logs) => {
    try {
        console.debug(`DEBUG${"~".repeat(8)}${file}${"~".repeat(8)}DEBUG\n`, `> ${[trace]
            .flat(1)
            .map(str => (str.endsWith(")") ? str : `${str}()`))
            .join(" > ")}:\n`, ...logs.map((varNameOrVal, index) => index % 2 === 1
            ? varNameOrVal
            : `${varNameOrVal?.startsWith?.("\n") ? "" : "\n"}${varNameOrVal}${varNameOrVal?.endsWith?.(":") ? "" : ":"}`));
    }
    catch (e) {
        console.error(e);
    }
};
const dbgFileLogger = file => {
    const fileFn = (trace, ...logs) => dbgLog(file, trace, ...logs);
    const fileErrFn = (trace, ...logs) => dbgErrorLog(file, trace, ...logs);
    const fileInfoFn = (trace, ...logs) => dbgInfoLog(file, trace, ...logs);
    const fileWarnFn = (trace, ...logs) => dbgWarnLog(file, trace, ...logs);
    const fileDebugFn = (trace, ...logs) => dbgDebugLog(file, trace, ...logs);
    fileFn.file = file;
    const stackLogger = (...stackTrace) => {
        const trace = stackTrace.flat();
        const stackFn = (...logs) => fileFn(trace, ...logs);
        stackFn.file = file;
        stackFn.trace = trace;
        stackFn.error = (...logs) => fileErrFn(trace, ...logs);
        stackFn.info = (...logs) => fileInfoFn(trace, ...logs);
        stackFn.warn = (...logs) => fileWarnFn(trace, ...logs);
        stackFn.debug = (...logs) => fileDebugFn(trace, ...logs);
        stackFn.stackLoggerInc = (...nestedTrace) => stackLogger(...trace, ...nestedTrace.flat());
        return stackFn;
    };
    fileFn.error = fileErrFn;
    fileFn.info = fileInfoFn;
    fileFn.warn = fileWarnFn;
    fileFn.debug = fileDebugFn;
    fileFn.stackLogger = stackLogger;
    return fileFn;
};
exports.dbgFileLogger = dbgFileLogger;
dbgLog.fileLogger = exports.dbgFileLogger;
dbgLog.error = dbgErrorLog;
dbgLog.info = dbgInfoLog;
dbgLog.warn = dbgWarnLog;
dbgLog.debug = dbgDebugLog;
//# sourceMappingURL=logger.js.map