# react-state-factory
> Under development!

react state handling helper based on useReducer and typescript

This minimal library will help to organize mid complex state handling under with type guarded dispatch capable actions.

## install

```sh
pnpm add react-state-factory
```

## example

> Declare the set of actions with their types
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

> Example of use in saga
```ts
// exampleGenerator.ts

import { typedPutActionMapFactory } from 'react-state-factory';
import { actions, ActionTypes } from './actions;


const run = typedPutActionMapFactory<typeof actions, AppActions>(actions);

export function * exampleGenerator() {
  yield run.START_APPLICATION({
    start: Date.now(), 
    id: Math.random().toString(32).slice(-8)
  });
  yield run.PLACE_CONENT([87, 45, 23, 12]);
  yield run.ADD_ITEM(42);
}
```

## Fun-Functions test 

```tsx
export const FunFunction: FC = () => {

  const [state, put] = useSagaFactory(gameReducer, initialTable, game, gameSaga);

  useEffect(() => {
    actions.LETS_PLAY(true);
  }, [actions]);

  return (
    <main className="bg-black text-green-400 min-h-screen grid place-items-center relative">
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </main>
  );
}
```

## npm local test

https://dev.to/scooperdev/use-npm-pack-to-test-your-packages-locally-486e

```sh
npm pack --pack-destination ~
```