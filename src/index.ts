import type { ExtractState, StateCreator, StoreApi, StoreMutatorIdentifier } from 'zustand/vanilla';
import { createStore } from 'zustand/vanilla';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';

const identity = <T>(arg: T): T => arg;

export function useStore<S extends StoreApi<unknown>>(api: S): ExtractState<S>;

export function useStore<S extends StoreApi<unknown>, U>(
  api: S,
  selector: (state: ExtractState<S>) => U,
  equalityFn?: (a: U, b: U) => boolean
): U;

export function useStore<TState, StateSlice>(
  api: StoreApi<TState>,
  selector: (state: TState) => StateSlice = api.getState as any,
  equalityFn?: (a: StateSlice, b: StateSlice) => boolean
) {
  const prevStateRef = useRef<StateSlice>();

  const [state, setState] = useState(() => {
    const initialState = selector(api.getState());
    prevStateRef.current = initialState;
    return initialState;
  });

  const stableListener = useCallback(() => {
    const nextState = selector(api.getState());
    const prevState = prevStateRef.current;

    if (typeof nextState === 'function') {
      return;
    }

    let shouldUpdate: boolean;
    if (equalityFn) {
      shouldUpdate = !equalityFn(prevState as StateSlice, nextState);
    } else {
      shouldUpdate = prevState !== nextState;
    }

    if (shouldUpdate) {
      prevStateRef.current = nextState;
      setState(nextState);
    }
  }, [api, selector, equalityFn]);

  useEffect(() => {
    return api.subscribe(stableListener);
  }, [stableListener]);

  if (typeof state === 'function') {
    return selector(api.getState());
  }

  return state;
}

export type UseBoundStore<S extends StoreApi<unknown>> = {
  (): ExtractState<S>;
  <U>(selector: (state: ExtractState<S>) => U): U;
} & S;

type Create = {
  <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>
  ): UseBoundStore<StoreApi<T>>;
  <T>(): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>
  ) => UseBoundStore<StoreApi<T>>;
};

const createImpl = <T>(createState: StateCreator<T, [], []>) => {
  const api = createStore(createState);

  const useBoundStore: any = (selector?: any, equalityFn?: any) =>
    useStore(api, selector || identity, equalityFn);

  Object.assign(useBoundStore, api);

  return useBoundStore;
};

export const create = (<T>(createState: StateCreator<T, [], []> | undefined) =>
  createState ? createImpl(createState) : createImpl) as Create;
