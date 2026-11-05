# Research: SplitSmart Expense Sharing

**Date**: 2026-11-05  
**Sources reviewed**: `.specify/memory/constitution.md` and `specs/001-expense-sharing/spec.md`

This research resolves design questions that can be answered from the governing
documents. It does not choose technologies or fill in customer policy decisions
that the specification leaves open.

## Decisions

### Separate presentation from business rules

- **Decision**: Model domain rules and application operations independently
  from both the web customer product and Swing prototype.
- **Rationale**: The Constitution requires UI/business-logic separation and
  the specification requires both product surfaces with a shared expense
  behavior.
- **Alternatives considered**: Put expense calculations in each UI; rejected
  because it duplicates rules and risks inconsistent balances.

### Derive balances from approved expenses and recorded payments

- **Decision**: Treat approved expense allocations and payments as the inputs
  to pairwise balance queries; pending or rejected expenses are excluded.
- **Rationale**: FR-007 and FR-008 require balances to reflect expenses and
  payments, while FR-005 and SC-003 require pending and rejected expenses to
  leave balances unchanged.
- **Alternatives considered**: Include pending expenses optimistically; rejected
  because it contradicts FR-005 and the acceptance scenarios.

### Preserve the explicit payer and participant distinction

- **Decision**: Store one group-member payer separately from the set of expense
  participants. The payer may be a nonparticipant.
- **Rationale**: The clarification explicitly allows that distinction and says
  the payer is credited for the full paid amount while selected participants
  receive cost shares.
- **Alternatives considered**: Require the payer to be a participant; rejected
  because it contradicts the recorded clarification.

### Apply deterministic minor-unit allocation

- **Decision**: Validate that percentage shares total exactly 100%, calculate
  shares at the selected currency's minor-unit scale, and distribute leftover
  minor units by descending fractional remainder with recorded participant
  order as the tie-break.
- **Rationale**: This is the confirmed clarification and supports exact
  reconciliation required by the Constitution and NFR-003.
- **Alternatives considered**: Round every share independently or assign the
  remainder to the payer; rejected because they are not the confirmed rule.

### Keep the two product surfaces distinct

- **Decision**: The web-based product is the customer deliverable; the Java
  Swing application is a separate MVP prototype, not a substitute.
- **Rationale**: The user selected both, and NFR-001 retains the customer's
  primary web-platform requirement.
- **Alternatives considered**: Treat Swing alone as customer-compliant;
  rejected because the Constitution and NFR-001 explicitly prohibit it.

## Unresolved design inputs

No evidence in the source documents selects a web framework, a network
protocol, a database, storage/deployment topology, supported currencies,
notification delivery channel, report export format, multi-factor
authentication, approver permissions, post-rejection/edit behavior, payment
eligibility, partial/overpayment behavior, account-history lifecycle, or
confirmed workload target. These remain open questions, not research decisions.

## Scope of research

No application source tree, build manifest, database schema, or existing design
convention was present to establish technical precedent. No external
technology or dependency was selected. Java 21, Maven, Java Swing, JUnit 5,
PlantUML, `BigDecimal`, and human review are taken only from the Constitution.
