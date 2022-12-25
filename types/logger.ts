/**
 * @file Debugging log helper.
 */

/**
 * Debugging log helper, formats and prints values in a easy to read layout, with source file and stack-trace-like info.
 *
 * @prop {@link FileLoggerFactory} fileLogger Returns a function that calls the debug logger with a preset file name for all invokations.
 * @param file The file the logging function is being called from.
 * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
 * @param logs The variables the logging function is outputing the values of.
 * @example
 * // in the form: ("string for variable name", variable):
 * dbgLog(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 */
const dbgLog: Logger = (file, trace, ...logs) => {
  try {
    console.log(
      `${"-".repeat(8)}${file}${"-".repeat(8)}\n`,
      `> ${[trace]
        .flat(1)
        .map(str => (str.endsWith(")") ? str : `${str}()`))
        .join(" > ")}:\n`,
      /* display the var name as: `\nVarName: ${VarValue}` */
      ...logs.map((varNameOrVal: string | any, index) =>
        index % 2 === 1
          ? varNameOrVal
          : `${(varNameOrVal as string)?.startsWith?.("\n") ? "" : "\n"}${varNameOrVal}${
              (varNameOrVal as string)?.endsWith?.(":") ? "" : ":"
            }`
      )
    )
  } catch (e) {
    console.error(e)
  }
}

const dbgErrorLog: LogFn = (file, trace, ...logs) => {
  try {
    console.error(
      `ERR${"~".repeat(8)}${file}${"~".repeat(8)}ERR\n`,
      `> ${[trace]
        .flat(1)
        .map(str => (str.endsWith(")") ? str : `${str}()`))
        .join(" > ")}:\n`,
      /* display the var name as: `\nVarName: ${VarValue}` */
      ...logs.map((varNameOrVal: string | any, index) =>
        index % 2 === 1
          ? varNameOrVal
          : `${(varNameOrVal as string)?.startsWith?.("\n") ? "" : "\n"}${varNameOrVal}${
              (varNameOrVal as string)?.endsWith?.(":") ? "" : ":"
            }`
      )
    )
  } catch (e) {
    console.error(e)
  }
}

const dbgInfoLog: LogFn = (file, trace, ...logs) => {
  try {
    console.info(
      `INFO${"~".repeat(8)}${file}${"~".repeat(8)}INFO\n`,
      `> ${[trace]
        .flat(1)
        .map(str => (str.endsWith(")") ? str : `${str}()`))
        .join(" > ")}:\n`,
      /* display the var name as: `\nVarName: ${VarValue}` */
      ...logs.map((varNameOrVal: string | any, index) =>
        index % 2 === 1
          ? varNameOrVal
          : `${(varNameOrVal as string)?.startsWith?.("\n") ? "" : "\n"}${varNameOrVal}${
              (varNameOrVal as string)?.endsWith?.(":") ? "" : ":"
            }`
      )
    )
  } catch (e) {
    console.error(e)
  }
}

const dbgWarnLog: LogFn = (file, trace, ...logs) => {
  try {
    console.warn(
      `WARN${"~".repeat(8)}${file}${"~".repeat(8)}WARN\n`,
      `> ${[trace]
        .flat(1)
        .map(str => (str.endsWith(")") ? str : `${str}()`))
        .join(" > ")}:\n`,
      /* display the var name as: `\nVarName: ${VarValue}` */
      ...logs.map((varNameOrVal: string | any, index) =>
        index % 2 === 1
          ? varNameOrVal
          : `${(varNameOrVal as string)?.startsWith?.("\n") ? "" : "\n"}${varNameOrVal}${
              (varNameOrVal as string)?.endsWith?.(":") ? "" : ":"
            }`
      )
    )
  } catch (e) {
    console.error(e)
  }
}

const dbgDebugLog: LogFn = (file, trace, ...logs) => {
  try {
    console.debug(
      `DEBUG${"~".repeat(8)}${file}${"~".repeat(8)}DEBUG\n`,
      `> ${[trace]
        .flat(1)
        .map(str => (str.endsWith(")") ? str : `${str}()`))
        .join(" > ")}:\n`,
      /* display the var name as: `\nVarName: ${VarValue}` */
      ...logs.map((varNameOrVal: string | any, index) =>
        index % 2 === 1
          ? varNameOrVal
          : `${(varNameOrVal as string)?.startsWith?.("\n") ? "" : "\n"}${varNameOrVal}${
              (varNameOrVal as string)?.endsWith?.(":") ? "" : ":"
            }`
      )
    )
  } catch (e) {
    console.error(e)
  }
}

/**
 * Helper for the debugging log helper, returns a function that calls the debug logger with a preset file name for all invokations.
 *
 * @param file The file the logging function is being called from.
 * @returns {@link FileLogger} The function the will have a preset file, other args same as dbgLog.
 * @example
 * const log = dbgLog.fileLogger(file)
 * log(trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 * // same as dbgLog(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 */
export const dbgFileLogger: FileLoggerFactory = file => {
  const fileFn: FileLogger = (trace, ...logs) => dbgLog(file, trace, ...logs)
  const fileErrFn: FileLogFn = (trace, ...logs) => dbgErrorLog(file, trace, ...logs)
  const fileInfoFn: FileLogFn = (trace, ...logs) => dbgInfoLog(file, trace, ...logs)
  const fileWarnFn: FileLogFn = (trace, ...logs) => dbgWarnLog(file, trace, ...logs)
  const fileDebugFn: FileLogFn = (trace, ...logs) => dbgDebugLog(file, trace, ...logs)

  fileFn.file = file

  const stackLogger: StackLoggerFactory = (...stackTrace) => {
    const trace = stackTrace.flat()

    const stackFn: StackLogger = (...logs) => fileFn(trace, ...logs)

    stackFn.file = file
    stackFn.trace = trace
    stackFn.error = (...logs) => fileErrFn(trace, ...logs)
    stackFn.info = (...logs) => fileInfoFn(trace, ...logs)
    stackFn.warn = (...logs) => fileWarnFn(trace, ...logs)
    stackFn.debug = (...logs) => fileDebugFn(trace, ...logs)
    stackFn.stackLoggerInc = (...nestedTrace) => stackLogger(...trace, ...nestedTrace.flat())

    return stackFn
  }

  fileFn.error = fileErrFn
  fileFn.info = fileInfoFn
  fileFn.warn = fileWarnFn
  fileFn.debug = fileDebugFn
  fileFn.stackLogger = stackLogger

  return fileFn
}

/**
 * Debugging error log helper, formats and prints values in a easy to read layout, with source file and stack-trace-like info.
 *
 * @param file The file the logging function is being called from.
 * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
 * @param logs The variables the logging function is outputing the values of.
 * @example
 * // in the form: ("string for variable name", variable):
 * dbgLog(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 */
export type LogFn = (file: string, trace: string | string[], ...logs: LogVariableLables) => void
/**
 * Helper for the debugging log helper, returns a function that calls the debug logger with a preset file name for all invokations.
 *
 * @param file The file the logging function is being called from.
 * @returns {@link FileLogger} The function the will have a preset file, other args same as dbgLog.
 * @example
 * const log = dbgLog.fileLogger(file)
 * log(trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 * // same as dbgLog(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 */
export type FileLogFn = (trace: string | string[], ...logs: LogVariableLables) => void
/**
 * Helper for the file debug log helper, returns a function that calls the debug file logger with a preset stack trace for all invokations.
 *
 * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
 * @example
 * const fileLogger = dbgLog.fileLogger(file)
 * const log = fileLogger.stackLogger(trace)
 * log("variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 * // same as dbgLog(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 */
export type StackLogFn = (...logs: LogVariableLables) => void

export type FileLoggerFactory = (file: string) => FileLogger
export type StackLoggerFactory = (...trace: string[] | [string | string[]]) => StackLogger

/**
 * Debugging error log helper, formats and prints values in a easy to read layout, with source file and stack-trace-like info.
 *
 * @prop {@link FileLoggerFactory} fileLogger Returns a function that calls the debug logger with a preset file name for all invokations.
 * @param file The file the logging function is being called from.
 * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
 * @param logs The variables the logging function is outputing the values of.
 * @example
 * // in the form: ("string for variable name", variable):
 * dbgLog(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 */
export type Logger = {
  (file: string, trace: string | string[], ...logs: LogVariableLables): void
  /**
   * Helper for the debugging log helper, returns a function that calls the debug logger with a preset file name for all invokations.
   *
   * @readonly
   * @param file The file the logging function is being called from.
   * @returns {@link FileLogger} The function the will have a preset file, other args same as dbgLog.
   * @example
   * const log = dbgLog.fileLogger(file)
   * log(trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   * // same as dbgLog(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   */
  fileLogger: FileLoggerFactory
  /**
   * Debugging error log helper, formats and prints values in a easy to read layout, with source file and stack-trace-like info.
   *
   * @readonly
   * @param file The file the logging function is being called from.
   * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
   * @param logs The variables the logging function is outputing the values of.
   * @example
   * // in the form: ("string for variable name", variable):
   * dbgLog.error(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   */
  error: LogFn
  /**
   * Debugging info log helper, formats and prints values in a easy to read layout, with source file and stack-trace-like info.
   *
   * @readonly
   * @param file The file the logging function is being called from.
   * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
   * @param logs The variables the logging function is outputing the values of.
   * @example
   * // in the form: ("string for variable name", variable):
   * dbgLog.error(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   */
  info: LogFn
  /**
   * Debugging warn log helper, formats and prints values in a easy to read layout, with source file and stack-trace-like info.
   *
   * @readonly
   * @param file The file the logging function is being called from.
   * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
   * @param logs The variables the logging function is outputing the values of.
   * @example
   * // in the form: ("string for variable name", variable):
   * dbgLog.error(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   */
  warn: LogFn
  /**
   * Debugging debug log helper, formats and prints values in a easy to read layout, with source file and stack-trace-like info.
   *
   * @readonly
   * @param file The file the logging function is being called from.
   * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
   * @param logs The variables the logging function is outputing the values of.
   * @example
   * // in the form: ("string for variable name", variable):
   * dbgLog.error(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   */
  debug: LogFn
}

/**
 * Helper for the debugging log helper, returns a function that calls the debug logger with a preset file name for all invokations.
 *
 * @param file The file the logging function is being called from.
 * @returns {@link FileLogger} The function the will have a preset file, other args same as dbgLog.
 * @example
 * const log = dbgLog.fileLogger(file)
 * log(trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 * // same as dbgLog(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 */
export type FileLogger = {
  (trace: string | string[], ...logs: LogVariableLables): void
  /**
   * Helper for the file debug log helper, returns a function that calls the debug file logger with a preset stack trace for all invokations.
   *
   * @readonly
   * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
   * @returns {@link StackLogger} The debug logger function with a preset stack trace value.
   * @example
   * const fileLogger = dbgLog.fileLogger(file)
   * const log = fileLogger.stackLogger(trace)
   * log("variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   * // same as dbgLog(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   */
  stackLogger: StackLoggerFactory
  /**
   * Helper for the debugging log helper, returns a function that calls the debug logger with a preset file name for all invokations.
   *
   * @readonly
   * @param file The file the logging function is being called from.
   * @example
   * const log = dbgLog.fileLogger(file)
   * log.error(trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   * // same as dbgLog.error(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   */
  error: FileLogFn
  /**
   * Helper for the debugging info log helper, returns a function that calls the debug logger with a preset file name for all invokations.
   *
   * @readonly
   * @param file The file the logging function is being called from.
   * @example
   * const log = dbgLog.fileLogger(file)
   * log.error(trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   * // same as dbgLog.error(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   */
  info: FileLogFn
  /**
   * Helper for the debugging warn log helper, returns a function that calls the debug logger with a preset file name for all invokations.
   *
   * @readonly
   * @param file The file the logging function is being called from.
   * @example
   * const log = dbgLog.fileLogger(file)
   * log.error(trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   * // same as dbgLog.error(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   */
  warn: FileLogFn
  /**
   * Helper for the debugging debug log helper, returns a function that calls the debug logger with a preset file name for all invokations.
   *
   * @readonly
   * @param file The file the logging function is being called from.
   * @example
   * const log = dbgLog.fileLogger(file)
   * log.error(trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   * // same as dbgLog.error(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   */
  debug: FileLogFn
  /** @readonly */
  file?: string
}

/**
 * Helper for the file debug log helper, returns a function that calls the debug file logger with a preset stack trace for all invokations.
 *
 * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
 * @example
 * const fileLogger = dbgLog.fileLogger(file)
 * const log = fileLogger.stackLogger(trace)
 * log("variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 * // same as dbgLog(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 */
export type StackLogger = {
  (...logs: LogVariableLables): void
  /**
   * Helper for the file debug log helper, returns a function that calls the debug file logger with a preset stack trace for all invokations. Adds a trace function to the stack trace.
   *
   * @readonly
   * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
   * @example
   * const fileLogger = dbgLog.fileLogger(file)
   * const Log = fileLogger.stackLogger(trace1)
   *
   * // nested in a function
   * const log = fileLogger.stackLoggerInc(trace2)
   * log("variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   * // same as dbgLog(file, [trace1, trace2], "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   */
  stackLoggerInc: StackLoggerFactory
  /**
   * Helper for the file debug log helper, returns a function that calls the debug file logger with a preset stack trace for all invokations.
   *
   * @readonly
   * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
   * @example
   * const fileLogger = dbgLog.fileLogger(file)
   * const log = fileLogger.stackLogger(trace)
   * log.error("variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   * // same as dbgLog.error(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   */
  error: StackLogFn
  /**
   * Helper for the file debugging info log helper, returns a function that calls the debug file logger with a preset stack trace for all invokations.
   *
   * @readonly
   * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
   * @example
   * const fileLogger = dbgLog.fileLogger(file)
   * const log = fileLogger.stackLogger(trace)
   * log.error("variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   * // same as dbgLog.error(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   */
  info: StackLogFn
  /**
   * Helper for the file debugging warn log helper, returns a function that calls the debug file logger with a preset stack trace for all invokations.
   *
   * @readonly
   * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
   * @example
   * const fileLogger = dbgLog.fileLogger(file)
   * const log = fileLogger.stackLogger(trace)
   * log.error("variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   * // same as dbgLog.error(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   */
  warn: StackLogFn
  /**
   * Helper for the file debugging debug log helper, returns a function that calls the debug file logger with a preset stack trace for all invokations.
   *
   * @readonly
   * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
   * @example
   * const fileLogger = dbgLog.fileLogger(file)
   * const log = fileLogger.stackLogger(trace)
   * log.error("variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   * // same as dbgLog.error(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   */
  debug: StackLogFn
  /** @readonly */
  file: string
  /** @readonly */
  trace: string | string[]
}

dbgLog.fileLogger = dbgFileLogger
dbgLog.error = dbgErrorLog
dbgLog.info = dbgInfoLog
dbgLog.warn = dbgWarnLog
dbgLog.debug = dbgDebugLog

export { dbgLog }

/** From
 * @see https://stackoverflow.com/questions/66298024/can-repeated-tuples-be-defined-in-typescript
 * @see https://dev.to/captainyossarian/how-to-flatten-a-tuple-type-in-typescript-1okm
 */
// type RepeatedTuple<T extends LabelTuple> =
//   [...Omit<T, "0" | "1">, ...([T[0], T[1]] extends LabelTuple ? RepeatedTuple<T> : [])]
// type Reducer<
//   Arr extends ReadonlyArray<unknown>,
//   Result extends ReadonlyArray<unknown> = []
//   > =
//   // if Arr is empty -> return Result
//   (Arr extends readonly []
//     ? Result
//     // if Arr is not empty - destruct it
//     : (Arr extends readonly [infer Head, ...infer Tail]
//       // check if Head is an Array
//       ? (Head extends ReadonlyArray<any>
//         // if it is -> call Reducer with flat Head and Tail
//         ? Reducer<readonly [...Head, ...Tail], Result>
//         // otherwise call Reducer with Head without flattening
//         : Reducer<Tail, readonly [...Result, Head]>
//       ) : never
//     )
//   )
type Label = [label: string, variable: unknown]
type l = Label
type lx2 = [...l, ...l]
type lx3 = [...l, ...lx2]
type lx4 = [...l, ...lx3]
type lx5 = [...l, ...lx4]
type lx6 = [...l, ...lx5]
type lx7 = [...l, ...lx6]
type lx8 = [...l, ...lx7]
type lx9 = [...l, ...lx8]
type lx10 = [...l, ...lx9]
type lx11 = [...l, ...lx10]
type lx12 = [...l, ...lx11]
type lx13 = [...l, ...lx12]
type lx14 = [...l, ...lx13]
type lx15 = [...l, ...lx14]
type lx16 = [...l, ...lx15]
type lx17 = [...l, ...lx16]
type lx18 = [...l, ...lx17]
type lx19 = [...l, ...lx18]
type lx20 = [...l, ...lx19]
type lx21 = [...l, ...lx20]
type lx22 = [...l, ...lx21]
type lx23 = [...l, ...lx22]
type lx24 = [...l, ...lx23]
type lx25 = [...l, ...lx24]
type lx26 = [...l, ...lx25]
type lx27 = [...l, ...lx26]
type lx28 = [...l, ...lx27]
type lx29 = [...l, ...lx28]
type lx30 = [...l, ...lx29]
type lx31 = [...l, ...lx30]
type lx32 = [...l, ...lx31]
type lx33 = [...l, ...lx32]
type lx34 = [...l, ...lx33]
type lx35 = [...l, ...lx34]
type lx36 = [...l, ...lx35]
type lx37 = [...l, ...lx36]
type lx38 = [...l, ...lx37]
type lx39 = [...l, ...lx38]
type lx40 = [...l, ...lx39]
type lx41 = [...l, ...lx40]
type lx42 = [...l, ...lx41]
type lx43 = [...l, ...lx42]
type lx44 = [...l, ...lx43]
type lx45 = [...l, ...lx44]
type lx46 = [...l, ...lx45]
type lx47 = [...l, ...lx46]
type lx48 = [...l, ...lx47]
type lx49 = [...l, ...lx48]
type lx50 = [...l, ...lx49]

export type LogVariableLables =
  | Label
  | lx2
  | lx3
  | lx4
  | lx5
  | lx6
  | lx7
  | lx8
  | lx9
  | lx10
  | lx11
  | lx12
  | lx13
  | lx14
  | lx15
  | lx16
  | lx17
  | lx18
  | lx19
  | lx20
  | lx21
  | lx22
  | lx23
  | lx24
  | lx25
  | lx26
  | lx27
  | lx28
  | lx29
  | lx30
  | lx31
  | lx32
  | lx33
  | lx34
  | lx35
  | lx36
  | lx37
  | lx38
  | lx39
  | lx40
  | lx41
  | lx42
  | lx43
  | lx44
  | lx45
  | lx46
  | lx47
  | lx48
  | lx49
  | lx50
