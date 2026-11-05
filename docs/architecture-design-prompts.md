# Architecture & Design Generation and Cross-Check Prompts

## Workflow

This document contains three prompts for the CIS 285 Lab 6 workflow:

1. **SpecKit prompt** — generate the Architecture and Design artifacts from the clarified specification.
2. **GitHub Copilot prompt** — independently generate equivalent Architecture and Design artifacts, using the same source documents.
3. **ChatGPT prompt** — compare the two outputs and cross-check them against the project’s governing documents.

Run SpecKit and Copilot separately. Do not let either tool read or copy the other tool’s generated Architecture/Design output before completing its own generation. This preserves an independent comparison. Save each output in a clearly labeled location, then provide both to ChatGPT along with the source documents.

---

## 1. Prompt for SpecKit

You are working on CIS 285 Lab 6. Generate the **Architecture and Design** artifacts for this project using the SpecKit workflow.

### Authoritative inputs
- `Constitution.md` — project-wide principles, constraints, and quality requirements.
- The current, clarified `Spec.md` — functional requirements, scenarios, acceptance criteria, and clarifications. Treat the clarified version as authoritative.
- Any project files explicitly referenced by those documents and already present in the repository.

### Instructions
1. Inspect and read the complete Constitution and clarified Spec before generating anything.
2. Follow the repository’s SpecKit conventions and expected artifact names, paths, format, and workflow. If the project has a defined command or template for Architecture and Design, use it rather than inventing a parallel format.
3. Produce a coherent Architecture and Design that translates the clarified requirements into an implementable design.
4. Trace each significant architectural decision and design element to one or more requirements or Constitution principles. Use requirement IDs where available; do not invent IDs.
5. Include, as appropriate to the project and its actual requirements:
   - architecture overview and rationale;
   - components/modules and their responsibilities;
   - interfaces, data flow, and interactions;
   - data model and important entities;
   - key algorithms or behavior;
   - error handling and validation;
   - security, privacy, accessibility, performance, or other quality considerations only when applicable or required;
   - testability and how the design supports acceptance criteria;
   - assumptions, unresolved questions, constraints, and trade-offs.
6. Keep the design proportionate to the project’s scope. Do not add features, requirements, technologies, dependencies, or complexity that are not supported by the source documents. Mark unavoidable assumptions explicitly.
7. Ensure the proposed design is internally consistent and feasible. Identify conflicts between the source documents rather than silently resolving them.
8. Do not implement code unless the SpecKit workflow explicitly requires it for this artifact-generation stage.
9. Before finishing, perform a self-review against the Constitution and clarified Spec. Report any requirement that is not addressed, any conflict, and any assumption.
10. Do not modify the Constitution or Spec. Do not commit, push, or make unrelated repository changes.

### Deliverables
Generate the Architecture and Design artifacts in the locations and format required by this repository’s SpecKit workflow. At the end, provide a concise summary of created/changed files and a traceability/self-review checklist. Do not claim a check passed unless you actually performed it.

---

## 2. Prompt for GitHub Copilot (independent generation)

Act as the project’s software architect and design analyst for CIS 285 Lab 6. Independently generate the project’s **Architecture and Design** artifacts.

### Source of truth
Read the complete:
- `Constitution.md`
- clarified `Spec.md`

Also inspect only relevant repository files needed to understand the project and its established conventions. The clarified Spec is authoritative for requirements. The Constitution is authoritative for project principles and constraints.

### Independence requirement
This is an independent generation, intended to be compared against a separate SpecKit-generated design. Do **not** search for, read, reuse, or imitate any other generated Architecture/Design output. Do not assume what another tool produced.

### Tasks
1. Summarize the project goal and the key constraints from the source documents.
2. Design a solution that satisfies the stated requirements and acceptance criteria.
3. Use the repository’s established artifact structure and naming conventions if they are evident. Otherwise, create clearly titled Architecture and Design documents without changing source documents.
4. Cover the relevant architecture, component responsibilities, interfaces, data model, behavior/flows, validation and error handling, quality attributes, and testability. Include only aspects justified by the actual project.
5. Map major design elements to the requirement IDs or exact requirement wording. Never fabricate requirement IDs.
6. Explain important design decisions and trade-offs. Identify assumptions and open questions explicitly.
7. Check for internal consistency, feasibility, and compliance with the Constitution. Do not add unsupported features or unnecessary complexity.
8. Do not implement the application unless specifically required by the project’s artifact workflow.
9. Do not alter `Constitution.md` or `Spec.md`. Do not commit, push, or make unrelated changes.

### Deliverables
Create the Architecture and Design artifacts in the appropriate repository location. Then summarize the files created, requirement coverage, design decisions, assumptions, and any unresolved issues. Distinguish verified checks from items that still need review.

---

## 3. Prompt for ChatGPT (comparison and cross-check)

You are the independent reviewer for CIS 285 Lab 6. Compare the **SpecKit-generated Architecture and Design** with the **GitHub Copilot-generated Architecture and Design**, then cross-check both against the project’s governing source documents.

### Materials to review
I will provide:
- `Constitution.md`
- the clarified `Spec.md`
- SpecKit’s Architecture and Design output
- Copilot’s independently generated Architecture and Design output
- Any relevant repository context or assignment rubric, if available

Do not assume access to files or repository contents that I have not provided or that you cannot actually inspect. If a required source is missing, state exactly what is missing and continue only with clearly labeled limitations.

### Review procedure
1. Read the Constitution and clarified Spec first. Extract the project principles, requirements, constraints, and acceptance criteria that the designs must satisfy.
2. Review each design independently against those source documents before comparing the two designs.
3. Compare the outputs for:
   - requirement and acceptance-criteria coverage;
   - consistency with the Constitution;
   - architecture and component boundaries;
   - responsibilities, interfaces, data structures, and interactions;
   - behavior, validation, and error handling;
   - quality attributes and testability, where applicable;
   - feasibility, clarity, and implementation readiness;
   - unsupported assumptions, scope expansion, omissions, contradictions, and unnecessary complexity.
4. Distinguish a genuine defect from a stylistic difference. Do not prefer one tool simply because of its name or writing style.
5. Do not invent requirements, facts, repository files, or requirement IDs. Quote or reference the exact source text or ID when possible.
6. Identify which design is stronger for each material issue and explain why. Where both are wrong or incomplete, say so and recommend a correction.
7. Cross-check every requirement against both designs. Mark each as **Covered**, **Partially covered**, **Missing**, **Conflicting**, or **Not verifiable**. Explain the judgment briefly.
8. Recommend a reconciled design direction. Give concrete edits, with the relevant document/section and proposed change. Do not silently rewrite the source requirements.
9. Identify questions that require the student or instructor to decide rather than guessing.
10. Do not claim to have run code, tests, SpecKit commands, or repository operations unless those actions actually occurred.

### Required report format
Return the report in this order:

**A. Executive summary**
- Overall result and the most important findings.
- Which output is more complete/consistent, if evidence supports that conclusion.

**B. Requirement cross-check table**
Columns: Requirement/ID; Constitution or Spec source; SpecKit status; Copilot status; evidence/reason; recommended action.

**C. Architecture and design comparison**
Compare material differences in a table: topic; SpecKit approach; Copilot approach; assessment; recommendation.

**D. Findings**
Group findings by severity:
- Critical — violates a requirement or core constraint, or makes the design unworkable.
- Major — substantial omission, contradiction, or implementation risk.
- Minor — clarity, maintainability, or polish issue.
For every finding, include evidence, impact, and a specific correction.

**E. Reconciled recommendations**
List the concrete changes needed to produce the best combined design. Keep requirements traceable and avoid unsupported scope.

**F. Open questions and limitations**
List unresolved decisions, missing evidence, and checks that were not possible.

**G. Final readiness assessment**
State whether the artifacts are ready for implementation/submission, ready after specified corrections, or not ready. Explain the basis. Do not guarantee instructor acceptance or assign a grade.

Be rigorous, neutral, and specific. The goal is a useful engineering cross-check, not a superficial summary.
