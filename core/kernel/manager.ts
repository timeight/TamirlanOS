/**
 * Every subsystem of TamirlanOS implements this. The kernel starts and stops
 * managers; nothing else knows how a manager is built.
 */
export interface Manager {
  readonly id: string;
  /** Managers listed here are started first. */
  readonly dependsOn?: readonly string[];
  start(): void | Promise<void>;
  stop?(): void;
}

export type ServiceToken<T> = symbol & { readonly __service?: T };

export function createToken<T>(description: string): ServiceToken<T> {
  return Symbol(description) as ServiceToken<T>;
}
