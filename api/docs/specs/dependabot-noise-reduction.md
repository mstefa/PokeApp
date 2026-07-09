# 🤖 Dependabot Noise Reduction Specification

This specification outlines the changes to the Dependabot configuration for the PokeApp repository to reduce Pull Request noise.

## Rationale
To prevent alert fatigue and streamline developer workflow, we want to limit the maximum number of open Pull Requests created by Dependabot for general package updates.

## Proposed Configuration (`.github/dependabot.yml`)
- Update `open-pull-requests-limit` from `5` to `2` for Backend API dependencies.
- Add/update `open-pull-requests-limit` to `2` for GitHub Actions workflows.
- Add a 1-day cooldown policy (`cooldown: default-days: 1`) to delay version updates by at least one day after release, ensuring stability and reducing immediate noise.

## Changelog Location
This change will be logged in `api/docs/CHANGELOG.md`.
