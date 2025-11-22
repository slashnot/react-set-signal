import { useMemo as i, useCallback as r, useSyncExternalStore as c } from "react";
import { signal as f, effect as a } from "@preact/signals-core";
export * from "@preact/signals-core";
import { create as l, isDraft as v, rawReturn as m } from "mutative";
const S = (e, t) => typeof t == "function" ? l(e.value, (o) => {
  const n = t(o);
  return typeof n > "u" || v(n) ? o : typeof n == "object" ? m(n) : n;
}) : t, F = (e, t) => (e.value = S(e, t), e.value), R = (e) => {
  const t = f(e);
  return t.set = (s) => F(t, s), t;
}, k = (e) => {
  const t = i(() => R(e), []), s = r(() => t.value, [t]), o = () => t.peek(), n = r((p) => a(() => {
    p(t.value);
  }), [t]);
  return [c(
    n,
    s,
    o
  ), t.set];
}, x = (e) => {
  const t = r(() => e.value, [e]), s = () => e.peek(), o = r((u) => a(() => {
    u(e.value);
  }), [e]);
  return c(
    o,
    t,
    s
  );
};
export {
  R as createSignal,
  k as useReactive,
  x as useReactiveSignal
};
//# sourceMappingURL=reactSetSignal.js.map
