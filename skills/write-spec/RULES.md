# When to write stages 01–03

Check each rule against the change. A rule fires when at least one of its conditions is true.

| Write | Conditions |
|---|---|
| 01 intake + 02 requirements | The change touches more than one repo. The change alters a public API, a contract another service reads, a data model or a migration. Another person must review or implement it. |
| 03 design | The requirements rule fires, **and** at least one of these is true: there are two or more real technical options; the change needs a migration or a rollout order. |
| Nothing | No rule fires. The goal in the README hub and the plan are enough. |

Record the result in `state.yaml`: the stages written, and under `skipped` the reason for each stage not written (which rule did not fire).
