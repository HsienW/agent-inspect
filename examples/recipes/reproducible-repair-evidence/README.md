# Reproducible repair evidence

This recipe packages a failed synthetic trace together with caller-owned repository and validation context as Evidence v2. It uses the public `agent-inspect/advanced` API, performs no network I/O, and needs no API key.

## What this demonstrates

Two repository revisions can produce the same structural failure trajectory while a proposed patch only applies in one checkout. A normal Evidence bundle can be internally valid in either case. This recipe packages the repository revision, validation procedure, proposed patch, and recorded check output so the Evidence manifest integrity-binds the exact repair context to the trace.

`reproduction.json` is an illustrative, recipe-owned envelope. It is not an AgentInspect persisted schema, public interface, or canonical repair manifest format.

## Why bundle integrity alone is insufficient

Integrity verification confirms that the packaged files match `evidence.json`. It does not checkout the repository revision, recreate a dirty working tree, apply `repair.patch`, execute the recorded validation command, or certify replay or repair correctness.

The executable assertion keeps the failed trace unchanged while replacing only the synthetic repository commit in memory. The failed trace hash remains the same, while the `reproduction.json` hash and serialized Evidence manifest change.

## How to run

From the repository root:

```bash
pnpm build
pnpm --filter agent-inspect-recipe-reproducible-repair-evidence start
```

## Expected output

```text
Reproducible repair evidence: pass
Run: repair-example-run
Files checked: 4
Bound artifacts: check-output.txt, failed-trace.jsonl, repair.patch, reproduction.json
Revision binding: pass
Environment allowlist: 0 variables
Replay executed: no
Evidence directory: .generated-evidence
```

## Artifacts

The generated `.generated-evidence/` directory contains:

- `failed-trace.jsonl`: the fixed failed synthetic trajectory.
- `reproduction.json`: caller-owned repository, validation, toolchain, lockfile, environment, and sandbox context.
- `repair.patch`: a fixed synthetic unified diff.
- `check-output.txt`: recorded synthetic validation output; the recipe does not execute the command.
- `evidence.json`: the Evidence v2 manifest that hashes the four artifacts.

All paths inside the fixtures are relative. Fixed timestamps, IDs, versions, bytes, and file ordering keep the generated manifest deterministic.

## Reproduction envelope

The fixture records a synthetic commit, clean working-tree flag, exact command and arguments, relative working directory, exit code, timeout, fixed toolchain versions, and synthetic lockfile hash. A real repair harness can add its own bounded dirty-tree digest when the dirty state materially affects reproduction; this recipe deliberately does not define such a digest algorithm.

## Environment allowlist

This synthetic recipe allowlists no environment variables:

```json
{
  "allowlist": [],
  "values": {}
}
```

Real harnesses should record only variables that materially affect reproduction. The allowlist must be explicit: never capture `process.env` wholesale, `PATH`, home-directory variables, tokens, or provider keys.

## Revision-A / revision-B walkthrough

The committed `reproduction.json` represents revision A. The recipe clones it in memory, substitutes a second fixed synthetic commit for revision B, and builds a second manifest without writing another Evidence directory. It asserts that the trace hash is identical and the reproduction artifact hash differs. This proves revision binding, not patch applicability.

## Integrity verification walkthrough

The recipe calls `verifyEvidenceDirectory(...)` programmatically. From this recipe directory, the generated directory can also be checked with the existing CLI:

```bash
npx agent-inspect bundle verify ./.generated-evidence
```

This verifies the manifest shape, listed-file presence, hashes, and Evidence provenance fields. `bundle verify` does not replay the repair.

## Patch-digest-only variant

This example packages `repair.patch`. When packaging the patch itself is inappropriate, a harness can instead put a caller-owned patch digest in `reproduction.json`. AgentInspect will integrity-bind that file but does not define or validate patch semantics.

## Sandbox/container metadata

`sandbox` is `null` because this synthetic fixture uses no container. When execution depends on a sandbox, callers can record bounded metadata such as:

```json
{
  "sandbox": {
    "containerImageDigest": "sha256:00131015cd6b7056cb5a327581fb48ebc9aef1f1f6384f2a440a59cca1348bcf",
    "resourceLimits": {
      "cpu": 2,
      "memoryBytes": 2147483648
    }
  }
}
```

This remains caller-owned metadata; AgentInspect does not inspect the host or validate the container digest.

## What this does not prove

The recipe does not checkout a revision, snapshot a repository, reconstruct dirty state, apply a patch, install packages, run the recorded command, create a sandbox, upload Evidence, or claim that a repair is correct or replayable.

## Windows notes

The recipe uses Node.js APIs and `import.meta.url`; it requires no Bash, `chmod`, Docker, shell pipeline, or Unix temporary path. `.gitattributes` pins every hashed fixture to LF so Evidence hashes remain stable across platforms.
