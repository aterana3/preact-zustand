import './app.css';
import { create } from 'preact-zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const useCounter = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

function Counter() {

  const { count, increment, decrement } = useCounter();

  return (
    <div class="card">
      <h2>Counter Example</h2>
      <div class="counter">
        <button onClick={decrement}>-</button>
        <span>{count}</span>
        <button onClick={increment}>+</button>
      </div>
    </div>
  );
}

export function App() {
  return (
    <div class="container">
      <h1>Zustand Preact Examples</h1>
      <Counter />
    </div>
  );
}