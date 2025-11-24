import { useMemo as f, useCallback as r, useSyncExternalStore as a } from "react";
import { signal as l, effect as p } from "@preact/signals-core";
import { Computed as E, Effect as d, Signal as j, batch as w, computed as D, effect as M, signal as q, untracked as z } from "@preact/signals-core";
import { create as m, isDraft as u, rawReturn as v } from "mutative";
export * from "mutative";
const S = (e, t) => typeof t == "function" ? m(e.value, (n) => {
  const o = t(n);
  return u(o) ? n : typeof o == "object" && !u(o) ? v(o) : n;
}) : t, F = (e, t) => (e.value = S(e, t), e.value), b = (e) => {
  const t = l(e);
  return t.set = (s) => F(t, s), t;
}, k = (e) => {
  const t = f(() => b(e), []), s = r(() => t.value, [t]), n = () => t.peek(), o = r((i) => p(() => {
    i(t.value);
  }), [t]);
  return [a(
    o,
    s,
    n
  ), t.set];
}, x = (e) => {
  const t = r(() => e.value, [e]), s = () => e.peek(), n = r((c) => p(() => {
    c(e.value);
  }), [e]);
  return a(
    n,
    t,
    s
  );
};
export {
  E as Computed,
  d as Effect,
  j as Signal,
  w as batch,
  D as computed,
  b as createSignal,
  M as effect,
  q as signal,
  z as untracked,
  k as useReactive,
  x as useReactiveSignal
};
//# sourceMappingURL=reactSetSignal.js.map
