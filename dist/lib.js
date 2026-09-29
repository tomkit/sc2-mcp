var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/server.ts
import { createHash as createHash2 } from "node:crypto";
import { readFile as readFile2, stat } from "node:fs/promises";
import { homedir as homedir2 } from "node:os";
import { basename, resolve } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key2 in object) {
      if (Object.prototype.hasOwnProperty.call(object, key2)) {
        keys.push(key2);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key2 = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key: key2,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key: key2, value } = pair;
      if (key2.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key2.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key2.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key2.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path, key2) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key2;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key2 in schema.shape) {
      const fieldSchema = schema.shape[key2];
      newShape[key2] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key2 in ctx.data) {
        if (!shapeKeys.includes(key2)) {
          extraKeys.push(key2);
        }
      }
    }
    const pairs = [];
    for (const key2 of shapeKeys) {
      const keyValidator = shape[key2];
      const value = ctx.data[key2];
      pairs.push({
        key: { status: "valid", value: key2 },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key2)),
        alwaysSet: key2 in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key2 of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key2 },
            value: { status: "valid", value: ctx.data[key2] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key2 of extraKeys) {
        const value = ctx.data[key2];
        pairs.push({
          key: { status: "valid", value: key2 },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key2)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key2 in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key2 = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key: key2,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key2, schema) {
    return this.augment({ [key2]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key2 of util.objectKeys(mask)) {
      if (mask[key2] && this.shape[key2]) {
        shape[key2] = this.shape[key2];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key2 of util.objectKeys(this.shape)) {
      if (!mask[key2]) {
        shape[key2] = this.shape[key2];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key2 of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key2];
      if (mask && !mask[key2]) {
        newShape[key2] = fieldSchema;
      } else {
        newShape[key2] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key2 of util.objectKeys(this.shape)) {
      if (mask && !mask[key2]) {
        newShape[key2] = this.shape[key2];
      } else {
        const fieldSchema = this.shape[key2];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key2] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key2) => bKeys.indexOf(key2) !== -1);
    const newObj = { ...a, ...b };
    for (const key2 of sharedKeys) {
      const sharedValue = mergeValues(a[key2], b[key2]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key2] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key2 in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key2, ctx.path, key2)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key2], ctx.path, key2)),
        alwaysSet: key2 in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key2, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key2, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key2 = await pair.key;
          const value = await pair.value;
          if (key2.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key2.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key2.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key2 = pair.key;
        const value = pair.value;
        if (key2.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key2.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key2.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = /* @__PURE__ */ Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// src/api.ts
import { AsyncLocalStorage } from "node:async_hooks";

// src/config.ts
import { homedir } from "node:os";
import { join } from "node:path";
var SERVER_NAME = "sc2-mcp";
var SERVER_VERSION = "0.10.0";
function apiBase() {
  const raw = process.env.SC2_API_BASE?.trim() || "https://www.starcraft2.ai";
  return raw.replace(/\/+$/, "");
}
var USER_AGENT = `${SERVER_NAME}/${SERVER_VERSION} (+https://github.com/tomkit/sc2-mcp)`;
function credentialsPath() {
  if (process.env.SC2_MCP_CREDENTIALS) return process.env.SC2_MCP_CREDENTIALS;
  const base = process.env.XDG_CONFIG_HOME || (process.platform === "win32" ? process.env.APPDATA || join(homedir(), "AppData", "Roaming") : join(homedir(), ".config"));
  return join(base, "sc2-mcp", "credentials.json");
}
var MAX_REPLAY_BYTES = 8 * 1024 * 1024;
var COACH_LANGUAGES = ["en", "ko", "zh", "fr", "es"];

// src/credentials.ts
import { chmod, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
async function readStore() {
  try {
    const parsed = JSON.parse(await readFile(credentialsPath(), "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
async function writeStore(store) {
  const path = credentialsPath();
  await mkdir(dirname(path), { recursive: true, mode: 448 });
  if (Object.keys(store).length === 0) {
    await rm(path, { force: true });
    return;
  }
  await writeFile(path, JSON.stringify(store, null, 2) + "\n", { mode: 384 });
  await chmod(path, 384).catch(() => {
  });
}
async function currentToken() {
  const env = process.env.SC2_API_TOKEN?.trim();
  if (env) return { token: env, source: "env" };
  const stored = (await readStore())[apiBase()];
  if (!stored?.access_token) return null;
  if (new Date(stored.expires_at).getTime() <= Date.now()) return null;
  return { token: stored.access_token, source: "stored" };
}
async function saveToken(accessToken, expiresInSeconds) {
  const store = await readStore();
  store[apiBase()] = {
    access_token: accessToken,
    expires_at: new Date(Date.now() + expiresInSeconds * 1e3).toISOString(),
    obtained_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  await writeStore(store);
}
async function forgetToken() {
  const store = await readStore();
  delete store[apiBase()];
  await writeStore(store);
}

// src/api.ts
var hostedStore = new AsyncLocalStorage();
function runHosted(ctx, fn) {
  return hostedStore.run(ctx, fn);
}
function hosted() {
  return hostedStore.getStore();
}
var ApiError = class extends Error {
  constructor(status, code, message, body = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.body = body;
  }
  status;
  code;
  body;
};
var NotSignedInError = class extends Error {
  constructor() {
    super("Not signed in to StarCraft2.ai. Call the `login` tool first (it opens a browser to sign in).");
  }
};
async function request(path, opts = {}) {
  const headers = { "User-Agent": USER_AGENT, Accept: "application/json", ...opts.headers };
  const ctx = hosted();
  if (ctx) return ctx.transport(path, { method: opts.method ?? "GET", body: opts.body, headers, signal: opts.signal });
  if (opts.auth !== false) {
    const tok = await currentToken();
    if (!tok) throw new NotSignedInError();
    headers.Authorization = `Bearer ${tok.token}`;
  }
  return fetch(`${apiBase()}${path}`, { method: opts.method ?? "GET", body: opts.body, headers, signal: opts.signal });
}
async function errorFrom(res) {
  const text2 = await res.text().catch(() => "");
  let body = {};
  try {
    body = JSON.parse(text2);
  } catch {
  }
  const message = typeof body.error === "string" && body.error || typeof body.error_description === "string" && body.error_description || `HTTP ${res.status}${text2 && text2.length < 200 ? `: ${text2}` : ""}`;
  const code = typeof body.code === "string" ? body.code : typeof body.error === "string" && /^[a-z_]+$/.test(body.error) ? body.error : null;
  if (res.status === 401) {
    const how = hosted() ? "Reconnect StarCraft2.ai from the app's connector settings." : "Call `login` to sign in again.";
    return new ApiError(401, code ?? "NOT_AUTHED", `Your StarCraft2.ai sign-in is missing, expired or revoked. ${how}`, body);
  }
  return new ApiError(res.status, code, message, body);
}
async function getJson(path, opts = {}) {
  const res = await request(path, opts);
  if (!res.ok) throw await errorFrom(res);
  return await res.json();
}
async function postJson(path, payload, opts = {}) {
  const res = await request(path, {
    ...opts,
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json", ...opts.headers }
  });
  if (!res.ok) throw await errorFrom(res);
  return await res.json();
}
function getReplay(key2) {
  return getJson(`/api/mcp/replay?id=${encodeURIComponent(key2)}`);
}

// src/format.ts
var CITATION_RE = /\{(?:([^|{}]+)\|)?([^{}]+)\}/g;
function stripMarkup(text2) {
  return (text2 ?? "").replace(CITATION_RE, (_m, label, target) => {
    if (label) return label;
    const player = /^p:(.+)$/.exec(target);
    return player ? player[1] : target;
  });
}
function formatReplayHeader(r) {
  const players = r.players.map((p) => p.race ? `${p.name} (${p.race})` : p.name).join(" vs ");
  const lines = [
    `Replay ${r.id}`,
    r.title ? `Title: ${r.title}` : null,
    `Map: ${r.map ?? "unknown"} \xB7 ${r.gameType ?? ""}${r.category ? ` \xB7 ${r.category}` : ""}${r.duration ? ` \xB7 ${r.duration}` : ""}`,
    `Players: ${players || "unknown"}`,
    r.teamResults?.length ? `Team results (in team order): ${r.teamResults.join(", ")}` : null,
    r.playedAt ? `Played: ${r.playedAt}` : null,
    `Web page: ${r.url}`,
    `AI Coach report: ${r.hasAnalysis ? `yes (coach version ${r.analysisVersion ?? "?"}, current ${r.currentCoachVersion})` : "not yet run"}`
  ];
  return lines.filter(Boolean).join("\n");
}
function formatAnalysis(a) {
  const out = [];
  out.push("## AI Coach report");
  if (a.version) out.push(`Coach version ${a.version}${a.language ? ` \xB7 language ${a.language}` : ""}`);
  out.push("", "### Overview", stripMarkup(a.overallAssessment));
  for (const team of a.teamAnalyses ?? []) {
    const who = team.playerNames.map((n, i) => team.races[i] ? `${n} (${team.races[i]})` : n).join(", ");
    out.push("", `### Team ${team.teamNumber}: ${who}`);
    if (team.strategySummary) out.push("", "**Strategy:** " + stripMarkup(team.strategySummary));
    if (team.keyStrengths?.length) {
      out.push("", "**Strengths**");
      for (const s of team.keyStrengths) out.push(`- ${stripMarkup(s)}`);
    }
    if (team.keyMistakes?.length) {
      out.push("", "**Mistakes**");
      for (const s of team.keyMistakes) out.push(`- ${stripMarkup(s)}`);
    }
    if (team.momentAnalyses?.length) {
      out.push("", "**Key moments**");
      for (const m of team.momentAnalyses) {
        out.push(`- ${m.gameTimeFormatted}${m.category ? ` [${m.category}]` : ""}: ${stripMarkup(m.situation)} \u2192 ${stripMarkup(m.advice)}`);
      }
    }
    if (team.improvementPriorities?.length) {
      out.push("", "**What to work on**");
      for (const p of [...team.improvementPriorities].sort((x, y) => x.priority - y.priority)) {
        out.push(`${p.priority}. ${stripMarkup(p.title)}: ${stripMarkup(p.description)}`);
      }
    }
  }
  return out.join("\n");
}

// src/login.ts
import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { createServer } from "node:http";
import { hostname } from "node:os";
var FLOW_TTL_MS = 10 * 60 * 1e3;
var active = null;
function b64url(buf) {
  return buf.toString("base64url");
}
function openInBrowser(url) {
  if (process.env.SC2_MCP_NO_BROWSER === "1") return false;
  const [cmd, args] = process.platform === "darwin" ? ["open", [url]] : process.platform === "win32" ? ["rundll32", ["url.dll,FileProtocolHandler", url]] : ["xdg-open", [url]];
  try {
    const child = spawn(cmd, args, { stdio: "ignore", detached: true });
    child.on("error", () => {
    });
    child.unref();
    return true;
  } catch {
    return false;
  }
}
var PAGE = (title, body) => `<!doctype html><meta charset="utf-8"><title>${title}</title><body style="font-family:system-ui,sans-serif;background:#0b1020;color:#e6eefc;display:grid;place-items:center;min-height:90vh"><div style="max-width:420px;text-align:center"><h1 style="font-size:20px">${title}</h1><p>${body}</p></div></body>`;
function currentLogin() {
  return active && !active.settled ? active : null;
}
async function startLogin(openBrowser = false) {
  const pending = currentLogin();
  if (pending) return pending;
  const verifier = b64url(randomBytes(32));
  const challenge = b64url(createHash("sha256").update(verifier).digest());
  const state = b64url(randomBytes(16));
  const base = apiBase();
  let server;
  let resolveDone;
  let rejectDone;
  const done = new Promise((res, rej) => {
    resolveDone = res;
    rejectDone = rej;
  });
  done.catch(() => {
  });
  server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    if (url.pathname !== "/callback") {
      res.writeHead(404).end();
      return;
    }
    const finish = (status, title, body) => {
      res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" }).end(PAGE(title, body));
    };
    if (url.searchParams.get("state") !== state) {
      finish(400, "Sign-in failed", "The response didn't match this sign-in attempt. Start again from your assistant.");
      return;
    }
    const err = url.searchParams.get("error");
    if (err) {
      finish(200, "Sign-in cancelled", "Nothing was connected. You can close this tab.");
      settle(new Error(err === "access_denied" ? "Sign-in was cancelled in the browser." : `Sign-in failed: ${err}`));
      return;
    }
    const code = url.searchParams.get("code");
    if (!code) {
      finish(400, "Sign-in failed", "No authorization code was returned.");
      return;
    }
    try {
      const tokenRes = await fetch(`${base}/api/mcp-auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json", "User-Agent": USER_AGENT },
        body: new URLSearchParams({ grant_type: "authorization_code", code, code_verifier: verifier, redirect_uri: redirectUri })
      });
      const body = await tokenRes.json().catch(() => ({}));
      if (!tokenRes.ok || !body.access_token) {
        throw new Error(body.error_description ?? `token endpoint returned ${tokenRes.status}`);
      }
      await saveToken(body.access_token, body.expires_in ?? 180 * 86400);
      finish(200, "Signed in to StarCraft2.ai", "You can close this tab and go back to your assistant.");
      settle(null);
    } catch (e) {
      finish(500, "Sign-in failed", "The code couldn't be exchanged for a token. Start again from your assistant.");
      settle(e instanceof Error ? e : new Error(String(e)));
    }
  });
  await new Promise((res, rej) => {
    server.once("error", rej);
    server.listen(0, "127.0.0.1", () => res());
  });
  const port = server.address().port;
  const redirectUri = `http://127.0.0.1:${port}/callback`;
  const timer = setTimeout(() => settle(new Error("Sign-in timed out after 10 minutes.")), FLOW_TTL_MS);
  timer.unref();
  const authorize = new URL(`${base}/auth/mcp`);
  authorize.search = new URLSearchParams({
    response_type: "code",
    client_name: `SC2 MCP on ${hostname().slice(0, 40)}`,
    redirect_uri: redirectUri,
    code_challenge: challenge,
    code_challenge_method: "S256",
    state
  }).toString();
  const flow = { url: authorize.toString(), device: null, done, settled: false, error: null };
  active = flow;
  function settle(error) {
    if (flow.settled) return;
    flow.settled = true;
    flow.error = error?.message ?? null;
    clearTimeout(timer);
    setTimeout(() => server.close(), 500).unref();
    if (error) rejectDone(error);
    else resolveDone();
  }
  flow.device = await startDeviceLogin(flow, settle);
  if (openBrowser) openInBrowser(flow.url);
  return flow;
}
async function startDeviceLogin(flow, settle) {
  const base = apiBase();
  const headers = { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json", "User-Agent": USER_AGENT };
  let start;
  try {
    const res = await fetch(`${base}/api/mcp-auth/device`, {
      method: "POST",
      headers,
      body: new URLSearchParams({ client_name: `SC2 MCP on ${hostname().slice(0, 40)}` })
    });
    if (!res.ok) return null;
    start = await res.json();
  } catch {
    return null;
  }
  if (!start.device_code || !start.user_code || !start.verification_uri) return null;
  if (new URL(start.verification_uri).origin !== new URL(base).origin) return null;
  const deviceCode = start.device_code;
  let interval = Math.max(1, start.interval ?? 5) * 1e3;
  const expiresAt = Date.now() + (start.expires_in ?? 600) * 1e3;
  void (async () => {
    while (!flow.settled && Date.now() < expiresAt) {
      await new Promise((r) => setTimeout(r, interval));
      if (flow.settled) return;
      let body = {};
      try {
        const res = await fetch(`${base}/api/mcp-auth/token`, {
          method: "POST",
          headers,
          body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:device_code", device_code: deviceCode })
        });
        body = await res.json().catch(() => ({}));
      } catch {
        continue;
      }
      if (body.access_token) {
        await saveToken(body.access_token, body.expires_in ?? 180 * 86400);
        settle(null);
        return;
      }
      switch (body.error) {
        case "authorization_pending":
          break;
        case "slow_down":
          interval += 5e3;
          break;
        case "access_denied":
          settle(new Error("Sign-in was cancelled on the other device."));
          return;
        case "expired_token":
          return;
        // the browser option may still finish; the flow's own timer ends it
        default:
          return;
      }
    }
  })();
  return { verificationUri: start.verification_uri, userCode: start.user_code, expiresAt };
}

// src/runs.ts
var runs = /* @__PURE__ */ new Map();
var TYPICAL_REASONING_CHARS = 85e3;
function key(replayId) {
  return `${hosted()?.principal ?? ""}:${replayId}`;
}
function getRun(replayId) {
  return runs.get(key(replayId));
}
function progressFraction(run) {
  if (run.settled) return 1;
  if (run.phase === "writing") return 0.93;
  return Math.min(0.88, run.reasoningChars / TYPICAL_REASONING_CHARS * 0.88);
}
function startRun(replayId, body) {
  const existing = runs.get(key(replayId));
  if (existing && !existing.settled) return existing;
  const run = {
    replayId,
    startedAt: Date.now(),
    reasoningChars: 0,
    phase: "thinking",
    done: Promise.resolve(),
    settled: false,
    analysis: null,
    error: null
  };
  run.done = (async () => {
    try {
      const res = await request("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ ...body, replayId }),
        headers: { "Content-Type": "application/json", Accept: "application/x-ndjson, application/json" }
      });
      const type = res.headers.get("content-type") ?? "";
      if (!type.includes("ndjson")) {
        if (!res.ok) throw await errorFrom(res);
        run.analysis = await res.json();
        return;
      }
      const final = await readFinalFrame(res, run);
      const status = typeof final.httpStatus === "number" ? final.httpStatus : 200;
      if (status >= 400) {
        throw new ApiError(status, typeof final.code === "string" ? final.code : null, String(final.error ?? "AI Coach run failed"), final);
      }
      run.analysis = final;
    } catch (e) {
      run.error = e instanceof Error ? e : new Error(String(e));
    } finally {
      run.settled = true;
    }
  })();
  runs.set(key(replayId), run);
  hosted()?.keepAlive(run.done);
  return run;
}
async function readFinalFrame(res, run) {
  const reader = res.body?.getReader();
  if (!reader) throw new Error("AI Coach response had no body");
  const decoder = new TextDecoder();
  let buf = "";
  let final = null;
  for (; ; ) {
    const { value, done } = await reader.read();
    if (value) buf += decoder.decode(value, { stream: true });
    let nl;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      let frame;
      try {
        frame = JSON.parse(line);
      } catch {
        continue;
      }
      if (frame.t === "final" && frame.body) final = frame.body;
      else if (frame.t === "hb") {
        if (typeof frame.reasoningChars === "number") run.reasoningChars = Math.max(run.reasoningChars, frame.reasoningChars);
        if (frame.phase) run.phase = frame.phase;
      }
    }
    if (done) break;
  }
  if (!final) throw new Error("The AI Coach stream ended before the report arrived. Check get_analysis in a minute \u2014 the run may still have finished on the server.");
  return final;
}
async function waitForRun(run, ms, onTick, signal) {
  const deadline = Date.now() + ms;
  while (!run.settled && Date.now() < deadline && !signal?.aborted) {
    onTick?.(run);
    await Promise.race([run.done, new Promise((r) => setTimeout(r, Math.min(5e3, Math.max(0, deadline - Date.now()))))]);
  }
  return run.settled;
}

// src/progress-note.ts
var runs2 = /* @__PURE__ */ new Map();
function noteKey(region, name, category) {
  return `${hosted()?.principal ?? ""}:${region}/${name.toLowerCase()}/${category}`;
}
function getNoteRun(key2) {
  return runs2.get(key2);
}
function getNote(region, name, category, signal) {
  const q = new URLSearchParams({ region, name, category });
  return (async () => {
    const res = await request(`/api/profile-coach?${q}`, { signal });
    if (!res.ok) throw await errorFrom(res);
    return await res.json();
  })();
}
function startNoteRun(args) {
  const key2 = noteKey(args.region, args.name, args.category);
  const existing = runs2.get(key2);
  if (existing && !existing.settled) return existing;
  const run = { key: key2, startedAt: Date.now(), done: Promise.resolve(), settled: false, note: null, error: null, delivered: false };
  run.done = (async () => {
    try {
      const res = await request("/api/profile-coach", {
        method: "POST",
        // A free rewrite says so: if newer games turned up since we looked,
        // the site refuses (WOULD_CHARGE) instead of charging unconfirmed.
        body: JSON.stringify({
          region: args.region,
          name: args.name,
          category: args.category,
          language: args.language,
          ...args.free ? { maxCharge: 0 } : {}
        }),
        headers: { "Content-Type": "application/json", Accept: "application/x-ndjson, application/json" }
      });
      if (!(res.headers.get("content-type") ?? "").includes("ndjson")) {
        if (!res.ok) throw await errorFrom(res);
        run.note = await res.json();
        return;
      }
      const final = await readFinal(res);
      const status = typeof final.httpStatus === "number" ? final.httpStatus : 200;
      if (status >= 400) {
        throw new ApiError(status, typeof final.code === "string" ? final.code : null, String(final.error ?? "The check-in note failed"), final);
      }
      run.note = final;
    } catch (e) {
      run.error = e instanceof Error ? e : new Error(String(e));
    } finally {
      run.settled = true;
    }
  })();
  runs2.set(key2, run);
  hosted()?.keepAlive(run.done);
  return run;
}
async function readFinal(res) {
  const reader = res.body?.getReader();
  if (!reader) throw new Error("The response had no body");
  const decoder = new TextDecoder();
  let buf = "";
  let final = null;
  for (; ; ) {
    const { value, done } = await reader.read();
    if (value) buf += decoder.decode(value, { stream: true });
    let nl;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      try {
        const frame = JSON.parse(line);
        if (frame.t === "final" && frame.body) final = frame.body;
      } catch {
      }
    }
    if (done) break;
  }
  if (!final) throw new Error("The check-in note stream ended without a result");
  return final;
}
async function waitForNote(run, ms, onTick, signal) {
  const deadline = Date.now() + ms;
  while (!run.settled) {
    const left = deadline - Date.now();
    if (left <= 0 || signal?.aborted) return run.settled;
    await Promise.race([run.done, new Promise((r) => setTimeout(r, Math.min(1e4, left)))]);
    if (!run.settled) onTick(Math.round((Date.now() - run.startedAt) / 1e3));
  }
  return true;
}
function formatNote(note, base, locale = "en") {
  const header = `Check-in note, ${note.category} games${note.generatedAt ? ` (written ${note.generatedAt.slice(0, 10)})` : ""}:`;
  const refs = note.summaryReplays.map((g, i) => `[${i + 1}] ${g.map}${g.playedAt ? `, ${g.playedAt.slice(0, 10)}` : ""} \u2014 ${base}/${locale}/replay/${g.slug}?tab=coach`).join("\n");
  return `${header}

${note.summary ?? ""}

Games cited (a citation like [2@5:15] is game 2 at 5:15):
${refs}`;
}

// src/server.ts
var COACH_PRICE = 1;
var CONFIRM_DESCRIPTION = "Set to true ONLY after the user has explicitly agreed, in this conversation, to spend 1 mineral on this. Never set it on your own initiative.";
async function confirmSpend(server, flag, question) {
  if (flag !== true) return "needs_flag";
  if (hosted()) return "ok";
  if (!server.server.getClientCapabilities()?.elicitation) return "ok";
  try {
    const res = await server.server.elicitInput({
      mode: "form",
      message: question,
      requestedSchema: {
        type: "object",
        properties: { confirm: { type: "boolean", title: "Spend the mineral", description: question } },
        required: ["confirm"]
      }
    });
    return res.action === "accept" && res.content?.confirm === true ? "ok" : "declined";
  } catch {
    return "declined";
  }
}
async function getMe() {
  const me = await getJson("/api/me");
  return typeof me.spendable === "number" ? { ...me, minerals: me.spendable } : me;
}
function confirm_spend_or(args) {
  return args.refresh ? args.confirm_spend : void 0;
}
function text(body, structured) {
  return { content: [{ type: "text", text: body }], ...structured ? { structuredContent: structured } : {} };
}
function fail(body) {
  return { content: [{ type: "text", text: body }], isError: true };
}
function billingUrl() {
  return `${apiBase()}/en/billing`;
}
function spendOffText() {
  return `Spending minerals is turned off for this connection, so nothing was charged. Only the user can turn it on, themselves, on their own phone or computer: send them this link \u2014 ${apiBase()}/auth/mcp \u2014 and tell them to sign in again when asked, then tap "Allow spending" next to this app. Do NOT open the link, sign in, or click anything for them (the site requires a fresh sign-in by the user for exactly this reason). Ask again once they say it's done.`;
}
function describeError(e) {
  if (e instanceof NotSignedInError) return fail(e.message);
  if (e instanceof ApiError) {
    if (e.status === 402 && e.code === "NO_BALANCE") {
      return fail(`${e.message}
The user can buy minerals at ${billingUrl()}.`);
    }
    if (e.status === 403 && e.code === "SPEND_NOT_ALLOWED") return fail(spendOffText());
    if (e.status === 429) return fail(`${e.message} (rate limited)`);
    return fail(`${e.message}${e.code ? ` [${e.code}]` : ""}`);
  }
  if (e instanceof Error && e.name === "AbortError") return fail("Cancelled.");
  return fail(`Request to StarCraft2.ai failed: ${e instanceof Error ? e.message : String(e)}`);
}
function guarded(fn) {
  return async (args, extra) => {
    try {
      return await fn(args, extra);
    } catch (e) {
      return describeError(e);
    }
  };
}
function progressReporter(extra) {
  const token = extra._meta?.progressToken;
  const started = Date.now();
  return (message) => {
    if (token === void 0) return;
    const progress = Math.max(1, Math.round((Date.now() - started) / 1e3));
    void extra.sendNotification({ method: "notifications/progress", params: { progressToken: token, progress, message } }).catch(() => {
    });
  };
}
function expandPath(p) {
  if (p === "~") return homedir2();
  if (p.startsWith("~/") || p.startsWith("~\\")) return resolve(homedir2(), p.slice(2));
  return resolve(p);
}
async function loadReplayBytes(args, signal) {
  if (args.path) {
    const full = expandPath(args.path);
    const info = await stat(full).catch(() => null);
    if (!info?.isFile()) throw new Error(`No replay file at ${full}`);
    if (info.size > MAX_REPLAY_BYTES) throw new Error(`${basename(full)} is larger than the 8 MB upload limit.`);
    return { bytes: await readFile2(full), filename: basename(full) };
  }
  const url = new URL(args.url);
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("url must be http(s).");
  const res = await fetch(url, { signal, headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Downloading the replay failed: HTTP ${res.status}`);
  const len = Number(res.headers.get("content-length") ?? 0);
  if (len > MAX_REPLAY_BYTES) throw new Error("That replay is larger than the 8 MB upload limit.");
  const chunks = [];
  let total = 0;
  const reader = res.body?.getReader();
  if (!reader) throw new Error("The download had no body.");
  for (; ; ) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > MAX_REPLAY_BYTES) {
      await reader.cancel().catch(() => {
      });
      throw new Error("That replay is larger than the 8 MB upload limit.");
    }
    chunks.push(value);
  }
  const bytes = Buffer.concat(chunks);
  let name = args.name || decodeURIComponent(url.pathname.split("/").pop() || "replay.SC2Replay");
  if (!/\.(sc2replay|rep)$/i.test(name)) name = bytes.subarray(0, 3).toString("latin1") === "MPQ" ? "replay.SC2Replay" : name;
  return { bytes, filename: name };
}
function multipart(field, filename, bytes) {
  const boundary = `----sc2mcp${createHash2("sha1").update(bytes).digest("hex").slice(0, 24)}`;
  const safeName = filename.replace(/["\r\n]/g, "_");
  const head = Buffer.from(
    `--${boundary}\r
Content-Disposition: form-data; name="${field}"; filename="${safeName}"\r
Content-Type: application/octet-stream\r
\r
`
  );
  const tail = Buffer.from(`\r
--${boundary}--\r
`);
  return { body: Buffer.concat([head, bytes, tail]), contentType: `multipart/form-data; boundary=${boundary}` };
}
var RELATION_LABEL = {
  played: "you played",
  coached: "you ran the coach",
  asked: "you asked about it",
  uploaded: "you uploaded"
};
function replayLine(r, me = true) {
  const players = r.players.map((p) => `${p.name}${p.race ? ` (${p.race})` : ""}`).join(" vs ");
  const when = (r.playedAt ?? "").slice(0, 10);
  const slot = r.player ?? r.you;
  const who = slot ? ` \xB7 ${me ? "you played" : "player"}: ${slot.name}${slot.race ? ` (${slot.race})` : ""}${slot.result ? `, ${slot.result}` : ""}` : me ? ` \xB7 NOT a game the user played (${r.relations.filter((x) => x !== "played").map((x) => RELATION_LABEL[x]).join(", ") || "linked"})` : "";
  const report = r.hasAnalysis ? `report ${r.analysisOutdated ? "(older coach version)" : "ready"}` : "no report";
  const built = r.units && Object.keys(r.units).length ? ` \xB7 built: ${Object.entries(r.units).map(([u, n]) => `${n} ${u}`).join(", ")}` : "";
  return `- ${r.id} \xB7 ${when ? `${when} \xB7 ` : ""}${r.map ?? "?"} \xB7 ${players}${r.duration ? ` \xB7 ${r.duration}` : ""}${who}${built} \xB7 ${report}${r.url ? ` \xB7 ${r.url}` : ""}`;
}
function runStatusText(run, r) {
  const secs = Math.round((Date.now() - run.startedAt) / 1e3);
  const pct = Math.round(progressFraction(run) * 100);
  return `The AI Coach is still analyzing ${r.map ?? "this replay"} (${secs}s elapsed, about ${pct}% \u2014 ${run.phase}). Runs usually take 3\u20137 minutes. Call get_analysis with replay "${r.id}" to wait for the report; no further minerals are needed.`;
}
function runResult(run, r) {
  if (run.error) {
    const e = run.error;
    if (e instanceof ApiError && e.code === "RUN_IN_PROGRESS") {
      return text(`An AI Coach run for this replay is already in progress on StarCraft2.ai (started elsewhere). Call get_analysis in a minute or two.`);
    }
    const refunded = e instanceof ApiError && e.status >= 500 ? " Failed runs are refunded automatically." : "";
    return { ...describeError(e), content: [{ type: "text", text: `AI Coach run failed: ${e.message}.${refunded}` }] };
  }
  if (!run.analysis) return fail("The AI Coach run ended without a report.");
  return text(`${formatReplayHeader({ ...r, hasAnalysis: true, analysisVersion: run.analysis.version ?? r.analysisVersion })}

${formatAnalysis(run.analysis)}`, {
    replayId: r.id,
    url: r.url,
    analysis: run.analysis
  });
}
async function getHistory(replayId) {
  const history = await getJson(`/api/coach-chat/history?replayId=${replayId}`);
  if (history.access?.status !== "ok") throw new NotSignedInError();
  return history;
}
async function readChatStream(res) {
  const reader = res.body?.getReader();
  if (!reader) throw new Error("Chat response had no body");
  const decoder = new TextDecoder();
  let buf = "";
  let answer = "";
  let streamError = null;
  for (; ; ) {
    const { value, done } = await reader.read();
    if (value) buf += decoder.decode(value, { stream: true });
    let nl;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const evt = JSON.parse(data);
        if (evt.type === "text-delta" && typeof evt.delta === "string") answer += evt.delta;
        else if (evt.type === "error") streamError = evt.errorText ?? "chat stream error";
      } catch {
      }
    }
    if (done) break;
  }
  if (!answer.trim() && streamError) throw new Error(streamError);
  return answer.trim();
}
function createServer2(opts = {}) {
  const isHosted = opts.hosted === true;
  const WAIT_DEFAULT = isHosted ? 40 : 50;
  const waitMs = (seconds) => Math.min(seconds ?? WAIT_DEFAULT, isHosted ? 45 : 600) * 1e3;
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION, title: "StarCraft II AI Coach (StarCraft2.ai)" },
    {
      instructions: "Tools for StarCraft2.ai, a StarCraft II replay analyzer with an AI Coach. " + (isHosted ? "The user is signed in through this app's StarCraft2.ai connector; if a tool says the sign-in expired, ask them to reconnect it in the app's connector settings. " : "Every tool except `login` and `upload_replay` needs the user to be signed in; if a tool says they aren't, call `login`. ") + "Minerals are the site's paid credits: running the AI Coach on a replay costs 1 mineral, and follow-up questions about a replay are free for the first 3 then 1 mineral per 20 more. Tools that spend minerals refuse unless `confirm_spend` is true \u2014 ask the user first and only set it after they agree. When the user mentions one of their games ('my last game'), call `list_my_replays` first; to narrow by date, map, opponent, race or result ('my losses on Rainfall in June', 'games I played with Sirry where I went mass Liberators') use `search_replays` \u2014 it filters by teammates and by units built in one call, so never open games one by one to check a build. Games they played, coached or uploaded before are already there, and an existing report is free to re-read. When the user asks whether they're improving, what they keep doing wrong across games, or what to work on, use `coach_my_progress` (the saved check-in note is free; a new one costs 1 mineral). Knowledge search, uploads and reading existing reports are free. For general StarCraft II questions, use `search_sc2_knowledge` and answer from the passages it returns, citing their URLs."
    }
  );
  if (!isHosted) server.registerTool(
    "login",
    {
      title: "Sign in to StarCraft2.ai",
      description: "Sign in to the user's StarCraft2.ai account. Required before any other tool. Returns a verification address and a short code: send both to the user exactly as given, as two separate pieces, so they can sign in and approve on their own phone or computer. Assume the user is NOT at this computer unless you know they are; never open the page or sign in for them. Set open_browser only when the user is sitting at this machine (e.g. a terminal coding session) and wants a browser window here. Call again after they've approved to continue.",
      inputSchema: {
        wait_seconds: external_exports.number().int().min(0).max(300).optional().describe("How long to wait for the user to approve (default 45)."),
        open_browser: external_exports.boolean().optional().describe("Also open the approval page in this computer's browser. Only when the user is at this computer.")
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true }
    },
    guarded(async ({ wait_seconds, open_browser }, extra) => {
      const existing = await currentToken();
      if (existing) {
        try {
          const me2 = await getMe();
          return text(`Already signed in to StarCraft2.ai${existing.source === "env" ? " (token from SC2_API_TOKEN)" : ""}. Mineral balance: ${me2.minerals}.`);
        } catch (e) {
          if (!(e instanceof ApiError && e.status === 401)) throw e;
          if (existing.source === "env") return fail("SC2_API_TOKEN is set but the site rejected it. Remove it or replace it with a valid token.");
          await forgetToken();
        }
      }
      const flow = await startLogin(open_browser === true);
      const report = progressReporter(extra);
      const deadline = Date.now() + (wait_seconds ?? 45) * 1e3;
      while (!flow.settled && Date.now() < deadline && !extra.signal.aborted) {
        report("Waiting for approval");
        await Promise.race([flow.done.catch(() => {
        }), new Promise((r) => setTimeout(r, 3e3))]);
      }
      if (!flow.settled) {
        const onThisComputer = open_browser ? `

If the user is at this computer, a browser window opened here too; if it didn't, the page is:
${flow.url}` : "";
        const lead = flow.device ? `Send the user these two things so they can connect their StarCraft2.ai account from their own phone or computer:
1. Go to ${flow.device.verificationUri}
2. Enter the code ${flow.device.userCode}
(They sign in there themselves; the code works for 10 minutes. They should only enter it because they asked to connect.)` : `Ask the user to open this page on this computer and approve: ${flow.url}`;
        return text(`${lead}${onThisComputer}

Once they say they've approved, call login again (or any other tool) to continue.`, {
          status: "pending",
          url: flow.url,
          verification_uri: flow.device?.verificationUri ?? null,
          user_code: flow.device?.userCode ?? null
        });
      }
      if (flow.error) return fail(flow.error);
      const me = await getMe();
      return text(`Signed in to StarCraft2.ai. Mineral balance: ${me.minerals}.`, { status: "signed_in", minerals: me.minerals });
    })
  );
  if (!isHosted) server.registerTool(
    "logout",
    {
      title: "Sign out",
      description: "Sign out of StarCraft2.ai on this computer: revokes this device's token and deletes it locally.",
      inputSchema: {},
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: true }
    },
    guarded(async () => {
      const tok = await currentToken();
      if (!tok) return text("Not signed in.");
      const revoked = await fetch(`${apiBase()}/api/mcp-auth/revoke`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": USER_AGENT },
        body: new URLSearchParams({ token: tok.token })
      }).then((r) => r.ok, () => false);
      const note = revoked ? "" : ` The site couldn't be reached to revoke it; disconnect it at ${apiBase()}/auth/mcp.`;
      if (tok.source === "env") return text(`${revoked ? "Revoked the token from SC2_API_TOKEN. " : ""}Remove SC2_API_TOKEN from your MCP config.${note}`);
      await forgetToken();
      return text(`Signed out. The token was ${revoked ? "revoked and " : ""}deleted from this computer.${note}`);
    })
  );
  server.registerTool(
    "get_account",
    {
      title: "Account and mineral balance",
      description: "The signed-in user's mineral balance (StarCraft2.ai credits), claimed SC2 profile, and where to buy more minerals.",
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: true }
    },
    guarded(async () => {
      const me = await getMe();
      const profile = me.profileName ? `${me.profileName} (${me.profileRegion ?? "?"})` : "none claimed";
      return text(
        `Minerals: ${me.minerals}
SC2 profile: ${profile}
` + (me.tokenCanSpend === false ? `Spending from this connection: OFF (turn it on at ${apiBase()}/auth/mcp \u2192 Connected apps)
` : me.tokenCanSpend === true ? "Spending from this connection: allowed\n" : "") + `Prices: AI Coach report 1 mineral; follow-up questions 3 free per replay, then 1 mineral per 20.
Buy minerals: ${billingUrl()}`,
        {
          minerals: me.minerals,
          canSpend: me.tokenCanSpend ?? null,
          profileName: me.profileName,
          profileRegion: me.profileRegion,
          billingUrl: billingUrl()
        }
      );
    })
  );
  server.registerTool(
    "search_sc2_knowledge",
    {
      title: "Search StarCraft II knowledge",
      description: "Search StarCraft2.ai's StarCraft II knowledge base \u2014 Liquipedia unit/building/ability data, current patch notes, strategy and matchup articles, and pro-game insights \u2014 the same sources the AI Coach cites. Use it to answer general SC2 questions (unit stats, counters, build orders, patch changes, matchup advice); answer from the passages and cite their URLs. Free.",
      inputSchema: {
        query: external_exports.string().min(2).max(300).describe("What to look up, e.g. 'Disruptor Purification Nova damage and cooldown' or 'PvZ vs ling bane all-in defense'."),
        limit: external_exports.number().int().min(1).max(10).optional().describe("Number of passages (default 5).")
      },
      annotations: { readOnlyHint: true, openWorldHint: true }
    },
    guarded(async ({ query, limit }) => {
      const { results } = await postJson(
        "/api/kb-search",
        { query, limit }
      );
      if (results.length === 0) return text("No passages found. Try a broader or rephrased query.", { results: [] });
      const body = results.map((r, i) => `[${i + 1}] ${r.title}${r.section ? ` \u2014 ${r.section}` : ""}
${r.url}
${r.content}`).join("\n\n");
      return text(body, { results });
    })
  );
  server.registerTool(
    "upload_replay",
    {
      title: "Upload a replay",
      description: isHosted ? "Upload a StarCraft II replay (.SC2Replay) \u2014 or a Brood War .rep \u2014 to StarCraft2.ai: a file the user attached to the chat (`file`), or a download link (`url`). Returns the replay id and page, and whether an AI Coach report already exists. Free. If the user can't attach files here, suggest the free auto-uploader (starcraft2.ai/en/uploader), which uploads every game they play." : "Upload a StarCraft II replay (.SC2Replay) \u2014 or a Brood War .rep \u2014 to StarCraft2.ai from a local file path or a download URL. Works without signing in (the upload is then anonymous); when signed in it is attributed to the user. Returns the replay id and page, and when signed in whether an AI Coach report already exists. Free. On Windows the default replay folder is Documents\\StarCraft II\\Accounts\\\u2026\\Replays\\Multiplayer; on macOS ~/Library/Application Support/Blizzard/StarCraft II/Accounts/\u2026/Replays/Multiplayer.",
      inputSchema: isHosted ? {
        // ChatGPT fills a parameter listed in openai/fileParams with the
        // attached file: a short-lived download_url plus ids.
        file: external_exports.object({
          download_url: external_exports.string().url(),
          file_id: external_exports.string(),
          mime_type: external_exports.string().optional(),
          file_name: external_exports.string().optional()
        }).strict().optional().describe("The replay file the user attached to the chat."),
        url: external_exports.string().url().optional().describe("http(s) URL the replay file can be downloaded from.")
      } : {
        path: external_exports.string().min(1).optional().describe("Local path to the replay file (~ is expanded)."),
        url: external_exports.string().url().optional().describe("http(s) URL the replay file can be downloaded from.")
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
      ...isHosted ? { _meta: { "openai/fileParams": ["file"] } } : {}
    },
    guarded(async (args, extra) => {
      const source = args.file ? { url: args.file.download_url, name: args.file.file_name } : args.path && !isHosted ? { path: args.path } : args.url ? { url: args.url } : null;
      const given = [args.file, args.path, args.url].filter(Boolean).length;
      if (!source || given !== 1) return fail(isHosted ? "Give exactly one of `file` or `url`." : "Give exactly one of `path` or `url`.");
      const signedIn = isHosted || !!await currentToken();
      const { bytes, filename } = await loadReplayBytes(source, extra.signal);
      const isBw = filename.toLowerCase().endsWith(".rep");
      if (!isBw && !(bytes.length >= 64 && bytes.subarray(0, 3).toString("latin1") === "MPQ")) {
        return fail(`${filename} isn't a StarCraft II replay (expected an .SC2Replay file).`);
      }
      const form = multipart("replay", filename, bytes);
      const res = await request(isBw ? "/api/parse-bw" : "/api/parse?summary=1", {
        method: "POST",
        body: new Uint8Array(form.body),
        headers: { "Content-Type": form.contentType, "Content-Length": String(form.body.length) },
        signal: extra.signal,
        auth: signedIn
      });
      if (!res.ok) throw await errorFrom(res);
      const parsed = await res.json();
      if (!parsed.id) return fail("The site parsed the replay but didn't return an id.");
      if (!signedIn) {
        const who = (parsed.players ?? []).map((p) => `${p.name}${p.race ? ` (${p.race})` : ""}${p.result ? `, ${p.result}` : ""}`).join(" vs ");
        return text(
          `Uploaded ${filename}${parsed.duplicate ? " (it was already on the site)" : ""}.
Replay ${parsed.id}${parsed.map ? ` \xB7 ${parsed.map}` : ""}${who ? ` \xB7 ${who}` : ""}
Web page: ${parsed.url ?? ""}

Uploaded anonymously: it isn't linked to an account. To link it, and to use the AI Coach, call login and upload again.`,
          { replayId: parsed.id, url: parsed.url ?? null, anonymous: true }
        );
      }
      const fileHash = createHash2("sha256").update(bytes).digest("hex");
      await postJson("/api/replays/claim", { id: parsed.id, fileHash }).catch(() => null);
      const summary = await getReplay(parsed.id);
      const next = summary.hasAnalysis ? "An AI Coach report already exists \u2014 get_analysis returns it for free." : "No AI Coach report yet. analyze_replay runs one for 1 mineral (ask the user first).";
      return text(`Uploaded ${filename}.
${formatReplayHeader(summary)}

${next}`, {
        replayId: summary.id,
        url: summary.url,
        hasAnalysis: summary.hasAnalysis
      });
    })
  );
  async function runSearch(params, emptyHint) {
    const qs = new URLSearchParams({ search: "1" });
    for (const [k, v] of Object.entries(params)) {
      if (v === void 0 || v === "" || v === false || Array.isArray(v) && v.length === 0) continue;
      qs.set(k, v === true ? "1" : Array.isArray(v) ? v.join(",") : String(v));
    }
    const { replays, profile, player, scope, hints } = await getJson(`/api/mcp/replay?${qs}`);
    const me = !params.player || String(params.player).toLowerCase() === "me";
    const claimHint = me && !profile ? `

No SC2 profile is linked to this account, so games the user played but never coached, asked about or uploaded aren't included. They can link it under "Set your profile" in the account menu at ${apiBase()}.` : "";
    const filters = Object.entries(params).filter(([k, v]) => v !== void 0 && v !== "" && v !== false && !(Array.isArray(v) && v.length === 0) && k !== "limit" && k !== "player" && k !== "include").map(([k, v]) => v === true ? k : `${k}=${Array.isArray(v) ? v.join(", ") : v}`).join(", ");
    const who = me ? scope === "all" ? `games ${profile ? `${profile.name} (${profile.region.toUpperCase()}) played, ` : ""}coached, asked about or uploaded` : scope === "linked" ? "games this account coached, asked about or uploaded (no SC2 profile is linked, so games the user played can't be identified)" : `games ${profile ? `${profile.name} (${profile.region.toUpperCase()})` : "the user"} played` : `games ${player?.name ?? params.player} played`;
    if (replays.length === 0) {
      const nameHint = hints?.unknown.length ? "\n\n" + hints.unknown.map((u) => `No player named "${u.name}" has games on StarCraft2.ai${u.similar.length ? ` (names containing it: ${u.similar.join(", ")})` : ""}.`).join("\n") + (hints.frequentTeammates.length ? `
${player?.name ?? profile?.name ?? "This player"} plays most often with: ${hints.frequentTeammates.map((t) => `${t.name} (${t.games} games)`).join(", ")}. In-game names can differ from nicknames: ask the user which of these they mean, then search again with that exact name.` : "") : "";
      return text(`No ${who}${filters ? ` matching ${filters}` : ""}. ${emptyHint}${nameHint}${claimHint}`, { replays: [], profile, player, scope, ...hints ? { hints } : {} });
    }
    const head = `${replays.length} of the ${who}${filters ? `, matching ${filters}` : ""}, newest first:`;
    return text(`${head}
${replays.map((r) => replayLine(r, me)).join("\n")}${claimHint}`, {
      replays,
      profile,
      player,
      scope
    });
  }
  server.registerTool(
    "list_my_replays",
    {
      title: "List my games",
      description: "The games the signed-in user PLAYED, newest first (matched by their linked SC2 profile), with their race and result and whether an AI Coach report exists. CALL THIS FIRST for 'my last game' / 'the game I last played'. filter 'coached' instead lists games with a report that the user played OR ran the coach on / asked about \u2014 those can be other people's games, and each line says so. An existing report is free to re-read with get_analysis. To narrow by date, map, opponent, race or result, use search_replays. Free.",
      inputSchema: {
        limit: external_exports.number().int().min(1).max(50).optional().describe("How many (default 10)."),
        filter: external_exports.enum(["all", "coached", "played"]).optional().describe("Default: games the user played. 'coached': games with an AI Coach report the user played or looked at.")
      },
      annotations: { readOnlyHint: true, openWorldHint: true }
    },
    guarded(
      async ({ limit, filter }) => runSearch(
        { limit: limit ?? 10, has_report: filter === "coached", include: filter === "coached" ? "all" : void 0 },
        filter === "coached" ? "None of them has an AI Coach report yet." : "Upload a replay with upload_replay."
      )
    )
  );
  server.registerTool(
    "search_replays",
    {
      title: "Search games",
      description: "Search StarCraft II games on StarCraft2.ai. By default searches the games the SIGNED-IN USER PLAYED (matched by their linked SC2 profile) \u2014 use it for requests like 'my losses on Rainfall last month', 'my PvZ games since June', 'games against <name>', 'my coached games from May'. Set player to someone else's in-game name to search their public games instead. Every filter is optional and applied before the limit, so results cover all matching games, newest first. teammates finds games played together ('games tom, Sirry and Dan played' \u2192 teammates: ['Sirry', 'Dan']); units finds games where the searched player built certain units ('where I went mass Liberators and Vikings' \u2192 units: ['Liberator', 'Viking'], min_units: 8) and shows how many of each they built. Use these filters to answer questions about builds and compositions \u2014 do NOT open games one by one with get_analysis to check what someone built. If a name matches nobody, the result lists who the player actually plays with; ask the user which one they mean. Each result carries its link. Returns replay ids for get_analysis / ask_about_replay. Free.",
      inputSchema: {
        player: external_exports.string().max(80).optional().describe("'me' (default) for the signed-in user, or another player's exact in-game name (case-insensitive)."),
        region: external_exports.enum(["na", "eu", "kr", "cn"]).optional().describe("With player: only that player's games on this server."),
        from: external_exports.string().optional().describe("Played on or after: YYYY-MM or YYYY-MM-DD. Convert 'last month' etc. to dates yourself."),
        to: external_exports.string().optional().describe("Played on or before (inclusive): YYYY-MM or YYYY-MM-DD."),
        map: external_exports.string().max(80).optional().describe("Map name or part of it, e.g. 'Rainfall'."),
        opponent: external_exports.string().max(80).optional().describe("Part of an opponent's name (players on the other team)."),
        race: external_exports.enum(["Terran", "Protoss", "Zerg"]).optional().describe("The searched player's race."),
        opponent_race: external_exports.enum(["Terran", "Protoss", "Zerg"]).optional().describe("An opponent's race, e.g. Zerg for 'vs Zerg' / 'PvZ'."),
        result: external_exports.enum(["win", "loss"]).optional().describe("The searched player's result."),
        game_type: external_exports.string().regex(/^\d+v\d+$/).optional().describe("e.g. '1v1', '2v2'."),
        has_report: external_exports.boolean().optional().describe("Only games that already have an AI Coach report (free to re-read)."),
        teammates: external_exports.array(external_exports.string().min(1).max(40)).max(5).optional().describe("In-game names that must be on the searched player's team (exact, any case)."),
        units: external_exports.array(external_exports.string().min(1).max(40)).max(5).optional().describe("Units (or buildings) the searched player built, e.g. ['Liberator', 'Viking']; plurals and common nicknames (libs, BCs, lings) work."),
        min_units: external_exports.number().int().min(1).max(500).optional().describe("With units: at least this many of EACH (default 1). 'Mass' is roughly 8+ for air units, 15+ for cheap ground units."),
        include: external_exports.enum(["played", "all"]).optional().describe("'played' (default): games the user played. 'all': also games they only ran the coach on, asked about or uploaded \u2014 often other people's games."),
        limit: external_exports.number().int().min(1).max(50).optional().describe("How many (default 10).")
      },
      annotations: { readOnlyHint: true, openWorldHint: true }
    },
    guarded(
      async (args) => runSearch({ ...args, limit: args.limit ?? 10 }, "Try fewer filters or a wider date range.")
    )
  );
  const replayArg = external_exports.string().min(1).describe("Replay id, short id, slug, or a StarCraft2.ai replay URL.");
  server.registerTool(
    "get_analysis",
    {
      title: "Get a replay's AI Coach report",
      description: "Read a replay's details and its AI Coach report if one exists. If this session started a coach run that is still going, waits for it (up to wait_seconds) and returns the report when it lands. Free \u2014 never spends minerals.",
      inputSchema: {
        replay: replayArg,
        wait_seconds: external_exports.number().int().min(0).max(600).optional().describe(`Max seconds to wait for an in-progress run (default ${WAIT_DEFAULT}).`)
      },
      annotations: { readOnlyHint: true, openWorldHint: true }
    },
    guarded(async ({ replay, wait_seconds }, extra) => {
      const summary = await getReplay(replay);
      const run = getRun(summary.id);
      if (run && !run.analysis && !run.error) {
        const report = progressReporter(extra);
        const settled = await waitForRun(run, waitMs(wait_seconds), (r) => report(`AI Coach ${r.phase}, ~${Math.round(progressFraction(r) * 100)}%`), extra.signal);
        if (!settled) return text(runStatusText(run, summary), { status: "running", replayId: summary.id });
        return runResult(run, summary);
      }
      if (run?.analysis || run?.error) return runResult(run, summary);
      if (!summary.analysis && summary.coachInProgress) {
        return text(
          `The AI Coach is still analyzing ${summary.map ?? "this replay"}. Runs take 3\u20137 minutes; call get_analysis again in a minute. No further minerals are needed.`,
          { status: "running", replayId: summary.id }
        );
      }
      if (!summary.analysis) {
        return text(`${formatReplayHeader(summary)}

No AI Coach report yet. analyze_replay runs one for ${COACH_PRICE} mineral (ask the user first).`, {
          replayId: summary.id,
          hasAnalysis: false
        });
      }
      const outdated = summary.analysisOutdated === true;
      return text(
        `${formatReplayHeader(summary)}

${formatAnalysis(summary.analysis)}` + (outdated ? `

(Made with an older coach version. analyze_replay with upgrade: true re-runs it on the current version for free.)` : ""),
        { replayId: summary.id, url: summary.url, analysis: summary.analysis }
      );
    })
  );
  server.registerTool(
    "analyze_replay",
    {
      title: "Run the AI Coach on a replay",
      description: `Run StarCraft2.ai's AI Coach on an uploaded replay. COSTS ${COACH_PRICE} MINERAL (the site's paid credits) unless the replay already has a report, which is returned free. Refuses to spend unless confirm_spend is true \u2014 tell the user the price and their balance and get a yes first. A run takes 3\u20137 minutes: this waits up to wait_seconds, then returns and the run continues; call get_analysis to collect it. Failed runs are refunded by the site.`,
      inputSchema: {
        replay: replayArg,
        confirm_spend: external_exports.boolean().optional().describe(CONFIRM_DESCRIPTION),
        language: external_exports.enum(COACH_LANGUAGES).optional().describe("Report language (default en)."),
        upgrade: external_exports.boolean().optional().describe("Re-run an existing report that was made with an older coach version. Free; only works when the report is outdated."),
        wait_seconds: external_exports.number().int().min(0).max(600).optional().describe(`Max seconds to wait before returning (default ${WAIT_DEFAULT}).`)
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true }
    },
    guarded(
      async ({ replay, confirm_spend, language, upgrade, wait_seconds }, extra) => {
        const summary = await getReplay(replay);
        let run = getRun(summary.id);
        if (!run || run.settled) {
          const outdated = summary.analysisOutdated === true;
          if (summary.analysis && !(upgrade && outdated)) {
            return text(
              `This replay already has an AI Coach report \u2014 no minerals spent.${language && summary.analysisLanguage && language !== summary.analysisLanguage ? ` (It is in ${summary.analysisLanguage}; a report is made once per replay.)` : ""}

${formatReplayHeader(summary)}

${formatAnalysis(summary.analysis)}` + (outdated ? `

(Older coach version; pass upgrade: true to re-run it on the current version for free.)` : ""),
              { replayId: summary.id, spent: 0, analysis: summary.analysis }
            );
          }
          if (!summary.analysis && summary.coachInProgress) {
            return text(
              `The AI Coach is already analyzing ${summary.map ?? "this replay"} (started earlier). Call get_analysis in a minute to collect the report; nothing more is charged.`,
              { status: "running", replayId: summary.id }
            );
          }
          if (upgrade && summary.analysis && outdated) {
            run = startRun(summary.id, { language: language ?? summary.analysisLanguage ?? "en", regenerate: true });
          } else {
            const me = await getMe();
            if (me.tokenCanSpend === false) return fail(spendOffText());
            if (me.minerals < COACH_PRICE) {
              return fail(`Running the AI Coach costs ${COACH_PRICE} mineral and the balance is ${me.minerals}. The user can buy minerals at ${billingUrl()}.`);
            }
            const gate = await confirmSpend(
              server,
              confirm_spend,
              `Run the AI Coach on ${summary.map ?? "this replay"} for ${COACH_PRICE} mineral? Your balance is ${me.minerals}.`
            );
            if (gate === "declined") return text("Not started: the user declined the spend.", { status: "declined" });
            if (gate === "needs_flag") {
              return text(
                `Not started. Running the AI Coach on this replay costs ${COACH_PRICE} mineral; the balance is ${me.minerals}. Ask the user to confirm, then call analyze_replay again with confirm_spend: true.`,
                { status: "confirmation_required", price: COACH_PRICE, minerals: me.minerals }
              );
            }
            run = startRun(summary.id, { language: language ?? "en" });
          }
        }
        const report = progressReporter(extra);
        const settled = await waitForRun(run, waitMs(wait_seconds), (r) => report(`AI Coach ${r.phase}, ~${Math.round(progressFraction(r) * 100)}%`), extra.signal);
        if (!settled) return text(runStatusText(run, summary), { status: "running", replayId: summary.id });
        return runResult(run, summary);
      }
    )
  );
  server.registerTool(
    "ask_about_replay",
    {
      title: "Ask the coach about a replay",
      description: "Ask StarCraft2.ai's coach a follow-up question about a replay that has an AI Coach report (it can check the replay's numbers and the knowledge base). The first 3 questions per replay are free; after that the site needs 1 mineral per 20 more, bought with unlock_more_questions (ask the user first). Shows the remaining free/unlocked questions.",
      inputSchema: {
        replay: replayArg,
        question: external_exports.string().min(1).max(2e3).describe("The user's question, in their words.")
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true }
    },
    guarded(async ({ replay, question }, extra) => {
      const summary = await getReplay(replay);
      if (!summary.hasAnalysis) {
        return fail(`This replay has no AI Coach report yet, and follow-up questions need one. analyze_replay runs it for ${COACH_PRICE} mineral.`);
      }
      const history = await getHistory(summary.id);
      if (history.quotaUsed >= history.quotaTotal) {
        return text(
          `No questions left on this replay (${history.quotaUsed} of ${history.quotaTotal} used). 1 mineral unlocks 20 more \u2014 ask the user, then call unlock_more_questions with confirm_spend: true.`,
          { status: "quota_exhausted", quotaUsed: history.quotaUsed, quotaTotal: history.quotaTotal }
        );
      }
      const report = progressReporter(extra);
      report("Asking the coach");
      const messages = [
        ...history.messages.map((m) => ({ id: m.id, role: m.role, parts: m.parts })),
        { id: `mcp-${Date.now()}`, role: "user", parts: [{ type: "text", text: question }] }
      ];
      const res = await request("/api/coach-chat", {
        method: "POST",
        body: JSON.stringify({ replayId: summary.id, messages }),
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        signal: extra.signal
      });
      if (!res.ok) throw await errorFrom(res);
      const answer = await readChatStream(res);
      const remaining = Math.max(0, history.quotaTotal - history.quotaUsed - 1);
      return text(`${answer || "(the coach returned an empty answer)"}

\u2014 ${remaining} question${remaining === 1 ? "" : "s"} left on this replay.`, {
        answer,
        questionsRemaining: remaining
      });
    })
  );
  server.registerTool(
    "unlock_more_questions",
    {
      title: "Buy more follow-up questions",
      description: "Spend 1 MINERAL to unlock 20 more follow-up questions on one replay (same price as the website). Refuses unless confirm_spend is true \u2014 only after the user agreed to spend the mineral.",
      inputSchema: { replay: replayArg, confirm_spend: external_exports.boolean().optional().describe(CONFIRM_DESCRIPTION) },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true }
    },
    guarded(async ({ replay, confirm_spend }) => {
      const summary = await getReplay(replay);
      if (!summary.hasAnalysis) return fail("This replay has no AI Coach report, so there's nothing to ask about yet.");
      const history = await getHistory(summary.id);
      const left = history.quotaTotal - history.quotaUsed;
      if (left > 0) {
        return text(`Nothing bought: ${left} question${left === 1 ? "" : "s"} still left on this replay. Unlock only once they're used up.`, {
          status: "not_needed",
          questionsRemaining: left
        });
      }
      const me = await getMe();
      if (me.tokenCanSpend === false) return fail(spendOffText());
      if (me.minerals < 1) return fail(`The balance is 0 minerals. The user can buy minerals at ${billingUrl()}.`);
      const gate = await confirmSpend(server, confirm_spend, `Spend 1 mineral for 20 more questions on ${summary.map ?? "this replay"}? Your balance is ${me.minerals}.`);
      if (gate === "declined") return text("Not purchased: the user declined the spend.", { status: "declined" });
      if (gate === "needs_flag") {
        return text(
          `Not purchased. 20 more questions on this replay cost 1 mineral; the balance is ${me.minerals}. Ask the user, then call again with confirm_spend: true.`,
          { status: "confirmation_required", price: 1, minerals: me.minerals }
        );
      }
      const out = await postJson("/api/coach-chat/unlock", { replayId: summary.id });
      return text(`Unlocked ${out.unlocked} more questions on this replay. Mineral balance: ${out.newBalance}.`, {
        unlocked: out.unlocked,
        minerals: out.newBalance
      });
    })
  );
  server.registerTool(
    "coach_my_progress",
    {
      title: "Check-in note: am I improving?",
      description: `The AI Coach's check-in note across a player's recent coached games in one category (ranked ladder or unranked): whether they're learning from their mistakes, compared with the previous note, what's working, the one recurring leak and what to work on next, citing the games. Defaults to the user's own linked SC2 profile; pass player + region for someone else's public profile. Reading the saved note is free. Writing a new one (when there are newer coached games, or none exists yet) COSTS ${COACH_PRICE} MINERAL and needs refresh: true plus confirm_spend: true \u2014 tell the user the price and balance and get a yes first. It reads the last 5 coached games, so run analyze_replay on recent games first if there are fewer than 2. A new note takes 1\u20132 minutes: this waits up to wait_seconds, then call again to collect it.`,
      inputSchema: {
        category: external_exports.enum(["ranked", "unranked"]).optional().describe("ranked (ladder) or unranked games. Default: ranked, or unranked when the player has too few coached ranked games."),
        player: external_exports.string().min(1).max(64).optional().describe("Another player's in-game name. Omit for the signed-in user's own profile."),
        region: external_exports.enum(["na", "eu", "kr", "cn"]).optional().describe("Region of `player` (required with it)."),
        refresh: external_exports.boolean().optional().describe("Write a new note instead of returning the saved one."),
        confirm_spend: external_exports.boolean().optional().describe(CONFIRM_DESCRIPTION),
        language: external_exports.enum(COACH_LANGUAGES).optional().describe("Language of a new note (default en)."),
        wait_seconds: external_exports.number().int().min(0).max(300).optional().describe(`Max seconds to wait for a new note before returning (default ${WAIT_DEFAULT}).`)
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true }
    },
    guarded(
      async (args, extra) => {
        let name = args.player;
        let region = args.region;
        if (name && !region) return fail("Pass `region` (na, eu, kr or cn) together with `player`.");
        let me = null;
        if (!name) {
          me = await getMe();
          if (!me.profileName || !me.profileRegion) {
            return fail(
              `The user hasn't set their StarCraft II profile on StarCraft2.ai, so there's no way to know which games are theirs. They can set it from the account menu on ${apiBase()} (their in-game name and region), or pass player + region.`
            );
          }
          name = me.profileName;
          region = me.profileRegion;
        }
        const who = args.player ? name : "you";
        const profileUrl = (c) => `${apiBase()}/en/profiles/${region}/${encodeURIComponent(name)}?games=${c}&tab=coach`;
        let category = args.category ?? "ranked";
        let note = await getNote(region, name, category, extra.signal);
        if (!args.category && note.currentReplays.length < 2 && !note.summary) {
          const unranked = await getNote(region, name, "unranked", extra.signal);
          if (unranked.currentReplays.length >= 2 || unranked.summary) {
            category = "unranked";
            note = unranked;
          }
        }
        const key2 = noteKey(region, name, category);
        let run = getNoteRun(key2);
        if (run && run.settled && !run.delivered) {
        } else if (!run || run.settled) {
          const fresh = note.summary && !note.hasNewGames && !note.summaryNeedsRefresh;
          if (note.summary && (fresh || !args.refresh)) {
            const newer = note.hasNewGames ? `

(${who === "you" ? "You have" : `${name} has`} newer coached games since this note. A new note costs ${COACH_PRICE} mineral: call again with refresh: true and confirm_spend: true once the user agrees.)` : note.summaryNeedsRefresh ? "\n\n(Written by an older coach version. Call again with refresh: true to rewrite it on the current one for free.)" : "";
            return text(`${formatNote(note, apiBase())}${newer}

On the site: ${profileUrl(category)}`, {
              status: "saved",
              category,
              spent: 0,
              hasNewGames: note.hasNewGames
            });
          }
          if (note.currentReplays.length < 2) {
            return fail(
              `A check-in note needs at least 2 coached ${category} games and ${who === "you" ? "you have" : `${name} has`} ${note.currentReplays.length}. Run the AI Coach on more ${category} games first (list_my_replays, then analyze_replay).`
            );
          }
          const free = !!note.summary && !note.hasNewGames && note.summaryNeedsRefresh;
          if (!free) {
            me = me ?? await getMe();
            if (me.tokenCanSpend === false) return fail(spendOffText());
            if (me.minerals < COACH_PRICE) {
              return fail(`A new check-in note costs ${COACH_PRICE} mineral and the balance is ${me.minerals}. The user can buy minerals at ${billingUrl()}.`);
            }
            const gate = await confirmSpend(
              server,
              confirm_spend_or(args),
              `Write a new AI Coach check-in note on ${who === "you" ? "your" : `${name}'s`} last ${Math.min(5, note.currentReplays.length)} coached ${category} games for ${COACH_PRICE} mineral? Your balance is ${me.minerals}.`
            );
            if (gate === "declined") return text("Not started: the user declined the spend.", { status: "declined" });
            if (gate === "needs_flag") {
              return text(
                `Not started. A new check-in note on the last ${Math.min(5, note.currentReplays.length)} coached ${category} games costs ${COACH_PRICE} mineral; the balance is ${me.minerals}. Ask the user, then call again with refresh: true and confirm_spend: true.`,
                { status: "confirmation_required", price: COACH_PRICE, minerals: me.minerals, category }
              );
            }
          }
          run = startNoteRun({ region, name, category, language: args.language ?? "en", free });
        }
        const report = progressReporter(extra);
        const settled = await waitForNote(run, waitMs(args.wait_seconds), (s) => report(`Writing the check-in note, ${s}s`), extra.signal);
        if (!settled) {
          return text(
            `Still writing the check-in note (${Math.round((Date.now() - run.startedAt) / 1e3)}s so far; it usually takes 1\u20132 minutes). Call coach_my_progress again with the same player and category to collect it \u2014 don't pass refresh again.`,
            { status: "running", category }
          );
        }
        run.delivered = true;
        if (run.error) {
          const e = run.error;
          if (e instanceof ApiError && e.code === "WOULD_CHARGE") {
            return text(
              `Not written: newer coached games turned up, so a new note now costs ${COACH_PRICE} mineral. Ask the user, then call again with refresh: true and confirm_spend: true.`,
              { status: "confirmation_required", price: COACH_PRICE, category }
            );
          }
          if (e instanceof ApiError && e.status === 409) {
            const saved = await getNote(region, name, category, extra.signal);
            return text(`Already up to date \u2014 no newer coached games since the saved note. Nothing was charged.

${formatNote(saved, apiBase())}`, {
              status: "saved",
              category,
              spent: 0
            });
          }
          throw e;
        }
        return text(`${formatNote(run.note, apiBase())}

On the site: ${profileUrl(category)}`, {
          status: "written",
          category,
          summaryId: run.note.summaryId
        });
      }
    )
  );
  return server;
}
export {
  createServer2 as createServer,
  runHosted
};
