# Build-only braces snapshot

This is a private, project-maintained snapshot of MIT-licensed `braces@3.0.3`
(https://github.com/micromatch/braces/tree/3.0.3), retaining its LICENSE and
`fill-range` dependency. It is not an upstream release and is never published.
The npm override replaces `braces` only in this repository's build toolchain.
The DS runtime package does not depend on this snapshot.

## Why it exists

GHSA-vfj7-8cjw-p6xm has no upstream patched release as of 2026-10-11.
Consumers require older browsers, so migrating the generated CSS to Tailwind 4
is not acceptable. We retain Tailwind 3 and own this narrowly scoped patch.

## Patch

- `parse` rejects structural nesting above 100 levels, including parentheses
  and mixed nesting, before any recursive walk.
- `compile`, `expand`, and `stringify` validate supplied ASTs iteratively and
  reject excessive depth and cycles/shared nodes before recursion.
- Normal pattern semantics and the existing range/length limits are retained.
- Excessive nesting throws a controlled `SyntaxError`, not a stack overflow.

This mitigates the identified recursive-walker issue. It does not make arbitrary
untrusted globs or unbounded expansions safe. Build patterns must remain trusted.

## Maintenance and validation

The scoped name makes the snapshot distinguishable from the vulnerable upstream
package; it is not evidence of a registry-certified fix. `check:build-security`
verifies the installed files and actual transitive resolutions, then exercises
the vulnerable paths. `check:security` must run this gate in addition to npm audit.
CI also verifies Tailwind builds, browser behavior and the packed consumer.

When an upstream fix compatible with Tailwind 3 becomes available, compare it
with this patch, remove the override/snapshot, reinstall from the registry and
rerun the same security, compatibility and consumer checks. Review this snapshot
whenever the build dependency tree changes.

Reference: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
