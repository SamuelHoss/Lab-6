# Reconciliation Instructions: Final Requirements, Architecture, Data, and UML

**Project:** SplitSmart Expense Sharing — CIS 285 Lab 6  
**Purpose:** Reconcile the existing SpecKit and GitHub Copilot outputs into one consistent, reviewable final requirements-and-design baseline.  
**Status:** Instructions for the next reconciliation pass; not the final requirements or design themselves.

## 1. Objective

Produce a coherent final document set covering the complete approved requirements (functional and non-functional), architecture and detailed design, data model, UML diagrams, and supporting project documentation. The final set must be internally consistent, traceable to the source requirements, and clear about decisions that still require stakeholder or instructor confirmation.

Use the existing SpecKit artifacts as the repository's primary structure and source-of-truth locations. Reuse useful detail from the Copilot architecture/design document, but do not retain conflicting duplicate statements. This is a reconciliation task, not permission to invent requirements or silently expand scope.

## 2. Source hierarchy and change control

Apply this order when sources disagree:

1. Approved and clarified project specification / user requirements.
2. Project Constitution and explicit course constraints.
3. Approved stakeholder decisions recorded in the repository.
4. Existing SpecKit plan, data model, research, and UML artifacts.
5. Copilot-generated architecture/design draft and other AI-generated suggestions.

The Constitution and specification are normative. Treat AI-generated artifacts as proposals that must be checked against them. Preserve the customer-facing web-product requirement and the separately scoped Swing MVP. Do not represent the Swing MVP alone as satisfying the full web product. Do not change a requirement, platform, scope boundary, or success criterion without recording the rationale and obtaining the required approval.

For every unresolved conflict, do not guess. Record it in an open-decision log with: decision/question, why it matters, available options, recommendation (if supportable), owner/approver, and status. Mark dependent design elements as provisional.

## 3. Reconcile the final requirements baseline

Create or update a canonical requirements document that includes:

- Project purpose, stakeholders, scope, goals, and explicit out-of-scope items.
- Definitions, terminology, actors, assumptions, dependencies, and constraints.
- All functional requirements (FRs), preserving stable identifiers and normative meaning.
- All non-functional requirements (NFRs), preserving identifiers, measurable targets, applicability, and verification method.
- The distinction between the complete customer-facing product and the Swing MVP, including the capabilities included/excluded from the MVP.
- Success criteria and acceptance conditions, each measurable and testable.
- Clarifications already established in the source specification, including payer-versus-participant behavior, approval effects on balances, exact minor-unit allocation, group membership/history access, and report/notification scope.
- Open questions and proposed decisions, clearly separated from approved requirements.

For each FR/NFR, state a single, testable requirement where practical. Avoid vague wording such as “fast,” “secure,” or “user-friendly” unless accompanied by a measurable criterion or explicit verification approach. Do not convert a proposed target into an approved commitment without confirmation.

## 4. Architecture and detailed design

Produce one canonical architecture/design document that explains:

- System context and external actors/systems.
- Web product and Swing MVP presentation boundaries and how both use the shared application/domain capabilities, where that is the intended design.
- Layer/component responsibilities, interfaces, dependencies, and permitted dependency direction.
- Application use cases/services, domain rules, persistence/repository ports and adapters, and external-service boundaries.
- Authentication, authorization, validation, error handling, transaction boundaries, and data consistency.
- Expense submission, approval/rejection, balance derivation, payment recording, notifications, and reporting flows.
- Key design decisions, alternatives considered, rationale, constraints, and unresolved choices.
- Mapping from requirements to architecture elements and design/test evidence.

Honor the Constitution: Java 21 and Maven; Swing UI for the specified MVP; Swing event handlers delegate to application/business logic; domain/business logic remains independent of Swing; cohesive OOP with no unnecessary abstraction; monetary arithmetic uses `BigDecimal` and explicit scale/rounding; JUnit 5 tests; maintained PlantUML diagrams.

Review dependency direction carefully. UI/presentation must not own business rules. Domain rules must not depend on Swing or directly on persistence implementation details. Application services should orchestrate use cases and authorization and access persistence through defined interfaces/ports. Diagrams and prose must express the same boundaries.

## 5. Data design

Reconcile the conceptual data model and, where appropriate, a logical/persistence model. For each entity/value object, define:

- Name, purpose, attributes, data types, required/optional status, constraints, and identifier.
- Relationships, cardinalities, ownership, and lifecycle.
- Uniqueness, referential integrity, validation, and access-control implications.
- Whether values are stored, derived, or cached, and how derived values are recalculated.
- Retention/history behavior, especially for removed group members and recorded payments.

At minimum, address the entities already present in the specification/model (such as User, Group, Membership, Expense, allocation/participant share, Approval, Balance, Payment, Notification, and Report/query concepts). Do not introduce extra entities solely to make a diagram look complete; justify any new model element.

Make money rules explicit: currency and minor-unit representation, `BigDecimal` usage, rounding policy, exact allocation reconciliation, percentage total validation, deterministic remainder distribution, payer credit, participant shares, and the treatment of pending/rejected expenses. Clearly distinguish a derived balance from a recorded payment.

## 6. Required UML and supporting diagrams

Create and maintain the following UML diagrams in PlantUML source form. Diagrams must be readable, appropriately scoped, and consistent with the final requirements, data model, and architecture. Include a short purpose/caption and reference each diagram from the relevant document.

### 6.1 Use-case diagram(s)

Show the system boundary, actors, and user goals. Cover the complete approved scope and identify which use cases are in the Swing MVP versus web/full-product scope. Use `include`/`extend` only when their semantics are accurate. Avoid representing internal classes or implementation steps as actors/use cases.

### 6.2 Component diagram

Show presentation adapters (web and Swing where applicable), application services/use-case handlers, domain rules/model, persistence ports/adapters, and external integrations (such as email/notification services) at the appropriate level. Label important interfaces and dependencies. Enforce the dependency rules in Section 4; do not draw domain-to-database coupling.

### 6.3 Detailed class diagram(s)

Show the key domain and application classes, meaningful attributes and operations, associations, multiplicities, inheritance/composition where justified, and relevant interfaces. Include enough detail to support implementation without turning the diagram into a dump of every getter/setter. Ensure classes align with the data model and stated OOP principles. If one diagram becomes unreadable, split it by cohesive domain area and explain the split.

### 6.4 Sequence diagram(s)

Model the important end-to-end interactions, including at least:

- Create/submit an expense and calculate allocations.
- Approve or reject an expense, including the configured approval requirement and balance impact.
- Retrieve/derive pairwise balances.
- Record a payment and update the derived balance view.
- One notification/report interaction if included in the approved scope.

Show actor, UI/presentation, application service, domain logic, repository/persistence, and external service participants as applicable. Include validation, authorization failures, and relevant alternate paths. Do not show pending/rejected expenses changing balances.

### 6.5 State diagram(s)

Model the expense lifecycle and its legal transitions (for example, draft/submitted/pending, approved, rejected, if those states are supported). Show transition triggers/guards and identify which states affect balances. Do not invent edit/resubmit or approval transitions if the requirements have not decided them; mark them as unresolved or omit them pending approval.

### 6.6 Activity diagram(s)

Model key workflows such as expense submission/allocation, approval, and payment recording. Include decisions, guards, failure/denial paths, and the point at which data is committed. Keep activities consistent with sequence and state diagrams. Avoid duplicating sequence diagrams with no additional process clarity.

## 7. Consistency rules for all artifacts

- Use the same terms, identifiers, actor names, state names, and component names throughout.
- A requirement must not appear as approved in one file and optional/proposed in another.
- Every operation in the detailed class/sequence diagrams must have a defensible requirement or design rationale.
- Every important data field and relationship must agree between the data model and class diagram.
- Lifecycle transitions in state, sequence, and activity diagrams must agree.
- Approval and balance rules must agree across requirements, architecture, data, tests, and diagrams.
- Document notification failure/retry behavior and transaction boundaries; do not imply notification delivery is part of the expense transaction unless approved.
- Keep pairwise balance/netting semantics explicitly unresolved until the stakeholder decision is recorded; do not silently choose a settlement algorithm.
- Keep diagrams as editable PlantUML source. If a rendered image is checked in, regenerate it from the committed source and ensure it matches.

## 8. Traceability and verification

Create a traceability matrix with at least these columns:

`Requirement ID | Requirement summary | Scope (web/full or Swing MVP) | Design element(s) | Data element(s) | UML diagram(s) | Verification/test ID | Status | Notes/open decision`

Include all FRs, NFRs, and success criteria. Identify requirements with no design coverage, design elements with no requirement/rationale, and requirements without a verification method. Do not claim that tests have passed unless they have actually been executed and evidence is available.

Define a verification plan appropriate to the requirement, including unit tests, application/service tests, persistence tests, UI boundary tests, and performance/usability checks where required. Tests for business logic must be runnable without launching a graphical display where the Constitution requires it. Include edge cases for money allocation and approval/balance invariants.

## 9. Supporting documents to update or add

Keep the final set lean and non-duplicative. Update or add the following as appropriate to the repository structure:

- Canonical functional and non-functional requirements / specification.
- Architecture and detailed design.
- Data model and data dictionary (plus logical schema if needed).
- PlantUML source files for use cases, components, class diagrams, sequences, states, and activities.
- Architecture/design decision records (ADRs) for consequential decisions.
- Open-decision / assumption / risk log.
- Requirement-to-design-to-test traceability matrix.
- Verification and test strategy, including acceptance-test mapping.
- Glossary and scope/MVP matrix if these are not already clear in the requirements.
- Diagram index explaining each diagram's purpose and canonical source path.

Do not create multiple competing “final” files. Mark superseded drafts as historical or move them to a clearly labeled archive only if repository conventions and course instructions permit it. Preserve useful provenance and make the canonical version unmistakable.

## 10. Reconciliation workflow

1. Inspect the current repository tree and read the Constitution, source requirements/clarifications, SpecKit artifacts, Copilot design, and prior cross-check findings.
2. Inventory every existing artifact and identify its authority, purpose, conflicts, and whether it should be updated, retained as supporting material, or superseded.
3. Build a requirement/decision inventory before editing. Preserve IDs and approved wording; separate approved facts from proposals.
4. Draft the canonical requirements baseline first, then reconcile data design and architecture against it.
5. Create/update UML diagrams from the reconciled model and architecture—not independently—and cross-check all diagram semantics.
6. Create the traceability matrix and verification plan.
7. Run a consistency review against the checklist below. Where decisions remain open, mark the affected content provisional and record the question rather than inventing a resolution.
8. Present a concise change summary, open decisions requiring stakeholder review, and any assumptions. Do not claim code-level validation if only documents were reviewed.

## 11. Final review checklist

- [ ] Full web-product scope and Swing MVP scope are distinguished accurately.
- [ ] All FRs, NFRs, and success criteria are included with stable IDs.
- [ ] No unapproved requirement or platform change was introduced.
- [ ] Architecture honors Constitution technology and separation-of-concerns constraints.
- [ ] Domain logic is independent of Swing and persistence implementation details.
- [ ] Data model and detailed class diagrams agree.
- [ ] Money allocation and balance invariants are explicit and testable.
- [ ] Expense states and transitions agree across state, sequence, and activity diagrams.
- [ ] Required UML diagrams are present, readable, editable, and referenced.
- [ ] Authorization, validation, error paths, transaction boundaries, and notification failures are addressed.
- [ ] Unresolved policy decisions are clearly logged, not guessed.
- [ ] Every requirement maps to design and verification evidence in the traceability matrix.
- [ ] No tests, performance targets, or acceptance criteria are claimed as passed without evidence.
- [ ] One canonical final artifact is identified for each topic; duplicates do not conflict.

## Expected result

A review-ready, consistent final requirements-and-design baseline suitable for stakeholder/instructor review and as a controlled starting point for implementation. The reconciliation is complete only when the artifact set passes the checklist or explicitly identifies the remaining unresolved decisions and their owners.
