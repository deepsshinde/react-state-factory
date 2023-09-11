# react-state-factory
> Under development!

react-state-factory is a minimalist library that helps organize mid-complex state handling with type-guarded dispatch-capable actions. It leverages `useReducer` and TypeScript to bring type safety and structure to your application's state management.

## Installation

```sh
npm add react-state-factory
```

or if you use yarn:

```sh
yarn add react-state-factory
```

## Usage

### Declare the set of actions with their types

```ts
// actions.ts

export enum actions {
  START_APPLICATION = "START_APPLICATION",
  PLACE_CONTENT = "PLACE_CONTENT",
  ADD_ITEM = "ADD_ITEM",
}

export type ActionTypes =
  | { type: actions.START_APPLICATION, payload: {start: number, id: string } }
  | { type: actions.PLACE_CONENT, payload: number[] }
  | { type: actions.ADD_ITEM, payload: number };
```

```ts
// reducer.ts

export type SimpleState = {
  content: number[],
  start: number,
  id: string,
}

export const gameReducer:Reducer<SimpleState, ActionTypes> = (state:SimpleState,  { type, payload }: ActionTypes) => {
  switch (type) {
    case game.LETS_PLAY: return {...state, isReady: payload};
    case actions.START_APPLICATION: return {...state, id: payload.id, start: payload: start};
    case actions.PLACE_CONENT: return {...state, content: payload };
    case actions.ADD_ITEM: return {...state, content: [...state.content, payload]};
    default return state;
  }
```

### SimpleComponent example 

```tsx
// SimpleComponent.tsx

import { FC, useEffect } from 'react';
import { useStateFactory } from 'react-state-factory';
import { actions, ActionTypes } from './actions';

export const SimpleComponent: FC = () => {

  const [state, put] = useStateFactory(reducer, initialState, actions);

  useEffect(() => {
    put.START_APPLICATION({
      start: Date.now(),
      id: "-basic-app-uui-",
    });
  }, [put]);

  return (
    <main className="bg-black text-green-400 min-h-screen grid place-items-center relative">
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </main>
  );
}
```

In this example, `useStateFactory` is used to create a `state` and a `put` function. The `state` is the current state of the application, and `put` is a function that dispatches actions to the reducer. The `put` function is created using the `actions` enum and is type-safe, meaning you will get TypeScript errors if you try to dispatch an action with the wrong payload type.

### Example of use in saga

```ts
// exampleGenerator.ts

import { typedPutActionMapFactory } from 'react-state-factory';
import { actions, ActionTypes } from './actions';

const run = typedPutActionMapFactory<typeof actions, ActionTypes>(actions);

export function * exampleGenerator() {
  yield run.START_APPLICATION({
    start: Date.now(), 
    id: Math.random().toString(32).slice(-8)
  });
  yield run.PLACE_CONENT([87, 45, 23, 12]);
  yield run.ADD_ITEM(42);
}
```

In this example, `typedPutActionMapFactory` is used to create a `run` function, which is a saga generator that dispatches actions. The `run` function is created using the `actions` enum and is type-safe.

## API Reference

### `useStateFactory`

```ts
function useStateFactory<
  AM, 
  ST,
  PT extends Record<string, string>,
>(
  reducer: (st: ST, action: AM) => ST,
  initialState: ST,
  labels: PT,
): UseFactoryReturn<ST, TypedActionMap<PT, AM>>
```

Creates a `state` and a `put` function.

- `reducer`: A function that takes the current `state` and an `action` and returns the new `state`.
- `initialState`: The initial state of your application.
- `labels`: An object where the keys are the action types and the values are the action type strings.

Returns an array with the `state` and the `put` function.

### `useSagaFactory`

```ts
function useSagaFactory<
  AM, 
  ST,
  PT extends Record<string, string>,
>(
  reducer: (st: ST, action: AM) => ST,
  initialState: ST,
  labels: PT,
  saga: Saga,
): UseFactoryReturn<ST, TypedActionMap<PT, AM>>
```

Creates a `state` and a `put` function.

- `reducer`: A function that takes the current `state` and an `action` and returns the new `state`.
- `initialState`: The initial state of your application.
- `labels`: An object where the keys are the action types and the values are the action type strings.
- `saga`: A redux-saga generator function.

Returns an array with the `state` and the `put` function.

## Contribution

If you want to contribute to this project, please fork the repository, create a new branch for your work, and open a pull request.

## License

MIT

---

## npm local test - keep remember

https://dev.to/scooperdev/use-npm-pack-to-test-your-packages-locally-486e

```sh
npm pack --pack-destination ~
```