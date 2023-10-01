import { Dispatch, useMemo, useReducer } from "react";
import { Saga } from "redux-saga";
import { put } from "redux-saga/effects";
import useSagaReducer from "use-saga-reducer";


export type ActionType<T> = T extends { type: infer U, payload: infer P } 
  ? { type: U, payload: P } 
  : never;

export type Labels<AM extends Record<string, any>> = {
  [K in AM['type']]: K
}

export type TypedActionMap<
  AM extends ActionType<any>, 
  EM extends Labels<AM>
> = {
  [T in keyof EM]: 
    (payload: Extract<ActionType<AM>, { type: T }>["payload"]) 
    => void;
};

export type TypedGeneratorMap<
  AM extends ActionType<any>, 
  EM extends Labels<AM>
> = {
  [T in EM[keyof EM]]: 
    (payload: Extract<ActionType<AM>, { type: T }>["payload"]) 
    => Generator;
};

export function typedActionMapFactory<
  AM extends ActionType<any>
>(
  keys: Labels<AM>, 
  dispatch: Dispatch<AM>
): TypedActionMap<AM,Labels<AM>> {
  return Object.keys(keys).reduce((acc, type) => ({
    ...acc,
    [type]: (payload: any) => {
      dispatch({ type, payload } as AM);
    }
  }), {} as TypedActionMap<AM, Labels<AM>>);
}

export function typedPutActionMapFactory<
  AM extends ActionType<any>
>(
  labels: Labels<AM>
): TypedGeneratorMap<AM, Labels<AM>> {
  return Object.keys(labels).reduce((acc, type) => ({
    ...acc,
    [type]: function * putGenerator(payload: any) {
      yield put({ type, payload });
    }
  }), {} as TypedGeneratorMap<AM, Labels<AM>>);
}

export type UseFactoryReturn<ST, Put> = [state: ST, put: Put];

export const useStateFactory = <
  AM extends ActionType<any>, 
  ST,
  PT extends Labels<AM>,
>(
  reducer: (st: ST, action: AM) => ST,
  initialState: ST,
  labels: PT,
)  => {
  type FactoryResult = [state: ST, dispatch: Dispatch<AM>];
  const [state, dispatch]: FactoryResult = useReducer(reducer, initialState);
  const put = useMemo(
    () => typedActionMapFactory(labels, dispatch), [dispatch, labels]
  );
  return [state, put] as UseFactoryReturn<ST, TypedActionMap<AM, PT>>;
};

export const useSagaFactory = <
  AM extends ActionType<any>, 
  ST,
  PT extends Labels<AM>,
>(
  reducer: (st: ST, action: AM) => ST,
  initialState: ST,
  labels: PT,
  saga: Saga,
)  => {
  type SagaResult = [state: ST, dispatch: Dispatch<AM>];
  const [state, dispatch]: SagaResult = useSagaReducer(saga, reducer, initialState);
  const put = useMemo(
    () => typedActionMapFactory(labels, dispatch), [dispatch, labels]
  );
  return [state, put] as UseFactoryReturn<ST, TypedActionMap<AM, PT>>;
};