import type { ServiceToken } from "@/core/kernel/manager";

type Factory<T> = () => T;

const instances = new Map<symbol, unknown>();
const factories = new Map<symbol, Factory<unknown>>();

/**
 * Dependency inversion for the whole OS: callers ask for a capability by token
 * and receive whatever the kernel registered, never a concrete import.
 */
export function provide<T>(token: ServiceToken<T>, factory: Factory<T>): void {
  factories.set(token, factory as Factory<unknown>);
  instances.delete(token);
}

export function provideValue<T>(token: ServiceToken<T>, value: T): void {
  instances.set(token, value);
}

export function resolve<T>(token: ServiceToken<T>): T {
  if (instances.has(token)) return instances.get(token) as T;
  const factory = factories.get(token);
  if (!factory) {
    throw new Error(`Service not registered: ${String(token.description)}`);
  }
  const value = factory();
  instances.set(token, value);
  return value as T;
}

export function tryResolve<T>(token: ServiceToken<T>): T | null {
  return instances.has(token) || factories.has(token) ? resolve(token) : null;
}

export function resetServices(): void {
  instances.clear();
  factories.clear();
}
