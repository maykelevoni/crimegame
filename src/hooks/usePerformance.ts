import { useCallback, useRef, useEffect, useState } from "react";

// Hook para debounce
export const useDebounce = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;
};

// Hook para throttle
export const useThrottle = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T => {
  const lastCall = useRef(0);
  const lastCallTimer = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastCall.current >= delay) {
        callback(...args);
        lastCall.current = now;
      } else {
        if (lastCallTimer.current) {
          clearTimeout(lastCallTimer.current);
        }

        lastCallTimer.current = setTimeout(() => {
          callback(...args);
          lastCall.current = Date.now();
        }, delay - (now - lastCall.current));
      }
    },
    [callback, delay]
  ) as T;
};

// Hook para lazy loading
export const useLazyLoad = <T>(data: T[], itemsPerPage: number = 10) => {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    const newItems = data.slice(startIndex, endIndex);

    setDisplayedItems(newItems);
    setHasMore(endIndex < data.length);
  }, [data, currentPage, itemsPerPage]);

  const loadMore = useCallback(() => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasMore]);

  return {
    displayedItems,
    hasMore,
    loadMore,
    reset: () => setCurrentPage(1),
  };
};

// Hook para memoização de cálculos pesados
export const useMemoizedValue = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  const ref = useRef<{ deps: React.DependencyList; value: T }>();

  if (!ref.current || !depsAreEqual(ref.current.deps, deps)) {
    ref.current = { deps, value: factory() };
  }

  return ref.current.value;
};

// Função auxiliar para comparar dependências
const depsAreEqual = (
  oldDeps: React.DependencyList,
  newDeps: React.DependencyList
): boolean => {
  if (oldDeps.length !== newDeps.length) return false;

  for (let i = 0; i < oldDeps.length; i++) {
    if (oldDeps[i] !== newDeps[i]) return false;
  }

  return true;
};

// Hook para detectar se o elemento está visível
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isIntersecting;
};

// Hook para otimizar re-renders
export const useShallowEqual = <T>(value: T): T => {
  const ref = useRef<T>(value);

  if (!shallowEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
};

// Função auxiliar para comparação superficial
const shallowEqual = (obj1: unknown, obj2: unknown): boolean => {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1 as Record<string, unknown>);
  const keys2 = Object.keys(obj2 as Record<string, unknown>);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (
      !keys2.includes(key) ||
      (obj1 as Record<string, unknown>)[key] !==
        (obj2 as Record<string, unknown>)[key]
    ) {
      return false;
    }
  }

  return true;
};
