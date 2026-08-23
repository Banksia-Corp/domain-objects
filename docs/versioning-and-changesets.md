# Semantic Versioning & Changeset Workflow

This document defines the semantic versioning standards, Changeset workflows, and release automation for `@banksia/domain-objects`.

---

## 1. When a Changeset is Required

We use **[Changesets](https://github.com/changesets/changesets)** to manage version bumps, changelog generation, and automated releases.

### A Changeset IS Required For:

- **Bug Fixes**: Any fix to base class methods (`Entity`, `ValueObject`, `AggregateRoot`, `DomainEvent`), equality checks, or event lifecycle handlers.
- **New Features & Primitives**: Addition of new DDD building blocks, helper types, validation utilities, or base methods.
- **Breaking Changes**: Any modification to existing API signatures, base class constructor requirements, method return types, or property structures.
- **Public Typing Changes**: Alterations to exported TypeScript interfaces or types (`IRepository`, `DomainEventPayload`, etc.) that impact consumers.

### A Changeset is NOT Required (Optional) For:

- Pure documentation updates (e.g., changes to `README.md`, `docs/`, `AGENTS.md`).
- Internal test suite improvements or additions that do not alter public behavior.
- Internal refactoring without behavioral or performance changes.
- CI/CD workflow updates, dev tooling, or linter configurations (unless a package release is desired).

---

## 2. SemVer Bump Classifications

`@banksia/domain-objects` adheres strictly to [Semantic Versioning 2.0.0](https://semver.org/). When creating a changeset, select the appropriate bump type based on consumer impact:

| Bump Type   | Impact Level                      | Description & Examples                                                                                                                                                                                                                                                |
| :---------- | :-------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`major`** | Breaking Changes                  | - Modifying or removing existing public methods/properties on `Entity`, `ValueObject`, `AggregateRoot`, or `DomainEvent`.<br>- Changing method signatures or generic parameter constraints in `IRepository`.<br>- Raising minimum Node.js or TypeScript requirements. |
| **`minor`** | New Backwards-Compatible Features | - Introducing new domain primitives or utility classes.<br>- Adding new optional methods or helper functions.<br>- Adding non-breaking overload signatures or optional parameters.                                                                                    |
| **`patch`** | Backwards-Compatible Bug Fixes    | - Fixing logic bugs in `ValueObject.equals()` or `Entity.equals()`.<br>- Correcting edge cases in event recording or extraction.<br>- Updating internal performance optimizations without public contract changes.                                                    |

---

## 3. Creating a Changeset

Run the interactive Changeset CLI command:

```bash
pnpm changeset
```

Follow the prompts:

1. Select the packages to include (e.g. `@banksia/domain-objects`).
2. Choose the bump classification (`major`, `minor`, or `patch`).
3. Provide a clear, concise summary of the change. Written summaries will be directly incorporated into `CHANGELOG.md` upon release.

---

## 4. Release Automation

1. When pull requests with changesets are merged into `main`, GitHub Actions creates or updates a release pull request (Version Packages).
2. Once the release PR is merged, the package is automatically built, versioned, tagged, and published to npm and JSR.
