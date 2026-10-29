<!--
Sync Impact Report
Version change: unversioned template -> 1.0.0 (initial adoption)
Modified principles: scaffold placeholders -> eight defined principles
Added sections: Customer Requirements and Implementation Decisions;
  Development Workflow and Quality Gates
Removed sections: none
Follow-up TODOs:
  - Confirm the original ratification date and replace TODO(RATIFICATION_DATE).
  - Resolve the customer's primary web-based requirement versus the requested
    Java Swing implementation before claiming the implementation fulfills it.
This report is temporary review material and is expected to be removed before commit.
-->
# SplitSmart Constitution

## Core Principles

### I. Java 21 and Maven
The application MUST use Java 21 and Maven for its Java build, dependency
management, and standard project lifecycle. Build configuration MUST declare
the Java release explicitly so local and automated builds use a consistent
language level.

### II. Java Swing User Interface
The desktop user interface MUST use Java Swing. Swing event handlers and UI
components MUST delegate application work rather than implement expense,
approval, or balance rules. This preserves testability and keeps presentation
concerns separate from business behavior.

### III. Object-Oriented Design
The application MUST use cohesive classes with explicit responsibilities and
encapsulated state. Domain behavior MUST be represented in the domain or
application layer rather than duplicated across UI components. Abstractions
MUST serve a demonstrated design need; unnecessary indirection is prohibited.

### IV. Separation of GUI and Business Logic
Business rules MUST be callable and testable without constructing or displaying
Swing components. GUI code MUST communicate with business logic through clear
interfaces or application services, and business logic MUST NOT depend on
Swing. This boundary supports reliable tests and permits presentation changes
without silently changing expense behavior.

### V. Exact Monetary Values
All monetary amounts and calculations MUST use `BigDecimal`; binary
floating-point types MUST NOT represent money. Rounding and scale MUST be
explicitly defined at the relevant business boundary and applied consistently
to splits, balances, and payments.

### VI. JUnit 5 Testing
Automated Java tests MUST use JUnit 5. Tests MUST cover expense splitting,
approval, balance adjustment, and payment behavior as those capabilities are
implemented. Business-rule tests MUST run without a graphical display, and
changes to user-visible workflows MUST include appropriate integration or UI
boundary tests.

### VII. PlantUML Architecture Documentation
Architecture and key workflow diagrams MUST be maintained as PlantUML source
in the project. Diagrams MUST be updated when a change materially alters
classes, component boundaries, or a customer workflow, so they remain useful
design documentation rather than aspirational artifacts.

### VIII. Traceability and Human Review
Every implemented customer requirement MUST be traceable to its specification,
design elements, and verification evidence. AI-generated code, tests,
documentation, and diagrams MUST receive human review before acceptance; the
reviewer MUST verify correctness, requirement alignment, and applicable
quality constraints. AI output is a draft, not an approval or source of
customer authority.

## Customer Requirements and Implementation Decisions

`UserRequirement.md` records the customer's original request and MUST remain
unchanged. Its customer-facing requirements include individual accounts and
login; group management; expenses with amount, date, description, equal or
percentage splits, optional receipt image, and participants; notifications;
expense approval; balances between users; payment recording; and reports,
including date-range or other custom parameters. It identifies the primary
platform as web-based.

Java 21, Maven, Java Swing, JUnit 5, PlantUML, and the design practices in this
constitution are implementation decisions. They do not amend or replace the
customer requirements. In particular, a Swing desktop application does not
by itself fulfill the stated primary web-based requirement. The project MUST
record this incompatibility and obtain customer or authorized stakeholder
approval for a scope/platform change before presenting the implementation as
compliant. Customer requirements and implementation decisions MUST be labeled
separately in specifications, plans, and reviews.

## Development Workflow and Quality Gates

Specifications MUST preserve customer intent and provide traceable identifiers
for requirements. Plans MUST distinguish customer requirements from
implementation decisions and identify conflicts or unresolved assumptions.
Unresolved conflicts affecting customer-visible scope MUST be clarified and
approved before they are treated as settled requirements.

Each change MUST include verification appropriate to its affected behavior.
Changes to monetary calculations MUST test exact values and defined rounding;
changes to expense or payment workflows MUST test their effects on balances.
Architecture changes MUST update affected PlantUML diagrams. Reviewers MUST
check requirement traceability, tests, separation of GUI and business logic,
and human review of any AI-generated contribution.

## Governance

This constitution governs engineering decisions and does not authorize
unapproved changes to customer scope. Amendments MUST be proposed with their
rationale and impact, reviewed and approved by the project owner or authorized
stakeholder, and reflected in the version and amendment date below. Customer
requirement changes require customer or authorized stakeholder approval and
MUST NOT be made by silently editing the original `UserRequirement.md`.

The version follows semantic versioning: MAJOR for backward-incompatible
governance or principle changes, MINOR for new principles or materially
expanded requirements, and PATCH for clarifications and non-semantic edits.
Contributors and reviewers MUST assess compliance with this constitution
during specification, design, implementation, and review. Any exception MUST
be documented with its rationale and approved by the project owner or
authorized stakeholder.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm original adoption date | **Last Amended**: 2026-10-28
