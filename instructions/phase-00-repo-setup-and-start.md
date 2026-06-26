# Phase 00 — Repository Setup and Phase 1 Start Instructions

## Objective
Prepare the GitHub repository for the SS CSS Framework project, configure the correct Git identity, store the phase instruction files, and begin implementation with Phase 1 only.

This file is for Codex to follow before working on the CSS framework implementation.

---

## Repository Details
- Repository SSH URL: `git@github.com:cameronb1276/SS_CSS_FRAMEWORK.git`
- GitHub user: `cameronb1276`
- Git commit email: `cameron9823@gmail.com`
- Project name: `SS_CSS_FRAMEWORK`

---

## Required Git Identity
- Configure Git for this repository using the user/name `cameronb1276`.
- Configure Git for this repository using the email `cameron9823@gmail.com`.
- Do not use any other Git username or email for commits in this repository.
- Do not commit using a system default identity, work identity, temporary identity, or another account.
- Before the first commit, confirm that the local repository identity matches the required user and email above.

---

## Repository Setup Instructions
- Clone the repository from `git@github.com:cameronb1276/SS_CSS_FRAMEWORK.git`.
- Use the repository root as the working directory for all framework files.
- Confirm the remote origin points to `git@github.com:cameronb1276/SS_CSS_FRAMEWORK.git`.
- Do not create a second repository.
- Do not push to any other remote.
- Do not rename the repository.
- Do not change the project name unless directly instructed later.

---

## Instruction File Placement
Place all phase instruction files in a dedicated folder named `instructions/`.

Store the instruction files as:
- `instructions/phase-00-repo-setup-and-start.md`
- `instructions/phase-01-foundation-and-tokens.md`
- `instructions/phase-02-layout-grid-and-utilities.md`
- `instructions/phase-03-components-and-patterns.md`
- `instructions/phase-04-dark-mode-docs-testing-and-release.md`

Keep the instruction files in the repository so future development can continue phase by phase.

Do not delete instruction files after completing a phase.

---

## Starting Point
- Start with Phase 1 only.
- The first implementation file to follow is `instructions/phase-01-foundation-and-tokens.md`.
- Do not begin Phase 2 until Phase 1 is complete, reviewed, committed, and pushed.
- Do not begin Phase 3 or Phase 4 during the Phase 1 work cycle.
- Phase 1 should establish the framework foundation, naming conventions, color tokens, CSS variables, base reset, typography defaults, spacing tokens, border radius tokens, shadow tokens, and initial project structure.

---

## Phase 1 Work Rules
- Follow Phase 1 exactly as written.
- Keep the CSS framework general-purpose, similar in spirit to Bootstrap, but with a cleaner and more modern color system.
- Use the selected color scheme from the phase files.
- Build the framework so it can be used by normal HTML projects without requiring JavaScript.
- Use plain CSS unless the phase file explicitly says otherwise.
- Keep class names predictable, reusable, and easy to remember.
- Avoid over-engineering.
- Avoid creating experimental build systems unless the phase file requires one.
- Prioritize readability and long-term maintainability.

---

## Expected Initial Repository Structure
Create a simple structure that can grow through later phases.

The repository should include, at minimum:
- `README.md`
- `LICENSE` if one already exists or is requested later
- `instructions/`
- `src/`
- `src/ss.css`
- `dist/`
- `examples/`
- `docs/`

If an existing structure already exists, preserve it where reasonable and adapt without destroying existing work.

---

## Commit and Push Rules
- After completing the repository setup, make an initial setup commit.
- After completing Phase 1, make a separate Phase 1 commit.
- Use clear commit messages.
- Suggested setup commit message: `Set up SS CSS Framework repository instructions`
- Suggested Phase 1 commit message: `Complete phase 1 foundation and design tokens`
- Push completed work to the GitHub repository after each completed phase.
- Do not wait until all phases are complete before pushing.

---

## Safety and Quality Rules
- Do not commit secrets, SSH keys, environment files, personal tokens, credentials, or local machine paths.
- Do not include generated junk files, operating system metadata files, dependency caches, or editor-specific temporary files.
- Do not add large unnecessary files.
- Do not add external CSS frameworks as dependencies.
- Do not copy Bootstrap source code.
- This project should be original and only similar in concept to Bootstrap.
- Make sure the framework can stand on its own.

---

## Phase 1 Completion Checklist
Before pushing Phase 1, confirm:
- The repository remote is correct.
- The Git user is `cameronb1276`.
- The Git email is `cameron9823@gmail.com`.
- The instruction files are stored in `instructions/`.
- Phase 1 was the only implementation phase completed.
- The selected color scheme is represented as reusable CSS tokens.
- Base typography and reset rules are included.
- Spacing, border, radius, and shadow tokens are included.
- The source CSS file exists.
- The distribution CSS file exists if Phase 1 calls for it.
- The README explains the project purpose at a basic level.
- The work has been committed.
- The work has been pushed to `git@github.com:cameronb1276/SS_CSS_FRAMEWORK.git`.

---

## Stop Point
Stop after Phase 1 is complete, committed, and pushed.

Do not continue into Phase 2 unless explicitly instructed by the user.

Report back with a concise summary of what was completed, what files changed, and the latest commit hash.
