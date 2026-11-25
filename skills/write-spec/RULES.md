# When to write a spec

Check each rule against the change. A rule fires when at least one of its conditions is true.

| Write | Conditions |
|---|---|
| `proposal.md` + `spec.md` | The change touches more than one repo. The change alters a public API, a contract another service reads, a data model or a migration. Another person must review or implement it. |
| `design.md` | The spec rule fires, **and** at least one of these is true: there are two or more real technical options; the change needs a migration or a rollout order. |
| Nothing | No rule fires. The ticket is enough. |

Record in the feature `README.md` which rule fired and which condition made it fire, in one line under **Notes**. When no rule fires, record that too.
