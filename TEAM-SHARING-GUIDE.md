# Release Note Skills Plugin — Team Sharing Guide

**Status:** ✅ Production Ready  
**Date:** July 3, 2026  
**Author:** Anubhav Chaudhary  
**Repository:** https://github.com/ac93able/release-note-skills

---

## What This Is

Two AI-powered Claude Code skills for professional release note generation and quality validation, now available as a shareable plugin.

**Skills included:**
- **release-note-writer** — Transform git commits, Jira issues, and design docs into polished release notes (customer-facing or internal)
- **release-note-reviewer** — Validate release notes with quality scoring and actionable improvement recommendations

---

## Installation (2 Commands)

### Step 1: Add the Marketplace
```bash
/plugin marketplace add ac93able/release-note-skills
```

### Step 2: Install the Plugin
```bash
/plugin install release-notes@release-note-skills
```

**That's it!** The skills are now available in your Claude Code instance.

---

## Usage

### Generate Release Notes
```bash
/release-notes:release-note-writer
```

**What it does:**
- Takes change data (commits, Jira issues, design docs)
- Generates professional Markdown release notes
- Supports customer-facing or internal modes
- Outputs to `release-notes-output/` folder

**Example output:** `release-notes-output/release-notes-2.3.0.md`

### Validate Release Notes
```bash
/release-notes:release-note-reviewer
```

**What it does:**
- Reads your draft release notes
- Scores them across 4 dimensions: Clarity, Completeness, Consistency, Formatting
- Generates detailed HTML quality report with actionable recommendations
- Prioritizes improvements by impact (High/Medium/Low)

**Example output:** `release-notes-output/release-notes-review-2.3.0.html`

---

## Typical Workflow

```
1. Gather changes from git, Jira, PRs
   ↓
2. Run /release-notes:release-note-writer
   ↓
3. Review generated Markdown for accuracy
   ↓
4. Run /release-notes:release-note-reviewer
   ↓
5. Review HTML quality report
   ↓
6. Incorporate high/medium-priority recommendations
   ↓
7. Final human review & approval
   ↓
8. Publish to channels
```

---

## Key Features

### Writer Skill
✓ Generates user-benefit focused descriptions  
✓ Extracts context from git commits, Jira, Confluence  
✓ Produces clean, publication-ready Markdown  
✓ Supports multiple output modes (customer/internal)  
✓ Answers "What does this do?" and "How does this help?"  

### Reviewer Skill
✓ **4-category quality scoring:**
  - Clarity (30%): user-benefit language, readability
  - Completeness (25%): all required sections, no gaps
  - Consistency (25%): terminology, tone, voice
  - Formatting (20%): hierarchy, bullets, emphasis

✓ Generates professional HTML reports  
✓ Actionable, prioritized recommendations  
✓ Completeness checklist validation  
✓ Overall readiness score (0-100%)  

---

## Output Locations

Both skills save to your project's `release-notes-output/` folder:

```
release-notes-output/
├── release-notes-2.3.0.md              ← Writer skill output
├── release-notes-2.3.0-customer.md     ← Customer version
├── release-notes-2.3.0-internal.md     ← Internal version
├── release-notes-review-2.3.0.html     ← Reviewer report
└── release-notes-review-2.3.0-customer.html
```

---

## System Requirements

- Claude Code v1.0.0+
- Minimum permissions: `read-files`, `write-files`
- Optional MCPs for full capabilities:
  - Git MCP (extract commits)
  - Jira MCP (pull issue details)
  - Confluence MCP (retrieve design docs)
  - Microsoft Learn MCP (style guidance)

---

## Testing Installation

After installation, verify everything works:

```bash
/release-notes:release-note-writer --help
/release-notes:release-note-reviewer --help
```

Both commands should display skill descriptions and usage.

---

## Getting Help

### Documentation
- **Plugin README:** https://github.com/ac93able/release-note-skills/blob/main/plugins/release-notes/README.md
- **Marketplace README:** https://github.com/ac93able/release-note-skills/blob/main/README.md
- **Changelog:** https://github.com/ac93able/release-note-skills/blob/main/CHANGELOG.md

### Issues or Feedback
- Open an issue on GitHub: https://github.com/ac93able/release-note-skills/issues
- Contact: anubhav02011993@gmail.com

---

## Example: Before & After

### Before Using Skills
```
❌ Release notes written manually
❌ Inconsistent formatting across sections
❌ No structured quality checks
❌ Time-consuming to write and review
❌ Each person uses their own template
```

### After Using Skills
```
✅ Professional notes generated from commits/Jira
✅ Consistent structure and tone
✅ Quality validated with scoring & recommendations
✅ 30-60 minutes saved per release
✅ Team standard applied consistently
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Install marketplace | `/plugin marketplace add ac93able/release-note-skills` |
| Install plugin | `/plugin install release-notes@release-note-skills` |
| Generate release notes | `/release-notes:release-note-writer` |
| Validate release notes | `/release-notes:release-note-reviewer` |
| List installed plugins | `/plugin list` |
| View skill help | `/release-notes:release-note-writer --help` |

---

## Best Practices

### For Best Results with Writer Skill
1. Gather all commits since last release: `git log v2.2.0..v2.3.0`
2. Export Jira issues for the release version
3. Identify relevant Confluence design documents
4. Create normalised input with all change items
5. Review AI output for technical accuracy before reviewer stage

### For Best Results with Reviewer Skill
1. Ensure draft release notes are in Markdown format
2. Include all expected sections (What's New, Issues Fixed, Limitations, etc.)
3. Have draft reviewed by SME for technical accuracy
4. Verify documentation links are valid
5. Incorporate high-priority recommendations immediately
6. Re-run reviewer after major edits to confirm improvements

---

## Uninstall (If Needed)

```bash
/plugin uninstall release-notes
/plugin marketplace remove release-note-skills
```

---

## Version & Updates

**Current Version:** 1.0.0  
**Release Date:** July 3, 2026  
**Update Schedule:** Manual (`/plugin marketplace update release-note-skills`)

---

## Next Steps

1. **Install** using the two commands above
2. **Try it** on your next release note draft
3. **Share feedback** — what worked, what didn't
4. **Iterate** — improvements based on team input

---

## Questions?

- 📖 See full documentation on GitHub
- 💬 Contact anubhav02011993@gmail.com
- 🐛 Report issues: https://github.com/ac93able/release-note-skills/issues

---

**Ready to create professional release notes?**

```bash
/plugin marketplace add ac93able/release-note-skills
/plugin install release-notes@release-note-skills
```

Let us know how it goes! 🚀
