# Architecture & Design Cross-Check

**Project:** SplitSmart Expense Sharing (CIS 285 Lab 6)  
**Compared:** SpecKit architecture/design artifacts and GitHub Copilot architecture/design against the project Constitution and clarified Specification.  
**Review scope:** Repository documents on `master`; this is a document-level review, not an implementation or test audit.

## Executive summary

Both designs are directionally sound and broadly consistent with the Constitution and clarified Specification. The Copilot document is the stronger detailed design narrative: it gives clearer component responsibilities, workflows, authorization/error outcomes, and testing coverage. The SpecKit artifacts are stronger as the concise, structured planning set, with canonical supporting data-model, research, and PlantUML files.

No confirmed critical design defect was identified in the documents reviewed. The design should be treated as **ready after the corrections and clarifications below**, rather than as a complete implementation blueprint.

## Baseline and scope constraints

The Constitution establishes Java 21/Maven, a Java Swing implementation, cohesive object-oriented design, separation of UI and business logic, `BigDecimal` money calculations with explicit scale/rounding, JUnit 5 testing, and maintained PlantUML diagrams. It also states that AI-generated material is a draft subject to human review.

The clarified Specification distinguishes the customer-facing web product from a separate Swing MVP. A Swing-only implementation does not satisfy the full web-product requirement; any change to that scope/platform needs stakeholder approval. The Swing MVP covers core account/group/expense/split/approval, balance, and payment-recording capabilities, while notifications and reports remain in the full customer scope.

Important specification rules include: the payer may be outside the participants and receives full payer credit; only participants receive expense shares; pending or rejected expenses do not affect balances; money allocations reconcile exactly to the currency's minor unit; percentage shares total exactly 100%; and remainder units use descending fractional remainder with participant order as the tie-breaker.

## Findings

### 1. Clarify the persistence boundary in the SpecKit component diagram

The SpecKit component diagram currently shows Domain Rules connecting directly to Persistent Records. That line blurs the intended separation between domain logic, application orchestration/authorization, and persistence. The prose and Copilot design describe a cleaner boundary.

**Recommendation:** Have application services coordinate domain operations and persistence through repository/persistence ports. Keep domain rules independent of storage and Swing. Update the PlantUML diagram so it communicates the same boundary as the written design.

### 2. Specify notification failure and transaction behavior

The lifecycle diagram shows notification work branching from expense submission. The documents do not fully define what happens if notification delivery fails after an expense has been persisted.

**Recommendation:** Make the state transition durable first (for example, save the pending expense), then dispatch notifications. Define how delivery failure is surfaced and retried. Do not imply that a notification failure rolls back the expense unless that behavior is explicitly required.

### 3. Resolve pairwise balance/netting semantics

The design derives pairwise balances from approved allocations and recorded payments, but the netting rule is unclear when multiple people have paid or reciprocal obligations exist. Different reasonable algorithms can produce different “who pays whom” results.

**Recommendation:** Record this as a stakeholder decision before implementing settlement recommendations. Avoid choosing a netting algorithm silently. Preserve the distinction between derived balances and recorded payments.

### 4. Make equal-split remainder handling explicit

The specification defines deterministic minor-unit allocation, especially for percentage splits. The SpecKit design should also explicitly state how equal splits distribute indivisible minor units.

**Recommendation:** Document the deterministic tie-break rule (participant order) and add tests for uneven divisions, including cases where the payer is not a participant. Verify that all allocated shares sum exactly to the expense amount.

## Additional consistency observations

- Component naming differs somewhat between the artifacts (for example, notifications/reports as components versus application capabilities). Choose consistent names or clearly describe the boundary between services and capabilities.
- The Copilot design has more explicit error and authorization outcomes. Carry these into the canonical design where useful, especially the rule that denied operations leave data unchanged.
- Acceptance verification and requirement traceability are not equally explicit across the documents. Maintain a traceability matrix linking each FR/NFR to design elements and tests.
- Keep the PlantUML diagrams synchronized with the prose. Avoid letting duplicate documents become competing sources of truth; identify the canonical artifact for each design decision.

## Recommended combined approach

Use the SpecKit plan and project artifacts as the canonical repository structure. Incorporate the Copilot document's useful detail on component responsibilities, workflows, authorization/error handling, and tests. Keep the source Specification unchanged unless a stakeholder approves a scope clarification.

Before treating the design as implementation-ready:

1. Correct the persistence boundary in the component diagram.
2. Define notification persistence, failure visibility, and retry behavior.
3. Document deterministic equal-split remainder allocation and add reconciliation tests.
4. Obtain a stakeholder decision on pairwise balance netting.
5. Reconcile the diagrams and prose and add requirement-to-test traceability.

## Open decisions to track

- Pairwise balance netting and settlement recommendations.
- Approval policy, including self-approval, multiple approvers, rejection, and editing/resubmission.
- Supported currencies and minor-unit rules.
- Payment permissions, partial payments, and overpayments.
- Notification channel and delivery-failure handling.
- Report filters/export behavior and confirmation of the proposed performance target.
- Account lifecycle and whether MFA is required.
- Workload/scope confirmation for the full customer-facing web product versus the Swing MVP.

## Review limitations

This review covers repository documentation on `master` only. No application source code, build, automated tests, performance tests, usability tests, or SpecKit commands were run. The review does not claim that implementation acceptance criteria have passed or guarantee an instructor's grading decision.
