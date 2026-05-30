// Empty stub — replaces the real "server-only" guard during vitest runs so
// tests can import server-only modules. The real guard is still active in
// production builds; vitest is just the unit-test harness.
export {};
