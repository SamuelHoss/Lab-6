# Feature Specification: SplitSmart Expense Sharing

**Feature Branch**: `001-expense-sharing`

**Created**: 2026-10-28

**Status**: Draft

**Input**: User description: "Read UserRequirement.md in this workspace as the authoritative customer requirements. Write a testable SplitSmart feature specification: actors, user scenarios, functional and non-functional requirements, acceptance criteria, requirement IDs (FR-001, etc.), and open questions. Preserve all original customer features in the requirements inventory; label the Java Swing MVP subset separately. Do not write Java code. Do not edit UserRequirement.md."

## Clarifications

### Session 2026-10-28

- Q: Should SplitSmart's deliverable remain primarily web-based, be approved as a desktop-only Swing prototype instead, or include both a Swing MVP and a web-based product? → A: Both: deliver a Swing MVP prototype and a web-based product; Swing alone is not customer-compliant.
- Q: Must the person who paid for an expense also be one of the people sharing its cost, or can a group member pay on behalf of participants? → A: One group-member payer may be outside the participants; the payer is credited for the full amount and only selected participants receive cost shares.
- Q: How should a person become a group member, and what access should they have after leaving or being removed from a group? → A: Managers invite or add members; removal ends access to group details, while current members and managers retain group history.
- Q: What rules should SplitSmart use to reject invalid expense amounts, validate percentage totals, and distribute rounding leftovers when splitting money? → A: Require a positive amount in the currency's smallest unit, require percentages to total exactly 100%, and distribute leftover minor units by largest fractional share, breaking ties by participant order.
- Q: How should SplitSmart users sign in and recover access to their accounts? → A: Email address and password, with an email-based recovery flow.

## User Scenarios & Testing *(mandatory)*

### Actors

- **Account holder**: A person who signs in, manages their groups, records expenses and payments, and views their own expenses and balances.
- **Group manager**: An account holder who creates a group and manages its membership and expense-approval settings.
- **Expense participant**: A group member included in an expense; may review an expense and has a resulting share or balance.
- **Approver**: A member authorized by the group to review an expense before it affects balances. One person may have multiple roles.

### User Story 1 - Set up an account and group (Priority: P1)

As an account holder, I want my own account and a group of relevant people so that shared expenses and balances are associated with the right members.

**Why this priority**: Expense sharing needs identifiable users and a shared context.

**Independent Test**: Create two accounts, sign in as each, create a group, and verify that the manager can manage membership while unrelated accounts cannot access the group.

**Acceptance Scenarios**:

1. **Given** a person has no account, **When** they create an account and sign in, **Then** they can access their own SplitSmart information.
2. **Given** a signed-in account holder, **When** they create a group and add members, **Then** the group and its membership are visible to those members.
3. **Given** a user who is not a group member, **When** they try to view or change that group, **Then** access is denied and the group remains unchanged.

---

### User Story 2 - Record and review a shared expense (Priority: P1)

As a group member, I want to record an expense, select who participated and how it is split, and have it reviewed so that only approved expenses affect balances.

**Why this priority**: Recording and validating shared costs is the central group workflow.

**Independent Test**: Record one equal-split expense and one percentage-split expense, submit each for approval, and verify that only approved expenses affect member balances.

**Acceptance Scenarios**:

1. **Given** a group member and an active group, **When** they enter an amount, date, description, participants, split method, and optional receipt, **Then** the expense is saved for review.
2. **Given** an expense split equally among participants, **When** it is approved, **Then** each participant receives an equal share, subject to the documented currency-rounding rule.
3. **Given** an expense split by percentages, **When** valid percentages totaling 100% are submitted and the expense is approved, **Then** each participant is assigned their specified proportion.
4. **Given** an expense awaiting review, **When** an authorized approver approves it, **Then** it becomes approved and is included in balances.
5. **Given** an expense awaiting review, **When** an authorized approver rejects it, **Then** it is not included in balances and the submitter can see its rejected status.

---

### User Story 3 - Understand and settle balances (Priority: P1)

As a group member, I want to see amounts owed between members and record payments so that the group can track settlement accurately.

**Why this priority**: Users need a reliable outcome from approved expenses and recorded settlements.

**Independent Test**: Approve an expense with known participants and shares, verify each pairwise amount owed, record a payment, and verify the corresponding balance changes.

**Acceptance Scenarios**:

1. **Given** approved expenses, **When** a member views group balances, **Then** the system shows the amount each member owes each other member.
2. **Given** an expense still awaiting review, **When** a member views balances, **Then** that expense has not changed any balance.
3. **Given** an outstanding balance, **When** a member records a payment between the relevant members, **Then** the payment is reflected and the remaining balance is recalculated.
4. **Given** a recorded payment, **When** a group member reviews payment history, **Then** the payment's recorded amount and the resulting balance are shown. Payment eligibility and overpayment behavior remain open questions.

---

### User Story 4 - Receive updates and review activity (Priority: P2)

As a group member, I want to be notified of new expenses and review summaries so that I can keep up with group activity and understand spending over time.

**Why this priority**: Notifications and reports improve visibility but depend on the core expense and ledger records.

**Independent Test**: Create an expense as one member, verify other group members receive an update, and generate expense, balance, and payment summaries for a selected date range.

**Acceptance Scenarios**:

1. **Given** a member creates a group expense, **When** it is saved, **Then** other group members are notified that a new expense was created.
2. **Given** a member selects a date range and report parameters, **When** they request a report, **Then** the result includes matching expenses, balances, and payments and excludes records outside the selected range.
3. **Given** no matching records exist, **When** a report is requested, **Then** the system returns an empty result with a clear explanation rather than an incorrect total.

### Edge Cases

- An amount that is zero, negative, or cannot be represented in the selected currency's smallest unit MUST be rejected with a clear validation message; it MUST NOT be submitted for approval.
- A percentage split whose shares do not total exactly 100% MUST be rejected without creating a pending expense.
- When exact shares leave undistributed minor currency units, allocate them one at a time to participants in descending fractional-remainder order; break ties by the participant order recorded for the expense. The final allocations MUST sum exactly to the expense amount.
- Equal splits and percentage splits MUST NOT create balances with fractions smaller than the selected currency's smallest unit.

## Requirements *(mandatory)*

### Functional Requirements

The following inventory preserves the customer-requested capabilities in `UserRequirement.md`. Status in the MVP column describes the separately scoped Java Swing MVP, not a change to the customer requirement.

| ID | Customer requirement and testable acceptance criteria | Java Swing MVP disposition |
|---|---|---|
| **FR-001** | The system MUST let each person create an individual account, sign in with an email address and password, recover access through email, and access their own expense and balance information. **Acceptance**: A user can create an account, sign in, and recover access through email; a signed-in user can see their own information; a different account cannot see it without group authorization. | Included |
| **FR-002** | The system MUST let authorized users create and manage groups and their membership. **Acceptance**: A group manager can create a group, invite or add members, and remove members; a non-member cannot manage or view group details. After removal, former members lose group access while current members and managers retain historical records. | Included |
| **FR-003** | The system MUST let a group member record an expense with a positive amount in the selected currency's smallest unit, date, description, one group-member payer, split method, participants, and an optional receipt image. The payer may be outside the participants. **Acceptance**: A saved expense displays all entered fields, payer, and participants; zero, negative, or unrepresentable amounts are rejected; omitting the optional receipt does not prevent saving. The payer is credited for the full amount, their own share offsets that credit if they are also a participant, and only the other participants owe their shares. | Included |
| **FR-004** | The system MUST support equal and percentage-based expense splits among selected participants. **Acceptance**: Percentage shares must total exactly 100%; invalid totals are rejected. Any leftover minor currency units are allocated by descending fractional remainder, with ties resolved by recorded participant order, so shares sum exactly to the expense amount. | Included |
| **FR-005** | The system MUST support reviewing and approving expenses before they are included in balances, with a single or multiple approval levels configurable to the group's needs. **Acceptance**: Pending or rejected expenses do not affect balances; an expense affects balances only after all required approval levels approve it. | Included with one approval level; multiple levels deferred |
| **FR-006** | The system MUST notify other group members when a new group expense is created. **Acceptance**: For a created expense, each other group member receives a notification identifying the new expense. | Not included in MVP |
| **FR-007** | The system MUST track the balance owed by each user to every other user based on included expenses and payments. **Acceptance**: For a known set of approved expenses and payments, each displayed pairwise balance equals the net amount owed. | Included |
| **FR-008** | The system MUST let users record payments made to settle balances. **Acceptance**: When a payment is recorded, it appears in payment history and the corresponding balance reflects the recorded payment amount. Which users may record payments, partial payments, and overpayments remain open questions. | Included |
| **FR-009** | The system MUST provide reports and summaries of expenses, balances, and payments, with custom date ranges and other selected parameters. **Acceptance**: A report contains only records matching its selected range and parameters and identifies the requested expense, balance, and payment summaries. | Not included in MVP |

### Non-Functional Requirements

- **NFR-001 (Customer platform)**: The customer product MUST be primarily web-based. A desktop Swing MVP is a separate prototype and MUST NOT be represented as satisfying this requirement.
- **NFR-002 (Privacy and access)**: A user MUST only access personal information and group information for groups they belong to, subject to explicitly assigned group-management or approval permissions. Removed members lose access to group details; current members and managers retain historical records. Access-denial scenarios MUST leave protected data unchanged.
- **NFR-003 (Monetary accuracy)**: Expense shares, balances, and payment effects MUST use exact amounts in the selected currency's smallest unit; displayed and stored allocations MUST reconcile exactly to the expense total.
- **NFR-004 (Usability)**: In usability testing, at least 90% of first-time participants MUST be able to create an account, record an expense, and find their balance without assistance.
- **NFR-005 (Responsiveness)**: For an agreed representative dataset of up to 1,000 expenses in a group, at least 95% of report requests MUST complete within 5 seconds. This is a proposed target to validate with stakeholders.

### Java Swing MVP Scope (Implementation Decision)

This subsection is an implementation decision, not a customer requirement. The Java Swing desktop MVP is a separate prototype alongside the customer-requested web-based product and MUST NOT be represented as satisfying the web-platform requirement.

- **Included**: Accounts and sign-in; group creation and membership; expense entry with amount, date, description, participants, equal or percentage split, and optional receipt; a single approval level; pairwise balances; and payment recording.
- **Excluded from this MVP**: Notifications to other members and custom expense, balance, and payment reports.
- **Reduced for this MVP**: Approval is a single review level; configurable multi-level approval is deferred.
- **MVP exit condition**: The Swing prototype may be demonstrated as a desktop MVP, but the customer product is not compliant until the web-based product and all customer requirements are delivered or explicitly changed with stakeholder approval.

### Key Entities

- **User account**: A person's identity, email address, and sign-in credentials, associated with their own expenses and balances.
- **Group**: A shared expense context with members, management permissions, and approval settings.
- **Membership**: The association between a user and a group, including applicable role or permissions.
- **Expense**: A group's submitted cost, including amount, date, description, one group-member payer, participants, split method and shares, optional receipt, and approval status. The payer may be outside the participants.
- **Approval**: A review decision for an expense, associated with an authorized approver, decision, and time.
- **Balance**: The net amount owed between two users within the applicable group, calculated from approved expenses and recorded payments.
- **Payment**: A settlement record identifying payer, recipient, amount, date, and applicable group or balance.
- **Notification**: A message indicating that a group member created an expense.
- **Report**: A summary of expenses, balances, and payments filtered by date range and selected parameters.

### Open Questions

1. **Approval policy**: Who may approve an expense, may the expense creator approve their own submission, and what should happen when an expense is rejected or edited after submission?
2. **Supported currencies**: Which currencies and minor-unit scales must the product support?
3. **Additional account protection**: Is multi-factor authentication required in addition to email-and-password sign-in and email-based account recovery?
4. **Notifications and reports**: Which notification channels are required, and which report filters or export formats are needed beyond date range and user-selected parameters?
5. **Settlement behavior**: Can users make partial payments, who may record a payment, and should overpayments ever be allowed?
6. **Account lifecycle**: What personal records remain available after a user's group memberships end?
7. **Target workload**: Confirm whether the proposed report responsiveness target and representative dataset are appropriate for expected usage?

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a usability test, at least 90% of first-time participants complete account setup, create a group expense, and find their resulting balance without assistance.
- **SC-002**: For a test set of at least 100 expenses covering equal and percentage splits, 100% of approved expense allocations reconcile to their totals in the selected currency's smallest unit, using the specified remainder-allocation rule.
- **SC-003**: In 100% of test cases, pending and rejected expenses cause no balance change, and approved expenses and recorded payments produce the expected pairwise balances.
- **SC-004**: At least 95% of report requests for the agreed representative dataset of up to 1,000 group expenses complete within 5 seconds.
- **SC-005**: For every created expense, each other group member receives a notification identifying the expense.
- **SC-006**: Every customer capability in FR-001 through FR-009 has at least one passing acceptance test before the complete customer-requested feature is declared ready.

## Assumptions

- A person has one account, signs in with an email address and password, and recovers access through email; group access is granted through explicit membership.
- A group has at least one manager, who invites or adds and removes members and configures its approval policy. Removed members lose access to group details; current members and managers retain group history.
- Each expense has one payer who is a group member and may or may not be a participant. The payer is credited for the full amount paid; if the payer is also a participant, their own share offsets that credit.
- Percentage shares must total exactly 100% before an expense can be submitted. Remainder minor units go to the largest fractional shares, with ties broken by participant order recorded on the expense.
- An expense is excluded from balances while pending or rejected and included only after all configured approvals are complete.
- A payment records an actual settlement between two users; the application records it but does not itself transfer money.
- The Java Swing MVP is a deliberately bounded desktop implementation subset. Its account, group, and expense behavior must still be demonstrated for multiple user identities, but this specification does not assume a particular deployment or storage design.
- Multi-factor authentication, supported currencies, notification channel, detailed report filters, payment settlement, approval policy, account-history lifecycle, and target workload remain subject to the open questions above.
