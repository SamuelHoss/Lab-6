# Implementation Plan: SplitSmart Expense Sharing

**Branch**: `001-expense-sharing` | **Date**: 2026-11-05 | **Spec**: [spec.md](./spec.md)

**Input**: Clarified feature specification in `specs/001-expense-sharing/spec.md`

## Summary

Design SplitSmart around shared expense and balance rules used by a web-based
customer product and a separate Java Swing MVP prototype. Keep presentation
separate from business logic; allow an expense payer to be outside its
participants; apply exact currency-minor-unit split rules; and include an
expense in balances only after its configured approvals. The specification's
unresolved policy and platform details remain explicit rather than being
silently decided here.

## Technical Context

**Language/Version**: Java 21 for Java application components. Browser-client language/version is not specified.

**Primary Dependencies**: Maven for Java builds and dependency management; JUnit 5 for Java tests; Java Swing for the desktop prototype. No web framework or other library has been selected.

**Storage**: Persistent storage is required for accounts, groups, expenses, approvals, payments, and notification records. The storage technology and deployment topology are not specified.

**Testing**: JUnit 5 for Java unit and integration tests. Acceptance tests must cover the clarified scenarios on both product surfaces where applicable; a browser-testing tool is not selected.

**Target Platform**: A primarily web-based customer product plus a separate Java Swing desktop MVP prototype.

**Project Type**: Shared expense-management business capabilities with web and desktop presentation surfaces. The Java project uses Java 21 and Maven.

**Performance Goals**: Proposed target: at least 95% of reports for up to 1,000 expenses in a group complete within 5 seconds (NFR-005); specification notes this target needs stakeholder confirmation.

**Constraints**: Preserve customer scope and traceability; Swing is only a separate MVP prototype, not a substitute for the web product (NFR-001); isolate UI from business logic; represent money exactly and reconcile allocations (NFR-003); support multi-user group access controls (NFR-002); use JUnit 5, PlantUML, and human review for AI-generated work per the Constitution.

**Scale/Scope**: Requirements cover individual accounts, groups, expense entry and approval, pairwise balances, payments, notifications, and reports (FR-001–FR-009). No production user-count, group-count, or deployment scale is defined.

## Constitution Check

| Principle or constraint | Gate | Design response |
|---|---|---|
| Java 21 and Maven | Pass for Java components | Use Java 21 and Maven for Java application components; do not infer a browser technology. |
| Java Swing user interface | Pass for desktop prototype only | Provide a Swing presentation surface for the MVP; keep it distinct from the web customer product. |
| Object-oriented design | Pass | Separate cohesive domain, application, and presentation responsibilities without adding abstractions without need. |
| GUI/business-logic separation | Pass | Business rules are UI-independent and shared through application-facing operations. |
| Exact monetary values | Pass | Java monetary values use `BigDecimal`; allocations are in currency minor units, with the specified largest-remainder and participant-order tie-break rule. |
| JUnit 5 | Pass | Java business-rule and application tests use JUnit 5; GUI tests cover boundaries without placing domain rules in Swing. |
| PlantUML | Pass | Maintain PlantUML component and workflow diagrams alongside the design as boundaries and workflows are established. |
| Traceability and human review | Pass | Map design to FR/NFR IDs and require human review of AI-generated artifacts. |
| Customer platform and scope | Pass with explicit separation | The customer product remains web-based; the Swing application is a prototype and cannot satisfy NFR-001 by itself. |

No constitutional exception is proposed. Exact browser, service, and persistence
technologies remain undecided because the source documents do not specify them.

## Architecture and Design

### Logical components

1. **Presentation surfaces**: A web-based customer interface and a separate
   Java Swing desktop MVP. Both present account, group, expense, approval,
   balance, and payment workflows according to their respective scope. The
   web-client technology and the integration boundary between either client
   and application services remain open.
2. **Application services**: Coordinate account access, group membership,
   expense submission, approval, payment recording, balance queries,
   notifications, and reports. They enforce authorization at each operation.
3. **Domain model and rules**: Define users, groups, expenses, split
   allocations, approvals, payments, and balance calculations independent of
   either UI.
4. **Persistence boundary**: Store and retrieve the data needed by the
   application services. Its implementation and deployment are intentionally
   undecided.
5. **Notification and reporting capabilities**: Build notifications for
   group members when an expense is created and assemble reports from expense,
   balance, and payment records. Delivery channels and exact report filters
   remain open.

### Core workflows

- **Account and group**: A user creates an account, signs in with email and
  password, and recovers access by email. A manager creates a group and invites
  or adds members. Removal revokes the former member's group access while
  current members and managers retain group history.
- **Expense and approval**: A member submits an expense with one group-member
  payer, participants, amount, date, description, split method, and optional
  receipt. Validate the amount and split before saving. Create the required
  expense-created notifications. Mark the expense pending until its configured
  approvals are complete; pending and rejected expenses do not affect
  balances. The Java Swing MVP uses one approval level; the full product's
  approval policy remains subject to the open questions in the spec.
- **Allocation**: Reject non-positive amounts and amounts not representable in
  the selected currency's smallest unit. Percentage shares must total exactly
  100%. Allocate indivisible minor units by descending fractional remainder,
  breaking ties by recorded participant order, so the participant allocations
  equal the expense total.
- **Balance and settlement**: An approved expense credits its payer for the
  full amount and assigns cost shares to selected participants. If the payer
  participates, their own share offsets their credit; if not, only the
  participants incur shares. Pairwise balances are derived from approved
  expense allocations and recorded payments. Payment eligibility, partial
  payments, and overpayments remain unresolved.
- **Notification and reporting**: Notify all other group members when an
  expense is created (FR-006). Generate summaries of expenses, balances, and
  payments filtered by the requested date range and parameters (FR-009).
  Notification channel, report filters beyond those specified, and export
  format are not selected.

### Authorization and errors

Each operation is authorized against the signed-in user and group membership;
non-members cannot view or manage a group's details. Removing a member revokes
their group access. Reject invalid expense amounts and percentages with a
clear validation result and do not submit the invalid expense. Approval
rejection leaves balances unchanged. Do not silently convert payment or
allocation amounts. The exact account-protection measures beyond email and
password, detailed approval permissions, and rejected-expense edit behavior
remain open questions.

### Design limitations

The spec leaves open supported currencies, multi-factor authentication,
approval permissions and rejection/edit behavior, notification channels,
report options, payment settlement policy, account-history lifecycle, and
target workload. These decisions may affect the detailed design and must not
be treated as settled by this plan.

## Project Structure

The repository currently has no application source tree. The following is a
logical target structure, not a claim that these source files already exist:

```text
specs/001-expense-sharing/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── diagrams/       # PlantUML component and workflow sources
└── contracts/
    └── user-workflows.md

Java application (to be established):
├── domain/          # UI-independent expense, approval, and balance rules
├── application/    # use-case coordination and authorization
├── desktop-swing/   # separate Java Swing MVP presentation
└── tests/           # JUnit 5 domain and application verification

Web customer product:
└── Client technology, Java service boundary, and deployment structure TBD
```

**Structure Decision**: Keep domain rules and application operations separate
from Swing, consistent with the Constitution. The eventual web-client and
service structure cannot be made concrete until the web stack, hosting, and
client/service boundary are chosen. Do not treat this logical outline as a
commitment to a particular web framework, database, or deployment.

## Complexity Tracking

No constitutional violations or extra projects are proposed. A separate web
surface and Swing prototype are both required by the clarified feature scope;
their actual process and deployment boundaries remain design decisions pending
the unspecified web technology and architecture.
