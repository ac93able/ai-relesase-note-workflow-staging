# Changelog

All notable changes to the Release Note Skills plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-03

### Added

- Initial release of `release-notes` plugin with two skills:
  - `release-note-writer`: Transform commits/Jira/Confluence into professional release notes (Stages 3-4)
  - `release-note-reviewer`: Validate release notes with 4-category quality scoring (Stage 5)

- **Writer Skill Features:**
  - Extract context from Git commits, Jira tickets, Confluence design docs
  - Generate customer-facing or internal release notes
  - User-benefit focused descriptions
  - Structured Markdown output ready for publication
  - Support for multiple release note modes (customer-facing, internal, technical)

- **Reviewer Skill Features:**
  - 4-category quality assessment: Clarity (30%), Completeness (25%), Consistency (25%), Formatting (20%)
  - Quantitative quality scoring (0-100%)
  - Actionable improvement recommendations prioritized by impact (High/Medium/Low)
  - Comprehensive HTML quality reports with visual styling
  - Completeness checklist validation
  - Integration with Jira, Confluence, and Microsoft Learn MCPs for cross-validation

- **Documentation:**
  - Marketplace-level README with quick start guide
  - Plugin-level README with detailed usage and best practices
  - Comprehensive CHANGELOG for version tracking
  - License (MIT) for open distribution

- **Integration:**
  - Git MCP support (included by default) for commit context
  - Optional Jira MCP for issue details and validation
  - Optional Confluence MCP for design docs and architecture
  - Optional Microsoft Learn MCP for style guidance

### Features

- ✓ Workflow Stage 3-4: Release note generation and structuring
- ✓ Workflow Stage 5: Quality review and improvement recommendations
- ✓ Multi-audience support (customer vs. internal documentation)
- ✓ Professional HTML reporting
- ✓ Auto-discovery of components and change categorization
- ✓ Performance metrics and quality benchmarking

### Initial Limitations

- Requires pre-normalised input from Stage 2 pipeline
- Cannot assess domain-specific accuracy (requires SME review)
- May miss subtle breaking changes without explicit labeling
- Depends on clear commit messages and complete descriptions
- HTML reports are styled for desktop viewing

---

## Roadmap (Future Versions)

### [1.1.0] - Planned

- [ ] Auto-discovery of changes from git history (eliminate Stage 2 requirement)
- [ ] Jira issue auto-linking and validation
- [ ] Custom quality scoring rubrics
- [ ] Scheduled release note generation
- [ ] Multi-language support for release notes

### [1.2.0] - Planned

- [ ] API endpoint for programmatic skill invocation
- [ ] Batch release note generation
- [ ] Custom templates for different release types (patch, minor, major)
- [ ] Release notes versioning and diff display
- [ ] Integration with GitHub Releases API

### [2.0.0] - Planned

- [ ] Full pipeline automation (Stages 1-7)
- [ ] Multi-plugin marketplace ecosystem
- [ ] Cloud deployment option for remote skill execution
- [ ] Team collaboration features
- [ ] Analytics and feedback loop closure

---

## How to Report Issues

If you encounter bugs or have feature requests:
1. Check existing GitHub issues
2. Provide clear reproduction steps
3. Include version number and environment details
4. Email: anubhav02011993@gmail.com

## Support Policy

- **Current Version (1.0.0):** Full support
- **Previous Versions:** Community support only
- **Breaking Changes:** Announced 2 releases (minimum 3 months) in advance

## Upgrade Path

From **0.x** (private skills) to **1.0.0** (plugin):
```bash
/plugin marketplace add ac93able/release-note-skills
/plugin install release-notes@release-note-skills
```

No breaking changes to skill signatures or output formats.

---

**Last Updated:** July 3, 2026  
**Maintainer:** Anubhav Chaudhary  
**Status:** Production Ready
