# Agent Instructions

Before starting any task in this repository:

1. Run `make agents/sync`. It writes the shared Plus3 IT instructions for this repository's tardigrade-ci version to `.agents/plus3it/AGENTS.md`.
2. Read `.agents/plus3it/AGENTS.md` and follow it together with this file. If the sync fails, tell the user, and don't guess the conventions.

These rules always apply, even without the shared instructions:

- Don't push, open pull requests, publish releases, or apply infrastructure changes unless the user asks. List those steps for a person in your final report.
- Don't edit files under `.agents/plus3it/`; they are generated and overwritten by the sync.

@.agents/plus3it/AGENTS.md

## Repository-specific

### Purpose

This Terraform module deploys a Lambda function that processes Amazon SES bounce and complaint messages. The function is subscribed to the SNS topics for bounces and complaints, and it emails a formatted notification to the configured to address.

### Module-specific files

- `lambda/lambda.py` — Source of the Lambda function; `lambda/test_event.json` is a sample event

### Deviations from the terraform-module profile

- There is no `tests/` directory and no `test.yml` workflow, so the profile's Testing section and the mockstack commands do not apply. CI runs only `lint.yml` on pull requests, so `make lint` is the check.
