import { Dispatch } from 'react';
import { put } from "redux-saga/effects";

export type ActionType<T> = T extends { type: infer U, payload: infer P } 
  ? { type: U, payload: P } 
  : never;

export type TypedActionMap<EnumType extends Record<string, string>, UnionType> = {
  [T in keyof EnumType]: 
    (payload: Extract<ActionType<UnionType>, { type: T }>["payload"]) 
    => void;
};

export function typedActionMapFactory<
  EM extends Record<string, string>, 
  AM
>(keys: EM, dispatch: Dispatch<AM>): TypedActionMap<EM, AM> {
  return Object.keys(keys).reduce((acc, type) => ({
    ...acc,
    [type]: (payload: unknown) => {
      dispatch({ type, payload } as AM);
    }
  }), {} as TypedActionMap<EM, AM>);
}

export type TypedGeneratorMap<EnumType extends Record<string, string>, UnionType> = {
  [T in EnumType[keyof EnumType]]: 
    (payload: Extract<ActionType<UnionType>, { type: T }>["payload"]) 
    => Generator;
};

export function typedPutActionMapFactory<
  EM extends Record<string, string>, 
  AM
>(keys: EM): TypedGeneratorMap<EM, AM> {
  return Object.keys(keys).reduce((acc, type) => ({
    ...acc,
    [type]: function* putGenerator(payload: unknown) {
      yield put({ type, payload });
    }
  }), {} as TypedGeneratorMap<EM, AM>);
}