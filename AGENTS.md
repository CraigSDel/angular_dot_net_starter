# AI coding instructions

## Error handling and failure-path verification

When adding or changing asynchronous UI code, do not validate only the happy path. For every user-visible failure path:

- Confirm the backend or service returns the expected failure status and payload.
- Confirm the component updates its error state and explicitly participates in change detection when the asynchronous callback is not otherwise guaranteed to render the update.
- Verify the rendered error through its accessible UI contract, such as `role="alert"`, visible text, or an equivalent semantic locator.
- Verify that user-entered values and other required form state are preserved or reset according to the intended behavior.
- Add or update an automated test covering the failure path, and run the targeted test plus the relevant full suite.

For API-backed failure handling:

- Keep the HTTP status, problem payload, component error mapping, and accessible browser message aligned.
- Test both the service/API contract and the user-visible result when the failure is part of the UI behavior.
- Preserve the unaffected table/list data and form state unless the intended behavior explicitly resets them.

For verification:

- Run the focused regression first, then the relevant frontend/backend full suites, lint, and build checks.
- Use an isolated test database and a known test-server URL when running browser tests manually; clean up temporary server processes and test data afterward.
- Treat test-server startup, network, socket, browser, and dependency failures as environment blockers—not passing tests or product failures. Diagnose where practical and report the exact command and blocking error.
- If a required check cannot run or completes only partially, report the exact command, result, and scope of what was or was not verified instead of treating the change as fully verified.
