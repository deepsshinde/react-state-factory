# hyper-state
react state handling helper based on useReducer and typescript

![explore-the-hyper-state](https://images.wombo.art/generated/26fb8725-b93a-4608-83cc-aa390dc4fb8a/final.jpg?Expires=1698800613&Signature=vZR3LppV8yG5oIyiuNJDbJD661qiE-mbYhhVTZMTFTuBU1Z2bXIBpj0Bcdk8J-bdG8AWP6vvk7XoPnelzJXBhkARIoSh2z-g5MzlcPRs-sQnkZdN5vVqk-mX8gPsyROLoKjtB~flnl8MJ3RrX4SSBgUtFa0uWoS9BapQ-kgYHPj1KBb3~cyq6IlsquQfZFRhqpXRWC17YfyjpvWNnsJ9byDiRAxiUHWh3V98Xu508jXN9qSov7JeQw-mHdcTKHLiOaWOJM90tibCRXYYaLLJtItT0z2ZjrQMkQiD9WrXe~8hDrt-eRGecoYx81y~MgDUs233BAAyWoz-IDzI41B5VQ__&Key-Pair-Id=K1ZXCNMC55M2IL)

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
