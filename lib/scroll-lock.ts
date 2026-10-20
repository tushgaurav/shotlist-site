type Listener = (locked: boolean) => void;

const listeners = new Set<Listener>();

export function setScrollLocked(locked: boolean) {
  for (const listener of listeners) listener(locked);
}

export function onScrollLock(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
