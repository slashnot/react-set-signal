import { useSyncExternalStore, useCallback } from "react";
import { effect, Signal } from "@preact/signals-core";

/* *** ------------------------------------
// useReactiveSignal takes a Preact Signal
// and returns a reactive state that updates
// ---------------------------------------- */
export const useReactiveSignal = ($signal) => {
    const snapshotFn = useCallback(() => $signal.value, [$signal]);
    const serverSnapshotFn = () => $signal.peek();
    // --- xx ----

    const subscriptionFn = useCallback((listener) => {
        return effect(() => {
            listener($signal.value);
        })
    }, [$signal]);
    // --- xx ----

    const state = useSyncExternalStore(
        subscriptionFn,
        snapshotFn,
        serverSnapshotFn
    )
    // --- xx ----

    return state
}