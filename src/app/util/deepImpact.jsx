import { useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';

export default function useDeepEffect(effectFunc, deps) {
  const isFirst = useRef(true);
  const prevDeps = useRef(deps);
  useEffect(() => {
    // 20 Step
    const isSame = prevDeps.current.every((obj, index) => isEqual(obj, deps[index]));
    // 3° Step
    if (isFirst.current || !isSame) {
      effectFunc();
    }
    // 4º Step
    isFirst.current = false;
    prevDeps.current = deps;
  }, deps);
}
