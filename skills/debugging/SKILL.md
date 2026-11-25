---
name: debugging
description: Find the root cause of a bug, failing test, build failure, crash, flaky behavior, or performance regression before changing any code. Reproduce it, isolate it, form a hypothesis, prove it, then fix it with a regression test. Use whenever something behaves unexpectedly, a test fails, or an error appears, or when the user says "this is broken", "why does X happen", or "fix this bug". Use it even when the fix seems obvious.
---

# Debugging

A fix without a known cause is a guess that happened to pass. Guesses compound, because each one adds a change nobody can explain. Find the cause first. The fix is usually small after that.

## 1. Reproduce

- Read the full error and stack trace. Note the exact message, the `file:line`, and the inputs.
- Make it happen on demand. A failing automated test is best; a minimal script will do. Record the exact command.
- If you can't reproduce it, don't fix anything yet. Gather more evidence (logs, environment differences, inputs, timing) and report what you tried.

## 2. Isolate

Narrow down where it breaks, trying the cheapest technique first:

- **What changed?** Check `git log` and `git diff` since it last worked. Use `git bisect` if you know a good commit.
- **Compare with something similar that works.** List every difference, however small.
- **Trace backwards** from the symptom to where the bad value originates. Fix it at the origin, not where it surfaces.
- **Instrument the boundaries** in multi-component flows. Log what enters and leaves each layer, run once, and see which layer breaks.
- **Shrink the input** until only the minimal failing case remains.

## 3. Hypothesize and test

State one hypothesis: "X causes this because Y; if that's true, Z will happen." Then test it with the smallest possible experiment, changing one variable at a time.

- **Confirmed:** go to the fix.
- **Refuted:** that's useful information. Form a new hypothesis.
- **Never stack fixes.** Undo a failed attempt before you try the next one.

Keep a short log as you go: hypothesis → experiment → result. It stops you going in circles, and it goes into the final report.

## 4. Fix

1. Take the failing test from step 1 and confirm it fails *for the right reason*.
2. Make a single fix that addresses the root cause. Don't bundle in refactors or "while I'm here" changes.
3. Check that the test now passes, then run the surrounding suite to confirm nothing else broke.
4. Remove any temporary instrumentation.

## Stop signals

- **Two hypotheses have failed and you're starting to guess:** step back, re-read the evidence, and widen the search.
- **Three fixes have failed, or each fix reveals a new problem somewhere else:** the problem is probably structural (coupling, shared state, the wrong abstraction). Stop and discuss it with the human before trying a fourth fix.
- **The cause is genuinely environmental or external** (network, timing, a third party): document what you ruled out. Then handle it explicitly with a retry, a timeout, or a clear error, and add logging so the next occurrence can be diagnosed.

## Report

Include:

- **Root cause**: one or two sentences, with `file:line`
- **Proof**: how you showed this was the cause
- **Fix and regression test**
- **Ruled out / still uncertain**
