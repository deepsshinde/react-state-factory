# hyper-state
react state handling helper based on useReducer and typescript

This minimal library will help to organize mid complex state handling under with type guarded dispatch capable actions.

## example

```tsx
import { FC, useEffect } from 'react';
import { useHyperState } from 'hyper-state';
import { Actions, defaultState } from '@declaration/appState';
import { appReducer } from '@code/appReducer';
import { appSaga } from '@code/appSaga';

export const Application:FC = () => {
  const [state, actions] = useHyperState<Actions>(
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

... I can show hyper-state capability by with a simple game
