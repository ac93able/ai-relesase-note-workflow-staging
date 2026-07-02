# Release Notes Plugin

Professional AI-powered skills for generating and validating release notes. This plugin implements Stages 3-5 of the AI-powered release note workflow.

## What's Included

### release-note-writer
**Stages 3-4: Extraction/Summarization & Structuring/Classification**

Transforms normalised change items (commits, Jira issues, PRs) into structured, reader-friendly release note content:
- Extracts context from Git commits, Jira tickets, and Confluence design docs
- Generates customer-facing or internal release notes
- Produces clean Markdown output ready for human review
- Answers key questions: "What does this do?" and "How does this help customers?"

**Use when:** You have change data from git/Jira/Confluence and need to generate initial release note draft.

### release-note-reviewer
**Stage 5: Human Review & Enrichment**

Validates and improves draft release notes with professional quality checks:
- Assesses clarity (user-benefit language, plain English, readability)
- Checks completeness (all required sections, no gaps)
- Verifies consistency (terminology, tone, voice, formatting)
- Evaluates formatting (heading hierarchy, bullets, emphasis, links)
- Generates detailed HTML quality report with scores and actionable recommendations
- Provides quantitative scoring (0-100%) and improvement prioritization

**Use when:** You have a draft release note and need quality validation before human review.

## Installation

After adding the marketplace:

```bash
/plugin install release-notes@release-note-skills
```

## Quick Start

### Generate Release Notes

```bash
/release-notes:release-note-writer
```

**Input:** Normalised change items (JSON) from git/Jira/Confluence
**Output:** Markdown release notes in `release-notes-output/` folder

### Validate Release Notes

```bash
/release-notes:release-note-reviewer
```

**Input:** Draft release notes (Markdown)
**Output:** HTML quality assessment report in `release-notes-output/` folder

## Input & Output

### Writer Skill Input Format

```json
{
  "release_version": "2.3.0",
  "release_date": "2026-07-03",
  "release_type": "minor",
  "output_mode": "customer-facing",
  "items": [
    {
      "item_id": "CHG-2301",
      "type": "feature",
      "component": "auth-service",
      "title": "OAuth2 Provider Support",
      "impact": "user_facing",
      "jira_key": "PROJ-1234",
      "git_commits": ["a1b2c3d", "e4f5g6h"],
      "description": "Enables seamless integration with OAuth2 providers",
      "confluence_pages": ["OAuth2-Integration-Design"]
    }
  ]
}
```

### Output Locations

- **Writer output:** `release-notes-output/release-notes-{version}.md`
- **Reviewer output:** `release-notes-output/release-notes-review-{version}.html`

## MCP Dependencies

This plugin works best with:

- **Git MCP** (included by default) — Extract commit messages and diffs
- **Jira MCP** (optional) — Retrieve issue details, priorities, labels
- **Confluence MCP** (optional) — Pull design docs and architecture
- **Microsoft Learn MCP** (optional) — Reference professional writing standards

Configure these in your project's `.mcp.json` to unlock full capabilities.

## Workflow Integration

These skills implement Stages 3-5 of the 7-stage release note pipeline:

```
Stage 1: Change Discovery & Normalization
Stage 2: Data Enrichment & Validation
├─ Stage 3: Extraction & Summarization (release-note-writer)
├─ Stage 4: Structuring & Classification (release-note-writer)
├─ Stage 5: Human Review & Enrichment (release-note-reviewer)
Stage 6: Publication & Distribution
Stage 7: Metrics & Feedback Collection
```

See `workflow/future-ai-workflow.md` in the main project for the complete pipeline.

## Key Features

### Writer Skill
- ✓ User-benefit focused descriptions
- ✓ Minimalist, clear language
- ✓ Structured output (What's New, Enhancements, Issues Fixed, etc.)
- ✓ Context-aware (customer vs. internal modes)
- ✓ Markdown formatted and ready for publication

### Reviewer Skill
- ✓ 4-category quality scoring (Clarity, Completeness, Consistency, Formatting)
- ✓ Objective rubric-based evaluation
- ✓ Actionable improvement recommendations (prioritized by impact)
- ✓ Completeness checklist validation
- ✓ Styled HTML reports with visual scoring

## Best Practices

### For Writer Skill
- Use release tags for git queries: `git log v2.2.0..v2.3.0`
- Include Jira labels in normalised data for automatic categorization
- Provide component mapping for consistent naming
- Ensure Confluence pages exist and are properly titled
- Review AI output before reviewer stage (Stage 5)
- For internal notes, set `output_mode` to "internal" to include Git/Jira references

### For Reviewer Skill
- Use on all customer-facing release notes
- Review MCP-sourced data (Jira lookups, Confluence links)
- Focus on highest-impact recommendations first
- Flag items needing SME input (security, compliance, breaking changes)
- Share HTML report with team for collaborative review

## Typical Workflow

1. **Gather changes** from git log, Jira board, PRs
2. **Normalize** into JSON structure
3. **Run writer skill** → generates Markdown draft
4. **Review output** for technical accuracy
5. **Run reviewer skill** → generates HTML quality report
6. **Incorporate recommendations** into draft
7. **Final human review** and approval
8. **Publish** to customer-facing channels

## Limitations

- Writer requires pre-normalised input; cannot auto-discover changes
- Reviewer cannot assess domain-specific accuracy (requires SME)
- Reviewer may miss subtle breaking changes without explicit labeling
- Both skills depend on clear commit messages and complete descriptions

## Support & Feedback

- Questions? See the main repo README
- Issues? Report to anubhav02011993@gmail.com
- Want to contribute? See CONTRIBUTING.md in the main repository

## Related Documentation

- `workflow/future-ai-workflow.md` — Complete 7-stage pipeline
- `CHANGELOG.md` — Version history and updates
- GitHub issues — Known issues and feature requests

---

**Version:** 1.0.0  
**Last Updated:** July 3, 2026  
**Plugin Status:** Production Ready
