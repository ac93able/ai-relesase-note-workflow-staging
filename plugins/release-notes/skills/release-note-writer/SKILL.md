---
name: release-note-writer
description: Transforms normalised change items into structured, reader-friendly release note content. Use this when you have normalised change data (commits, Jira issues, PR descriptions) and need to generate an initial release note draft with user-focused descriptions. Stages 3-4 of the AI-powered release note pipeline (extraction and summarisation, then structuring and classification).
output_dir: release-notes-output
---

# Release Note Writer Skill

**Related Documentation**: This skill implements Stages 3-4 of the 7-stage release note workflow. See `workflow/future-ai-workflow.md` for the complete pipeline definition, including data flows, schemas, and tooling for all stages.

## What This Skill Does

Transforms normalised change items from the release note pipeline (Stage 2 output) into structured, reader-friendly release note content. The skill extracts context from Git commits, Jira tickets, and Confluence design docs, then generates user-focused feature descriptions, bug fix explanations, and enhancement notes.

Output is formatted as clean Markdown suitable for customer-facing or internal audiences.

## When to Use This Skill

Use this skill when you have:
- Normalised change data (commits, Jira issues, PR descriptions) ready for AI processing
- Need to generate initial release note draft from raw change information
- Want AI to structure and categorise changes automatically
- Need consistent, user-benefit-focused descriptions for multiple change items

## How It Works

1. Ingests normalised change items from Stage 2 pipeline
2. Uses Git MCP to extract full commit messages and diffs for context
3. Uses Jira MCP to retrieve issue details, priorities, labels, and fix versions
4. Uses Confluence MCP to pull design docs and architecture for technical accuracy
5. Structures changes into release note sections (What's New, Enhancements, Issues Fixed, etc.)
6. Writes user-focused descriptions answering two key questions:
   - How does this help customers?
   - How do I use it?
7. Outputs formatted Markdown ready for human review

## Input Format

The skill expects normalised change items in this structure:

```json
{
  "release_version": "2.3.0",
  "release_date": "2026-03-15",
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
      "description": "Enables seamless integration with OAuth2 providers for external identity management",
      "related_docs": ["auth-oauth2", "sso-setup"],
      "confluence_pages": ["OAuth2-Integration-Design", "Enterprise-Auth-Architecture"]
    }
  ]
}
```

## Output Format

Clean Markdown release notes structured by template sections:

```markdown
# Release Notes - Version 2.3.0

## Welcome / Introduction
[Introduction with version number]

## What's New

### [Category]
#### [Feature Title]
[User-focused description answering "How does this help?" and "How do I use it?"]

## Enhancements
[Before/after details for improvements]

## Issues Fixed
[Bug descriptions: problem, root cause, resolution]

## Considerations
[System requirements, prerequisites, compatibility notes]

## Known Issues
[List or "None reported at this time"]

## Limitations
[Product constraints and workarounds]

## Supported Languages
[Language support list]

## Acknowledgements
[Third-party libraries and versions]
```

## Key Principles

- **Minimalism**: Concise descriptions (1-3 sentences per item). Focus on impact, not implementation.
- **User-Benefit Language**: Explain "how does this help me?" with concrete examples.
- **Plain English**: Accessible to decision makers, admins, and end users. Avoid jargon.
- **Passive Voice in What's New**: "OAuth2 is now supported" rather than "We added OAuth2 support."
- **Structured Authoring**: Use headers, bullet points, and tables for scannability.
- **Hyperlinks**: Provide documentation links for deeper information.
- **Context-Aware Output**: Skip Jira numbers in customer-facing mode; include them in internal mode.

## MCP Dependencies

This skill requires access to:

- **Git MCP**: Extract commit messages, diffs, and authorship for change context
  - Queries: `git show [commit]`, commit history
  
- **Jira MCP**: Retrieve issue details, priorities, labels, fix versions
  - Queries: Issue lookups by key (PROJ-1234), JQL searches
  
- **Confluence MCP**: Pull design docs, architecture specs, technical details
  - Queries: Page retrieval by title, CQL searches in ENG space
  
- **Microsoft Learn MCP**: Reference professional style guidance (optional)
  - Queries: Release notes best practices, technical writing standards

## Example: Feature Item

**Input:**
```json
{
  "item_id": "CHG-2301",
  "type": "feature",
  "component": "auth-service",
  "title": "OAuth2 Provider Support",
  "jira_key": "PROJ-1",
  "git_commits": ["4dbd1dfc"],
  "confluence_pages": ["OAuth2-Integration-Design"]
}
```

**Output:**
```markdown
### Authentication

#### OAuth2 Provider Support

OAuth2 provider integration is now available, enabling seamless connection with external identity providers. This simplifies enterprise authentication setup by leveraging existing organisational identity infrastructure.

**User benefit**: Organisations can now use Azure AD, Okta, Google Workspace, or other OAuth2-compatible identity providers for seamless single sign-on (SSO), eliminating the need for separate credential management.

**How to use**:
1. Navigate to Administration > Authentication > OAuth2 Providers
2. Click Add Provider and select your identity provider
3. Enter discovery endpoint or manual endpoints
4. See [OAuth2 Configuration Guide](https://docs.example.com/auth-oauth2) for detailed setup
```

## Limitations

- Requires pre-normalised input from Stage 2 pipeline
- Cannot assess user-facing impact automatically (requires human judgment)
- May miss subtle breaking changes without explicit labeling
- Depends on clear commit messages and complete Jira descriptions
- Output focuses on feature/bug descriptions, not marketing or sales messaging

## Tips for Best Results

- Use release tags for git queries to set time boundaries: `git log v2.2.0..v2.3.0`
- Include Jira labels in normalised data for automatic categorisation
- Provide component mapping for consistent naming across sections
- Ensure Confluence pages exist and are properly titled
- Review AI output for accuracy before human review stage (Stage 5)
- For internal notes, set output_mode to "internal" to include Jira/Git references
- Test with 5-10 items before processing large batches

## Output Handling

**IMPORTANT**: After generating the release note markdown, you MUST save it to a file in the `release-notes-output` folder using the Write tool. Follow this pattern:

1. Generate the complete release note content as markdown
2. Use the Write tool to save to: `release-notes-output/release-notes-{version}.md`
   - Replace `{version}` with the release version (e.g., "2.3.0")
3. Example path: `release-notes-output/release-notes-2.3.0.md`
4. Confirm the file was created successfully

The output file should contain the complete, formatted markdown release notes ready for review.
