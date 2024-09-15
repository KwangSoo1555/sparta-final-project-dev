import { CommonError } from "../errors";

export const isTruthy = (...checkFor: any) => {
  if (Array.isArray(checkFor)) {
    return checkFor.every((item) => !!item);
  }
  return !!checkFor;
};

export const isFalsy = (...checkFor: any) => {
  if (Array.isArray(checkFor)) {
    return checkFor.every((item) => !item);
  }
  return !checkFor;
};

export const isEmptyObject = (obj: Object) => {
  return Object.keys(obj).length === 0;
};

export const isNumber = (value: any) => {
  return typeof value === "number";
};

export const includes = (value: any, searchValues: any[]) => {
  return searchValues.includes(value);
};

export const ternary = <T>(
  comparison: boolean,
  truthyObject: T | (() => T),
  falsyObject: T | (() => T),
): T =>
  comparison
    ? typeof truthyObject === "function"
      ? (truthyObject as () => T)()
      : truthyObject
    : typeof falsyObject === "function"
      ? (falsyObject as () => T)()
      : falsyObject;

export const throwIfCompanyInvalid = (entityCompanyId: number, requesterCompanyId: number) => {
  if (entityCompanyId !== requesterCompanyId) {
    throw CommonError.InvalidAccess();
  }
};
