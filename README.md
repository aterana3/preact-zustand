# preact-zustand

🐻 State-management for Preact based Zustand.

## Installation

```bash
npm install preact-zustand
# or
yarn add preact-zustand
# or
pnpm add preact-zustand
```

## Usage

```tsx
import { create } from 'preact-zustand'

interface BearState {
  bears: number
  increase: () => void
}

const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
}))

function BearCounter() {
  const bears = useBearStore((state) => state.bears)
  return <h1>{bears} around here...</h1>
}

function Controls() {
  const increase = useBearStore((state) => state.increase)
  return <button onClick={increase}>one up</button>
}
```

## License

MIT