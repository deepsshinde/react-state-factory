import { Dispatch, useMemo, useReducer } from "react";
import { Saga } from "redux-saga";
import { put, CallEffect, SelectEffect } from "redux-saga/effects";
import useSagaReducer from "use-saga-reducer";

/**
 * react-state-factory use actions in
 * { type: string, payload: any } format
 */
export type ActionType<T> = T extends { type: infer U, payload: infer P } 
  ? { type: U, payload: P } 
  : never;

/**
 * Labes use for automatic create labels by user created ActionsMaper type
 * which looks like
 * ```ts
 * export type ActionsMap = 
 *  | { type: "FOO_ACTION", payload: string }
 *  | { type: "ADD_ITEM", payload: Item }
 *  | { type: "REMOVE_ITEM", payload: ItemId }
 * 
 * export const label:Labels<ActionsMap> = {}
 * ```
 */
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
): TypedActionMap<AM, Labels<AM>> {
  return Object.keys(labels).reduce((acc, type) => ({
    ...acc,
    [type]: (payload: any) => put({ type, payload })
  }), {} as TypedActionMap<AM, Labels<AM>>);
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

export type GeneratorSaga<ST> = () => Generator<void | CallEffect<true> | SelectEffect, void, ST>;

export const useSagaFactory = <
  AM extends ActionType<any>, 
  ST,
  PT extends Labels<AM>,
>(
  reducer: (st: ST, action: AM) => ST,
  initialState: ST,
  labels: PT,
  saga: GeneratorSaga<ST>
)  => {
  type SagaResult = [state: ST, dispatch: Dispatch<AM>];
  const [state, dispatch]: SagaResult = useSagaReducer(saga as any as Saga, reducer, initialState);
  const put = useMemo(
    () => typedActionMapFactory(labels, dispatch), [dispatch, labels]
  );
  return [state, put] as UseFactoryReturn<ST, TypedActionMap<AM, PT>>;
};