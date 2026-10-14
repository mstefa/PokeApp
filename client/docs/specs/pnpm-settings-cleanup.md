# 🧹 pnpm Settings Cleanup Specification

This specification documents the migration of pnpm configuration settings to resolve deprecation warnings in pnpm v11+.

## Rationale
In pnpm v10 and v11, the `"pnpm"` object in `package.json` was deprecated for settings like `onlyBuiltDependencies`, producing warnings on every script invocation:
```text
[WARN] The "pnpm" field in package.json is no longer read by pnpm. 
The following keys were ignored: "pnpm.onlyBuiltDependencies".
```
By moving `onlyBuiltDependencies` into `client/pnpm-workspace.yaml`, configuration is located in the official setting location and the warning is eliminated.

## Changes
- **`client/package.json`**:
  - Removed deprecated `"pnpm": { "onlyBuiltDependencies": ["esbuild", "sharp", "workerd"] }` block.
- **`client/pnpm-workspace.yaml`**:
  - Added `onlyBuiltDependencies` array (`esbuild`, `sharp`, `workerd`).

## Verification
- Test execution: `pnpm run test --run` executes cleanly with 0 warnings.
- Build execution: `pnpm run build` completes successfully.
