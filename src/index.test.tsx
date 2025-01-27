import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/preact';
import { create } from './index';

interface TestState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

describe('preact-zustand', () => {
  it('should create and update store', () => {
    const useStore = create<TestState>((set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
    }));

    function Counter() {
      const { count, increment, decrement } = useStore();
      
      return (
        <div>
          <span data-testid="count">{count}</span>
          <button onClick={increment} data-testid="increment">+</button>
          <button onClick={decrement} data-testid="decrement">-</button>
        </div>
      );
    }

    render(<Counter />);
    
    expect(screen.getByTestId('count').textContent).toBe('0');
    
    fireEvent.click(screen.getByTestId('increment'));
    expect(screen.getByTestId('count').textContent).toBe('1');
    
    fireEvent.click(screen.getByTestId('decrement'));
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('should work with selectors', () => {
    const useStore = create<TestState>((set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
    }));

    function CountDisplay() {
      const count = useStore((state) => state.count);
      return <span data-testid="count">{count}</span>;
    }

    function Controls() {
      const increment = useStore((state) => state.increment);
      return <button onClick={increment} data-testid="increment">+</button>;
    }

    render(
      <div>
        <CountDisplay />
        <Controls />
      </div>
    );

    expect(screen.getByTestId('count').textContent).toBe('0');
    
    fireEvent.click(screen.getByTestId('increment'));
    expect(screen.getByTestId('count').textContent).toBe('1');
  });

  it('should handle equality function', () => {
    const useStore = create<{ items: string[] }>((set) => ({
      items: [],
      addItem: (item: string) => set((state) => ({ 
        items: [...state.items, item] 
      })),
    }));

    let renderCount = 0;

    function ItemList() {
      const items = useStore(
        (state) => state.items,
        (prev, next) => prev.length === next.length
      );

      renderCount++;
      
      return <div data-testid="items">{items.join(',')}</div>;
    }

    render(<ItemList />);
    
    const initialRenderCount = renderCount;
    
    useStore.setState({ items: ['different', 'items'] });
    
    expect(renderCount).toBe(initialRenderCount);
  });
});