# Validation Quickstart: SplitSmart Expense Sharing

This guide describes acceptance validation for the planned feature. The
repository currently has no application source tree or Maven project, so the
commands below cannot be run until implementation and project setup exist.
No tests or builds are claimed to have run.

## Prerequisites

- The Java 21/Maven project and its JUnit 5 test configuration have been
  established.
- A test environment can create multiple user accounts, groups, expenses,
  approvals, and payments.
- Test cases use a selected currency and its smallest unit; the supported
  currency set remains an open question.

## Build and test

From the Maven project root, run:

```text
mvn test
```

Expected result: Java unit and integration tests pass, including the
business-rule cases below. This command is a future validation instruction;
there is currently no `pom.xml`.

## Acceptance scenarios

1. **Account privacy**: Create two accounts. Sign in as one and verify that
   only authorized group data is visible to the other.
2. **Membership lifecycle**: Create a group as its manager, add a second
   member, then remove that member. Verify former-member access is revoked and
   current members/managers retain group history.
3. **Payer distinct from participants**: Create an expense whose group-member
   payer is not a participant. Approve it and verify that the payer is credited
   for the full amount and only selected participants incur shares.
4. **Exact allocation**: Test equal and percentage splits that produce
   fractional minor units. Verify percentage total validation, largest
   fractional remainder ordering, participant-order tie-breaking, and exact
   reconciliation to the expense total.
5. **Approval effect**: Verify pending and rejected expenses leave balances
   unchanged; after required approval, verify balances change by the expected
   allocations.
6. **Payment effect**: Record a settlement and verify payment history and
   pairwise balances. Add cases for partial payments and overpayments only
   after their policies are clarified.
7. **Notification and reports**: Verify all other group members receive a
   notification on expense creation and that date-range report results include
   only matching authorized records.
8. **Workload**: Once the target dataset and NFR-005 are confirmed, measure
   report completion time for the agreed group size and workload.

## Review gate

Before customer-compliance claims, verify the web-based product implements
FR-001–FR-009. The Swing MVP is a separate prototype. Human review of
AI-generated implementation and design artifacts is required by the
Constitution.
