# Helix Automation — AI-Powered Release Notes Pipeline

A reference guide covering all 7 stages of the automated release notes generation workflow, including inputs, outputs, data schemas, and tooling at each stage.

---

## Overview

The pipeline transforms raw signals from GitHub, Jira, Confluence/SDD, and CI/CD into published, multi-format release notes. AI handles extraction and structuring; humans handle review and sign-off.

```
GitHub · Jira · SDD · CI/CD
         ↓
   [Stage 1] Data ingestion
         ↓
   [Stage 2] Pre-processing & normalisation
         ↓
   [Stage 3] AI extraction & summarisation  ← LLM
         ↓
   [Stage 4] AI structuring & classification ← LLM
         ↓
   [Stage 5] Human review & enrichment
         ↓
   [Stage 6] Document generation
         ↓
   [Stage 7] Publish & distribute
```

---

## Stage 1 — Data Ingestion

**Purpose:** Pull raw signals from all source systems into the pipeline cache.

### Inputs

| Source | What is pulled | Format |
|---|---|---|
| GitHub REST API | Merged PRs, commit messages, release tags, branch diffs | JSON via API v3 |
| SDD / Confluence | Feature spec pages, design decisions, architecture diagrams | HTML / PDF via REST API |
| Jira / Linear API | Tickets with type, severity, fix version, assignee, resolution | JSON via REST API v3 |
| CI/CD Pipeline | Build logs, test pass/fail counts, benchmark output, artifact metadata | JSON / plaintext logs |

### Outputs

| Artifact | Contents |
|---|---|
| Raw PR objects | Title, body, diff summary, labels, author, linked issues, merged timestamp |
| Raw ticket objects | ID, summary, type, severity, fix version, status, resolution |
| SDD text chunks | Section title, content, source URL, last modified date |
| Build records | Version, test counts, pass rate, benchmark delta, pipeline link |

### Sample data schema

```json
{
  "id": "PR-2041",
  "title": "Add exponential backoff to scheduler",
  "body": "Implements configurable retry with exponential backoff and jitter...",
  "labels": ["enhancement", "scheduler"],
  "linked_ticket": "HA-1977",
  "merged_at": "2026-03-08T14:22:00Z",
  "diff_summary": "+342 -18 lines",
  "author": "jsmith"
}
```

### Tooling

- GitHub REST API v3
- Confluence REST API
- Jira REST API v3
- Jenkins / GitHub Actions API

---

## Stage 2 — Pre-processing & Normalisation

**Purpose:** Clean, deduplicate, classify by type, map to release version, and filter noise.

### Inputs

| Input | Source |
|---|---|
| Raw PR objects | Stage 1 |
| Raw ticket objects | Stage 1 |
| SDD text chunks | Stage 1 |
| Build records | Stage 1 |
| Release version config | YAML config file — git tag, fix-version field name, cutoff date |

### Outputs

| Artifact | Contents |
|---|---|
| Normalised change items array | Deduplicated items, each tagged with type and release version |
| Filtered-out items log | Bot commits, dependency bumps, internal tooling changes, duplicates |
| Ingestion summary | Counts by type, version coverage, dedup rate |

### Classification types

- `feature` — new capability or enhancement
- `defect` — bug fix
- `security` — CVE, security hardening, auth change
- `deprecation` — removal or end-of-life notice
- `breaking` — change that alters existing behaviour

### Sample data schema

```json
{
  "item_id": "CHG-2041",
  "release": "3.8.2",
  "type": "feature",
  "severity": null,
  "title": "Retry logic with exponential backoff",
  "sources": ["PR-2041", "HA-1977"],
  "labels": ["scheduler", "enhancement"],
  "raw_body": "Implements configurable retry with exponential backoff and jitter...",
  "sdd_refs": ["design/retry-logic.md#section-3"]
}
```

### Tooling

- Python scripts (dedup, version mapping)
- LangChain or custom parsers
- Rule-based classifier (type tagging)

---

## Stage 3 — AI Extraction & Summarisation

**Purpose:** LLM reads each normalised item and generates reader-friendly prose — feature summaries, defect descriptions, behavior change callouts, security flags, and API deltas.

### Inputs

| Input | Source |
|---|---|
| Normalised change items array | Stage 2 |
| SDD sections referenced by each item | Stage 1 (resolved via `sdd_refs`) |
| System prompt | Tone, audience (customer-facing vs internal), product name, section definitions |
| Few-shot examples | Sample good and bad summaries per change type |

### Outputs

| Artifact | Contents |
|---|---|
| Feature summary | Plain-English description, user benefit, link to docs |
| Defect description | Symptom, root cause, affected versions, fix confirmation |
| Behavior change description | What changed, who is affected, action required flag |
| Security flag | CVE candidate, affected component, preliminary severity |
| API change description | Endpoint, change type, migration hint |

### Sample data schema

```json
{
  "item_id": "CHG-2041",
  "type": "feature",
  "section": "enhancements",
  "summary": "The task retry engine now supports exponential backoff with configurable jitter, reducing thundering-herd failures under high concurrency.",
  "user_benefit": "Improves reliability for high-volume workflows.",
  "doc_link": "https://docs.helixautomation.io/v3.8/retry-logic",
  "action_required": false,
  "confidence": 0.94
}
```

### Tooling

- Claude API (claude-sonnet-4-6) or GPT-4o with JSON output mode
- Structured prompt template per change type
- Confidence scoring via self-evaluation prompt

### Key prompt parameters

```
System: You are a senior technical writer for Helix Automation.
        Audience: IT administrators and developers.
        Tone: Clear, direct, no marketing language.
        Output: JSON only, matching the enriched item schema.

User:   Change type: {type}
        PR title: {title}
        PR body: {raw_body}
        SDD section: {sdd_content}
        Linked ticket: {ticket_summary}
        Generate: summary, user_benefit, doc_link (if inferable), action_required
```

---

## Stage 4 — AI Structuring & Classification

**Purpose:** The LLM takes all enriched items and maps them to the correct release note sections, determines the release type, and generates prose blocks such as the Release Summary, Upgrade Notice, and Pre-upgrade Checklist.

### Inputs

| Input | Source |
|---|---|
| All enriched items array | Stage 3 |
| Section schema | Ordered list of allowed sections with descriptions and inclusion rules |
| Release metadata | Version number, release date, release type criteria (major/minor/hotfix) |
| Structuring prompt | How to write summaries, upgrade notices, known issue tables |

### Outputs

| Artifact | Contents |
|---|---|
| Structured document object | All sections populated, items assigned to the correct section |
| Release type classification | major / minor / hotfix with written justification |
| Generated prose blocks | Release Summary, Upgrade Notice, Pre-upgrade Checklist |
| Review flags list | Items with low confidence, security candidates, breaking changes |

### Sample data schema

```json
{
  "version": "3.8.2",
  "release_type": "minor",
  "release_date": "2026-03-10",
  "sections": {
    "summary": "Version 3.8.2 is a maintenance release delivering three targeted enhancements and four defect fixes. No breaking changes are introduced.",
    "whats_new": [
      {
        "item_id": "CHG-2041",
        "heading": "Scheduler: Retry logic with exponential backoff",
        "summary": "The task retry engine now supports exponential backoff...",
        "doc_link": "https://docs.helixautomation.io/v3.8/retry-logic"
      }
    ],
    "behavior_changes": [],
    "defect_fixes": [],
    "known_issues": [],
    "security": [],
    "api_changes": [],
    "eol": [],
    "rollout": []
  },
  "review_flags": [
    "CHG-2019 — confidence 0.61, possible breaking change, verify with eng team"
  ]
}
```

### Release type criteria

| Criteria met | Release type |
|---|---|
| Any breaking change OR removed API OR major new subsystem | `major` |
| Enhancements only, no breaking changes | `minor` |
| Security CVE fix only OR critical defect fix only | `hotfix` |

### Tooling

- Claude API (claude-sonnet-4-6) with JSON mode
- Section schema enforced via structured output / tool-calling
- Release type classifier (rule-based + LLM fallback)

---

## Stage 5 — Human Review & Enrichment

**Purpose:** Technical writers verify AI accuracy, enrich content with context the AI cannot infer, and obtain sign-off from SMEs, the security team, and legal.

### Inputs

| Input | Source |
|---|---|
| Structured document JSON | Stage 4 |
| Review flags list | Stage 4 |
| SME input | Product managers, security team, legal, support leads |
| Style guide | Approved terminology, formatting rules, tone of voice |

### Outputs

| Artifact | Contents |
|---|---|
| Approved document JSON | Corrections applied, enrichment added, all flags resolved |
| Edit log | Tracked changes — AI-generated vs human-edited fields |
| Signed-off security advisory | Final CVE text approved by security team (if applicable) |
| Approval record | Reviewer name, timestamp, sign-off status per section |

### Review checklist

- [ ] Feature summaries are accurate and match the actual PR / SDD
- [ ] Defect descriptions are customer-appropriate (no internal code references)
- [ ] Breaking changes and behavior changes are complete and clearly worded
- [ ] Security items reviewed and approved by the security team
- [ ] API changes validated against the actual API diff
- [ ] EOL dates confirmed against the product lifecycle policy
- [ ] Rollout dates confirmed with the release engineering team
- [ ] Pre-upgrade checklist steps verified as complete and accurate

### Sample data schema

```json
{
  "version": "3.8.2",
  "approved_by": "Jane Smith",
  "approved_at": "2026-03-09T11:45:00Z",
  "sections_approved": [
    "summary", "whats_new", "defect_fixes", "security", "api_changes"
  ],
  "edits_made": 7,
  "flags_resolved": 2,
  "security_sign_off": {
    "reviewer": "Alex Lee",
    "team": "Security",
    "approved_at": "2026-03-09T10:30:00Z"
  }
}
```

### Tooling

- Custom review UI or Google Docs / Notion with comment workflow
- JSON diff viewer for AI vs human edits
- Approval workflow (Jira ticket or custom sign-off form)

---

## Stage 6 — Document Generation

**Purpose:** Render the approved document JSON into all required output formats using templates.

### Inputs

| Input | Source |
|---|---|
| Approved document JSON | Stage 5 |
| Document templates | `.docx` template (Word styles, header/footer), HTML/Markdown/PDF templates |
| Brand assets | Logo, colour palette, font configuration |
| Version manifest | Previous versions for EOL table cross-referencing |

### Outputs

| Format | Use case |
|---|---|
| `.docx` | Customer-facing Word document with styles, tables, and hyperlinks |
| `.pdf` | Paginated, print-ready document with bookmarks |
| `.md` | Developer portals, GitHub releases, readme updates |
| `.html` | Docs portal, inline styling, anchor links |
| `.json` feed | Structured data for in-product What's New widget |

### Sample render config

```json
{
  "input": "approved_3.8.2.json",
  "templates": {
    "docx": "templates/release-notes.docx",
    "html": "templates/portal.html.j2",
    "md":   "templates/github-release.md.j2",
    "pdf":  "templates/release-notes-print.html.j2"
  },
  "outputs": {
    "docx": "dist/Helix_3.8.2_Release_Notes.docx",
    "html": "dist/3.8.2/index.html",
    "md":   "dist/3.8.2/RELEASE.md",
    "pdf":  "dist/Helix_3.8.2_Release_Notes.pdf",
    "json": "dist/3.8.2/whats-new.json"
  }
}
```

### Tooling

- **Word (.docx):** Docx.js or python-docx
- **PDF:** Pandoc + WeasyPrint or Puppeteer (headless Chrome)
- **Markdown:** Jinja2 template
- **HTML:** Jinja2 or Handlebars template
- **JSON feed:** Direct serialisation from approved document JSON

---

## Stage 7 — Publish & Distribute

**Purpose:** Deliver all output formats to all channels simultaneously on the release date.

### Inputs

| Input | Source |
|---|---|
| Rendered output files (.docx, PDF, HTML, Markdown, JSON) | Stage 6 |
| Distribution config | Target channels, audience segments, scheduling (YAML) |
| Recipient list | Customer tiers, internal teams, mailing lists |

### Outputs

| Channel | Output |
|---|---|
| Docs portal | Versioned URL, search-indexed, linked from changelog index |
| Customer email | Formatted release summary with CTA to full release notes |
| Slack / Teams | Short summary and link, posted to relevant channels |
| In-product banner | What's New notification triggered for users on the upgraded version |
| Distribution report | Open rates, page views, download counts |

### Sample distribution record

```json
{
  "version": "3.8.2",
  "published_at": "2026-03-10T08:00:00Z",
  "channels": {
    "docs_portal": {
      "url": "https://docs.helixautomation.io/3.8.2",
      "status": "live"
    },
    "email": {
      "sent": 4820,
      "status": "delivered",
      "open_rate": "38%"
    },
    "slack": {
      "channel": "#releases",
      "workspace": "helix-internal",
      "ts": "1741600800.000"
    },
    "in_product": {
      "banner_active": true,
      "target_version": "3.8.2+",
      "impressions": 1240
    }
  }
}
```

### Tooling

- Docs portal: ReadMe.io, Confluence, or static site (Hugo / Docusaurus)
- Email: Mailchimp or SendGrid
- Slack / Teams: Incoming webhook
- In-product banner: Feature flag platform (LaunchDarkly) or custom API

---

## End-to-end data flow summary

| Stage | Input format | Output format | AI involvement |
|---|---|---|---|
| 1 — Ingestion | API responses (JSON, HTML, logs) | Raw JSON arrays | None |
| 2 — Normalisation | Raw JSON arrays + YAML config | Normalised JSON array | None (rule-based) |
| 3 — Extraction | Normalised JSON + prompts | Enriched JSON per item | LLM (primary) |
| 4 — Structuring | Enriched JSON + section schema | Structured document JSON | LLM (primary) |
| 5 — Review | Structured JSON + review UI | Approved JSON + audit trail | Human (primary) |
| 6 — Generation | Approved JSON + templates | .docx, .pdf, .md, .html, .json | None (template engine) |
| 7 — Distribution | Output files + config | Published URLs + delivery receipts | None |

---

## Recommended tech stack

| Layer | Tool options |
|---|---|
| Orchestration | Apache Airflow, Prefect, GitHub Actions |
| API connectors | Python `requests`, PyGithub, `atlassian-python-api` |
| AI model | Claude API (claude-sonnet-4-6), OpenAI GPT-4o |
| Prompt management | LangChain, PromptLayer, custom YAML templates |
| Document generation | Docx.js, python-docx, Pandoc, WeasyPrint |
| Storage | AWS S3 / Azure Blob for artifacts, PostgreSQL for metadata |
| Review UI | Custom web app, Retool, or Notion |
| Publishing | ReadMe.io, Docusaurus, Mailchimp, Slack webhooks |

---

*Last updated: June 2026*
