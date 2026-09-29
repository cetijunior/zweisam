import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True after hydration; avoids the setState-in-effect "mounted" pattern. */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
