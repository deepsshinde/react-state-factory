# type-state
react state handling helper based on useReducer and typescript

![explore-the-hyper-state](documentation/images/explore-the-hyper-state.jpg)

This minimal library will help to organize mid complex state handling under with type guarded dispatch capable actions.

## example

```tsx
import { FC, useEffect } from 'react';
import { useTypeState } from 'type-state';
import { Actions, defaultState } from '@declaration/appState';
import { appReducer } from '@code/appReducer';
import { appSaga } from '@code/appSaga';

export const Application:FC = () => {
  const [state, actions] = useTypeState<Actions>(
    appReducer,
    defaultState,
    appSaga // optional
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      actions.CHANGE_FOO('... foo is changed after 2 sec');
    }, 2000);
    return () => clearTimer(timer);
  }, []);

  return (
    <main>
      <pre>{JSON.stringify(state), null, 2)</pre>
    </main>
  );
}
```

## Behind the scene

... short description about implementation

## Why important use redux-reduce - without redux

... I can show type-state capability by with a simple game

## npm package create with vite: 
[creating-a-typescript-library-with-vite](https://onderonur.netlify.app/blog/creating-a-typescript-library-with-vite/)

## npm local test

https://dev.to/scooperdev/use-npm-pack-to-test-your-packages-locally-486e

```sh
npm pack --pack-destination ~
```