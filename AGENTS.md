# AI coding instructions

## Verify failure paths for new code

When adding or changing asynchronous UI code, do not validate only the happy path. For every user-visible failure path:

- Confirm the backend or service returns the expected failure status and payload.
- Confirm the component updates change detection/state so the error is actually rendered in the browser.
- Verify the rendered error through its accessible UI contract, such as `role="alert"`, visible text, or an equivalent semantic locator.
- Verify that user-entered values and other required form state are preserved or reset according to the intended behavior.
- Add or update an automated test covering the failure path, and run the targeted test plus the relevant full suite.

If a required check cannot run, report the exact command and blocking failure instead of treating the change as fully verified.
