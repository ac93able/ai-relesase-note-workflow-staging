# Release Note Skills Marketplace

Shared Claude Code skills for professional release note generation and quality review.

## 🚀 Quick Start

### 1. Add the Marketplace

```bash
/plugin marketplace add ac93able/release-note-skills
```

### 2. Install the Plugin

```bash
/plugin install release-notes@release-note-skills
```

### 3. Use the Skills

```bash
/release-notes:release-note-writer      # Generate release notes
/release-notes:release-note-reviewer    # Validate with quality checks
```

## 📦 What's Included

**Plugin: `release-notes`**

Two AI-powered skills for professional release note documentation:

| Skill | Purpose | Stage | Output |
|-------|---------|-------|--------|
| `release-note-writer` | Transform commits/Jira into release notes | 3-4 | Markdown |
| `release-note-reviewer` | Validate release notes with quality checks | 5 | HTML report |

## 📖 Documentation

- **[Plugin README](./plugins/release-notes/README.md)** — Detailed usage, input/output formats, best practices
- **[CHANGELOG](./CHANGELOG.md)** — Version history and updates
- **[LICENSE](./LICENSE)** — MIT License

## 🎯 Use Cases

### Generate Customer-Facing Release Notes
```bash
/release-notes:release-note-writer
# Input: git commits, Jira issues, design docs
# Output: professional Markdown release notes
```

### Generate Internal Release Notes
```bash
/release-notes:release-note-writer
# Input: same + technical details
# Output: engineering-focused release notes with commit refs
```

### Validate Before Publication
```bash
/release-notes:release-note-reviewer
# Input: draft release notes (Markdown)
# Output: HTML quality report with scores and recommendations
```

## 🔧 System Requirements

- Claude Code v1.0.0+
- Minimum permissions: `read-files`, `write-files`
- Optional: Git, Jira, Confluence, Microsoft Learn MCPs for full capabilities

## 🌟 Key Features

### Release Note Writer
- ✓ Transforms commits/Jira/Confluence into user-benefit language
- ✓ Generates customer-facing or internal release notes
- ✓ Structured Markdown output ready for publication
- ✓ Answers "What does this do?" and "How does this help?"

### Release Note Reviewer
- ✓ 4-category quality scoring (0-100%)
- ✓ Clarity, Completeness, Consistency, Formatting assessment
- ✓ Actionable improvement recommendations (High/Medium/Low priority)
- ✓ Styled HTML reports with visual metrics
- ✓ Completeness checklist validation

## 📊 Quality Scoring

The reviewer skill evaluates release notes on four dimensions:

| Dimension | Weight | What We Check |
|-----------|--------|---------------|
| **Clarity** | 30% | User-benefit language, plain English, readability |
| **Completeness** | 25% | All required sections, no gaps, no missing info |
| **Consistency** | 25% | Terminology, tone, voice, formatting alignment |
| **Formatting** | 20% | Heading hierarchy, bullets, emphasis, links |

**Readiness Threshold:** 85% = Ready for Human Review

## 📝 Workflow Integration

These skills implement Stages 3-5 of the 7-stage AI-powered release note pipeline:

```
Stage 1: Change Discovery & Normalization
Stage 2: Data Enrichment & Validation
│
├─ Stage 3: Extraction & Summarization      ← release-note-writer
├─ Stage 4: Structuring & Classification    ← release-note-writer
├─ Stage 5: Human Review & Enrichment       ← release-note-reviewer
│
Stage 6: Publication & Distribution
Stage 7: Metrics & Feedback Collection
```

## 🔗 Integration Points

**Git MCP** (included by default)
- Extracts commit messages, diffs, and authorship
- Supports `git log`, `git show`, commit range queries

**Jira MCP** (optional)
- Retrieves issue details, priorities, labels, fix versions
- Validates issue numbers and status

**Confluence MCP** (optional)
- Pulls design docs and architecture specs
- Validates documentation links

**Microsoft Learn MCP** (optional)
- References professional style guidance
- Provides clarity and tone recommendations

## 📂 Output Locations

Both skills save output to your project's `release-notes-output/` folder:

```
release-notes-output/
├── release-notes-2.3.0.md                  ← Writer output
├── release-notes-2.3.0-customer.md         ← Customer-facing version
├── release-notes-2.3.0-internal.md         ← Internal/engineering version
├── release-notes-review-2.3.0.html         ← Reviewer quality report
└── release-notes-review-2.3.0-customer.html ← Report for customer version
```

## 💡 Tips for Best Results

### Before using Writer skill
- Gather commits: `git log v2.2.0..v2.3.0`
- Export Jira issues for the release version
- Identify relevant Confluence design docs
- Create normalised input JSON with all change items

### Before using Reviewer skill
- Ensure draft release notes are in Markdown format
- Include all expected sections (What's New, Issues Fixed, Limitations, etc.)
- Have draft reviewed by SME for technical accuracy
- Check that all documentation links are valid

### After review
- Incorporate high-priority recommendations immediately
- Discuss medium-priority items with your team
- Consider low-priority suggestions for polish
- Re-run reviewer after major edits to confirm improvements

## 🤝 Support

**Questions?**
- See [Plugin README](./plugins/release-notes/README.md) for detailed documentation
- Check [CHANGELOG](./CHANGELOG.md) for version notes

**Issues or feedback?**
- Open an issue on GitHub
- Email: anubhav02011993@gmail.com

**Want to contribute?**
- See CONTRIBUTING.md (coming soon)

## 📄 License

MIT License — see [LICENSE](./LICENSE) file for details

## 📚 Learn More

- **[Full plugin documentation](./plugins/release-notes/README.md)** — Input/output formats, MCP dependencies, workflow integration
- **[Release notes examples](./examples/)** — Sample inputs and generated outputs
- **[Changelog](./CHANGELOG.md)** — Version history and feature updates

---

**Marketplace Name:** `release-note-skills`  
**Current Version:** 1.0.0  
**Status:** Production Ready  
**Last Updated:** July 3, 2026  
**Author:** Anubhav Chaudhary

### Next Steps

1. Run the installation commands above
2. Read the [plugin README](./plugins/release-notes/README.md)
3. Try it on your next release
4. Share feedback!
