import deepEqual from "deep-equal";

export const strictDeepEqual = (actual: any, expected: any) => deepEqual(actual, expected, { strict: true });
