---
name: release-note-reviewer
description: Validates and improves draft release notes with professional quality checks and specific improvement recommendations. Use this when you have a draft release note and need quality validation before human review. Outputs a styled HTML quality assessment report with scores, rubric results, and actionable feedback. Stage 5 of the AI-powered release note pipeline (human review and enrichment).
output_dir: release-notes-output
---

# Release Note Reviewer Skill

**Related Documentation**: This skill assists Stage 5 (Human Review & Enrichment) of the 7-stage release note workflow. See `workflow/future-ai-workflow.md` for the complete pipeline definition, including all stages, data schemas, and integration points.

## What This Skill Does

Validates and improves draft release notes with professional quality checks. Reads a draft release note and evaluates it against a structured rubric (clarity, completeness, consistency, formatting). Generates detailed feedback with specific improvement recommendations and outputs a styled HTML quality assessment report.

This is not an approval step (humans approve); this is an enhancement step to improve the draft before human review.

## When to Use This Skill

Use this skill when you have:
- A draft release note (from Writer Skill or manual draft)
- Need quality validation before human review
- Want specific, actionable improvement suggestions
- Need to identify missing sections or unclear descriptions
- Want quantitative quality scoring and visual feedback

## How It Works

1. Ingests draft release note (Markdown format, full document)
2. Validates against completeness checklist (all required sections)
3. Assesses clarity: readability, plain English, user benefit statements
4. Checks consistency: tone, terminology, voice, formatting alignment
5. Evaluates formatting: heading hierarchy, bullets, emphasis, links
6. Queries MCPs to cross-check technical accuracy:
   - Jira: Verify referenced issue numbers exist and are closed
   - Confluence: Validate documentation links are accurate
   - Microsoft Learn: Reference professional writing standards
7. Generates detailed feedback with examples and suggestions
8. Produces HTML report with:
   - Overall readiness score (0-100%)
   - Category breakdown (clarity, completeness, consistency, formatting)
   - Strengths (what's working well)
   - Recommendations (prioritised by impact)
   - Completeness checklist
   - Action items table

## Input Format

Draft release note in Markdown format:

```markdown
# Release Notes - Version 2.3.0

## Welcome
[Introduction]

## What's New
[Features and enhancements]

## Issues Fixed
[Bug fixes]

[Additional sections...]
```

## Output Format

HTML quality assessment report with:

**Overall Readiness**: Percentage score (e.g., "87% Ready for Human Review")

**Category Scores**:
- Clarity (30%): User-focused descriptions, plain English
- Completeness (25%): All template sections, no gaps
- Consistency (25%): Terminology, tone, voice, formatting
- Formatting (20%): Hierarchy, bullets, emphasis, links

**Sections**:
- Strengths (5 items highlighting what's working)
- Recommendations (prioritised as high/medium/low)
- Completeness checklist (with checkmarks)
- Action items table (with priority and effort estimates)
- Publication readiness status

## Key Principles

- **Objective Rubric**: Scoring based on defined criteria, not subjective preference
- **Actionable Feedback**: Recommendations include examples and rationale
- **No Approval Authority**: Identifies issues; humans make approval decisions
- **Cross-Check Accuracy**: Validates technical claims against Jira, Confluence, design docs
- **Completeness Focus**: Ensures all required sections present and complete
- **Professional Standards**: References Microsoft Learn guidance for clarity and tone

## Rubric Categories

### Clarity (30%)

Each feature description should answer:
1. What does this do?
2. How does it help customers?
3. How do I use it?

Checks:
- Jargon minimised, plain English used
- Sentence length appropriate (15-20 words average)
- Technical terms explained or linked
- Concrete examples provided where helpful

### Completeness (25%)

Required sections per template:
- Welcome/Introduction
- What's New (Features/Enhancements)
- Issues Fixed
- Considerations
- Known Issues
- Limitations
- Supported Languages
- Acknowledgements

Checks:
- All sections present
- No obvious missing information
- Links are functional (sampled)
- Version numbers included

### Consistency (25%)

Checks:
- Terminology consistent across sections
- Tone consistent (active/passive balance)
- Voice appropriate per section (passive preferred in What's New)
- Formatting follows template structure
- Abbreviations used consistently

### Formatting (20%)

Checks:
- Proper heading hierarchy (H1, H2, H3)
- Bullets used appropriately
- Tables formatted correctly
- Links properly formatted
- Emphasis (bold, italics) used sparingly and correctly

## MCP Dependencies

This skill uses MCPs for validation:

- **Jira MCP**: Verify referenced issue numbers exist and are closed
  - Queries: Issue lookup by key (PROJ-1234)
  
- **Confluence MCP**: Check documentation links are valid
  - Queries: Page retrieval to verify existence
  
- **Microsoft Learn MCP**: Reference professional writing standards
  - Queries: Clarity and tone guidance

## Example: Review Output

**Input Draft**:
```markdown
# Release Notes - Version 2.3.0

## OAuth2 Provider Support
OAuth2 provider integration is now available, enabling seamless connection 
with external identity providers. This simplifies enterprise authentication 
setup by leveraging existing organisational identity infrastructure.

How to use: Navigate to Administration > Authentication > OAuth2 Providers...
```

**Output HTML Report**:
- Overall Score: 87% (Ready for Human Review)
- Clarity: 88% (User benefits clearly stated)
- Completeness: 85% (Missing Known Issues section)
- Consistency: 88% (Voice mostly passive)
- Formatting: 92% (Clean structure)

**Strengths**:
1. Excellent user-benefit language
2. Clear setup instructions
3. Proper section hierarchy

**Recommendations**:
1. Add Known Issues section (even if empty)
2. Add Limitations section
3. Add rate limit tier comparison table

## Limitations

- Cannot approve release (human approval required)
- Cannot assess domain-specific accuracy (requires SME review)
- May not catch subtle breaking changes
- Style guidance is generalised (not company-specific)
- Subjective aspects (marketing tone) need human judgment

## Tips for Best Results

- Review all MCP-sourced data: Jira lookups, Confluence links, design docs
- Focus recommendations on highest-impact improvements first
- Provide specific examples in feedback
- Link feedback back to template or Microsoft Learn guidance
- Flag items needing SME input (security, compliance, API compatibility)
- Test with 2-3 release notes before processing full batch
- Use HTML output for visual presentation; share with team for review

## Output Handling

**IMPORTANT**: After generating the HTML quality assessment report, you MUST save it to a file in the `release-notes-output` folder using the Write tool. Follow this pattern:

1. Generate the complete HTML quality assessment report
2. Use the Write tool to save to: `release-notes-output/release-notes-review-{version}.html`
   - Replace `{version}` with the release version (e.g., "2.3.0")
3. Example path: `release-notes-output/release-notes-review-2.3.0.html`
4. Confirm the file was created successfully

The output file should contain the complete, styled HTML report ready for team review.
