import '@testing-library/jest-dom';

// Provide localStorage in environments where it is missing (Vitest workers)
if (typeof localStorage === 'undefined' || localStorage === null) {
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] ?? null,
      setItem: (key, value) => { store[key] = String(value); },
      removeItem: (key) => { delete store[key]; },
      clear: () => { store = {}; },
    };
  })();
  Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });
}
