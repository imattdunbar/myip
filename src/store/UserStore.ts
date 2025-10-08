import { Store, useStore } from '@tanstack/react-store'

declare module '@tanstack/react-store' {
  interface Store<TState> {
    update(partial: Partial<TState>): void
  }
}

Store.prototype.update = function <TState>(this: Store<TState>, partial: Partial<TState>) {
  this.setState((prev) => ({ ...prev, ...partial }))
}

type UserStore = {
  ip: string
  port?: number
  errorMessage?: string
  input: string
}

const store = new Store<UserStore>({ ip: '...', input: '' })

export default {
  use: () => {
    return useStore(store)
  },
  update: (partial: Partial<UserStore>) => store.update(partial),
  current: () => store.state
}
