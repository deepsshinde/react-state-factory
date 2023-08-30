import { Dispatch, Reducer, useMemo } from "react";
// @ts-ignore
import { put, Saga } from "redux-saga/effects";
import useSagaReducer from "use-saga-reducer";


export type ActionType<T> = T extends { type: infer U, payload: infer P } 
  ? { type: U, payload: P } 
  : never;

export type TypedActionMap<EnumType extends Record<string, string>, UnionType> = {
  [T in keyof EnumType]: 
    (payload: Extract<ActionType<UnionType>, { type: T }>["payload"]) 
    => void;
};

export type TypedGeneratorMap<EnumType extends Record<string, string>, UnionType> = {
  [T in EnumType[keyof EnumType]]: 
    (payload: Extract<ActionType<UnionType>, { type: T }>["payload"]) 
    => Generator;
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

// TODO something broke in demo app
export function useTyperduxSagaReducer<ST, AM>(
  mainSaga: Saga<AM>,
  reducer: Reducer<ST, AM>,
  initial: ST,
  labels: Record<string, string>,
) : [
  state: ST,
  actions: TypedActionMap<typeof labels, AM>
] {
  const [_state_, dispatch] = useSagaReducer<Saga<AM>, Reducer<ST, AM>, ST>(mainSaga, reducer, initial);
  const state = _state_ as ST;
  const actions = useMemo(() => typedActionMapFactory<typeof labels, AM>(labels, dispatch), [dispatch]);
  return [
    state, 
    actions,
  ];
}