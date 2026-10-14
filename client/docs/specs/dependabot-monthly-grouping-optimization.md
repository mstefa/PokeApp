# 🤖 Dependabot Monthly Grouping and PR Noise Reduction Specification

This specification documents the configuration updates to `.github/dependabot.yml` to minimize Dependabot Pull Request volume while preserving real-time security vulnerability patches.

## Rationale
- **Major Version Splitting**: Previously, `groups` restricted grouping to `minor` and `patch`. As a consequence, every major dependency bump opened its own individual Pull Request, flooding the repository with notification noise.
- **Ungrouped Actions**: GitHub Actions lacked a grouping configuration, causing individual PRs for each action update.
- **Cadence Optimization**: Weekly scheduled checks generated frequent batches of maintenance PRs. Shifting to a monthly cadence significantly reduces developer fatigue.
- **Security Updates Preservation**: Dependabot security updates (triggered via GitHub Advisory alerts for CVEs) run independently from version schedule intervals, meaning security patches continue to be delivered immediately upon detection.

## Key Changes
1. **Remove update-types restriction in groups**:
   - Set pattern `"*"` covering all version updates (patch, minor, and major) into bundled group PRs for `/api` and `/client`.
2. **Group GitHub Actions**:
   - Add `groups.actions` targeting `"*"` for all workflow actions.
3. **Monthly Schedule**:
   - Update `schedule.interval` to `"monthly"` for `/api`, `/client`, and `github-actions`.
4. **Pull Request Cap**:
   - Set `open-pull-requests-limit: 2` across all targets.
5. **Cooldown Policy**:
   - Maintain `cooldown: default-days: 1` to ensure package stability before PR generation.

## Reference Files
- `.github/dependabot.yml`
