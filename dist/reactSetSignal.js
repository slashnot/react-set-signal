import { useMemo as i, useCallback as r, useSyncExternalStore as u } from "react";
import { signal as f, effect as a } from "@preact/signals-core";
import { Computed as C, Effect as E, Signal as j, batch as w, computed as D, effect as M, signal as q, untracked as z } from "@preact/signals-core";
import { create as l, isDraft as m, rawReturn as v } from "mutative";
export * from "mutative";
const S = (e, t) => typeof t == "function" ? l(e.value, (s) => {
  const n = t(s);
  return typeof n > "u" || m(n) ? s : typeof n == "object" ? v(n) : n;
}) : t, F = (e, t) => (e.value = S(e, t), e.value), b = (e) => {
  const t = f(e);
  return t.set = (o) => F(t, o), t;
}, g = (e) => {
  const t = i(() => b(e), []), o = r(() => t.value, [t]), s = () => t.peek(), n = r((p) => a(() => {
    p(t.value);
  }), [t]);
  return [u(
    n,
    o,
    s
  ), t.set];
}, k = (e) => {
  const t = r(() => e.value, [e]), o = () => e.peek(), s = r((c) => a(() => {
    c(e.value);
  }), [e]);
  return u(
    s,
    t,
    o
  );
};
export {
  C as Computed,
  E as Effect,
  j as Signal,
  w as batch,
  D as computed,
  b as createSignal,
  M as effect,
  q as signal,
  z as untracked,
  g as useReactive,
  k as useReactiveSignal
};
//# sourceMappingURL=reactSetSignal.js.map
