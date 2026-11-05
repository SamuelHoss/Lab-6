# Data Model: SplitSmart Expense Sharing

This is a conceptual model derived from the clarified requirements; it does not
select a database, persistence format, or deployment technology.

## Entities

| Entity | Key information | Relationships and rules |
|---|---|---|
| **User account** | Stable account identifier, email address, credential reference, account status | A person has one account. Email and password are used to sign in; access recovery is by email (FR-001). Credential handling details are not specified. |
| **Group** | Stable group identifier, name, manager, approval policy | Has members, expenses, and group history. A manager can invite/add and remove members (FR-002). |
| **Membership** | Group, user, role/permissions, membership state | Connects a user to a group. Removed members lose group access; current members and managers retain historical records (FR-002, NFR-002). |
| **Expense** | Stable expense identifier, group, creator, payer, amount, currency, date, description, split method, approval state, optional receipt reference | Belongs to one group and has one group-member payer. The payer may be outside the participant set (FR-003). Pending and rejected expenses do not affect balances (FR-005, SC-003). |
| **Expense participant allocation** | Expense, participant user, percentage when applicable, final amount in minor units, participant order | A participant must be a member of the expense's group. Equal or percentage splits produce allocations that sum exactly to the expense total (FR-004, NFR-003). |
| **Approval decision** | Expense, approver, decision, time, optional decision details | Records the review of an expense. The group policy determines required approval levels. Approver permissions, self-approval, and post-decision edits remain open (FR-005). |
| **Payment** | Stable payment identifier, group, payer, recipient, amount, currency, date, recorder | A recorded settlement contributes to the net balance (FR-007, FR-008). Who may record, partial payment, and overpayment behavior remain open. |
| **Notification** | Stable notification identifier, group, expense, recipient, creation state/time | Indicates that a group member created an expense and is made available to other group members (FR-006). Delivery channel and retention are unspecified. |
| **Report request/result** | Requesting user, group, date range, selected parameters; matching expense, balance, and payment summaries | A query/result over authorized group records, not an authoritative ledger entity (FR-009). Detailed filters and export formats remain open. |
| **Pairwise balance** | Group, debtor, creditor, net amount in minor units | Derived from approved expense allocations and recorded payments. It is not authoritative independently of those source records (FR-007). |

## Monetary and allocation rules

- Java monetary values use `BigDecimal` as required by Constitution principle V.
- Each expense has a positive amount representable in the selected currency's
  smallest unit. Supported currencies and their scales remain to be confirmed.
- Percentage splits must total exactly 100%.
- Allocate indivisible minor units by descending fractional remainder; break
  ties by participant order stored for that expense.
- The sum of participant allocations must equal the expense total exactly.
- The payer is credited for the full expense amount. Each participant incurs
  their allocated share; if the payer is also a participant, that share offsets
  the payer's credit.
- Pending and rejected expense records are excluded from pairwise balances.
  Approved expenses and recorded payments determine the displayed net.

## Expense lifecycle

```text
Submitted -> Pending review -> Approved
                         \-> Rejected
```

An expense affects balances only after the required approval policy is
satisfied. The Swing MVP has one approval level; the customer product may need
multiple levels according to group policy. Editing or resubmitting rejected
or approved expenses is not specified and must be decided before finalizing
the lifecycle.

## Identity, access, and retention

- Account identifiers, group identifiers, and expense identifiers must
  distinguish records within their respective scopes.
- Only group members with the applicable permission may view group information
  or perform group operations.
- Removing a member revokes access to group details; current members and
  managers retain history.
- Uniqueness beyond the sign-in email, deletion/retention periods, and
  visibility of a former member's own personal records are not specified.
