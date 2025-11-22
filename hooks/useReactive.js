
import { useSyncExternalStore, useCallback, useMemo } from "react";
import { effect } from "@preact/signals-core";
import { createSignal } from "../utils/createSignal";

/* *** ------------------------------------
// useReactive takes an initial state
// and returns a reactive state that updates
// ---------------------------------------- */
export const useReactive = (initialState) => {
    const $signal = useMemo(() => createSignal(initialState), []);
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

    return [state, $signal.set]
}
