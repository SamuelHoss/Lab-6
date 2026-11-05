# User Workflow Contracts

These are user-visible behavior contracts for the web product and the separate
Swing MVP. They are not network/API contracts; no external protocol is
specified.

## Shared account and group behavior

- A person can create an account, sign in with email and password, and recover
  access through email (FR-001).
- A group manager can create a group, invite or add members, and remove
  members (FR-002).
- A non-member cannot view group details or make group changes. Removing a
  member revokes their access; current members and managers retain group
  history (FR-002, NFR-002).

## Expense creation and approval

- The submitter supplies an amount, date, description, one group-member payer,
  at least the intended expense participants, split method, and an optional
  receipt (FR-003).
- The payer may be outside the participants. The payer is credited for the
  full paid amount; selected participants bear their specified shares.
- Zero, negative, or currency-unrepresentable expense amounts are rejected
  without creating a pending expense.
- Percentage shares must total exactly 100%; invalid totals are rejected
  without creating a pending expense (FR-004).
- Equal and percentage allocations reconcile exactly to the expense amount.
  Leftover minor units go by descending fractional remainder, then recorded
  participant order.
- A submitted expense waits for the group's required approval(s). Pending and
  rejected expenses do not change balances; approved expenses do (FR-005).
- Other group members receive an expense-created notification (FR-006).
  Delivery channel and timing are not specified.

## Balances, payments, and reporting

- A member can view the net amount owed between users in a group based on
  approved expenses and recorded payments (FR-007).
- Recording a payment adds it to payment history and updates the related net
  balance (FR-008). The allowed recorder, partial payments, and overpayment
  behavior remain open.
- Reports summarize expenses, balances, and payments for a selected date range
  and parameters (FR-009). Additional filters and export formats remain open.
- An empty report result is clearly identified and is not presented as a
  non-zero total.

## Surface-specific scope

- The **web-based product** is required for customer compliance (NFR-001) and
  includes the complete customer feature inventory FR-001–FR-009.
- The **Java Swing MVP prototype** is separate and includes accounts/groups,
  expense entry and splitting, one approval level, pairwise balances, and
  payment recording. Notifications and reports are out of MVP; configurable
  multi-level approval is deferred.
- Swing behavior does not imply that the web-based product requirement has
  been met.
