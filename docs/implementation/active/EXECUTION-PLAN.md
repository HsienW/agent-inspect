# Active execution plan — v6.16.2 Canonical Docs

**Train:** `v6.16.2-canonical-docs`  
**Named:** `agentinspect-repository-health-evidence-ux-v6.16-to-pre-v7`  
**Target:** patch `6.16.2`  
**Baseline:** published `6.16.1`  
**Authority:** [../ROADMAP.md](../ROADMAP.md) §8

## Goal

Repository Markdown is the single prose source for the website. Delete the manual `doc-content.tsx` switch.

## Chunks

| ID | Scope |
|----|-------|
| 6.16.2-0 | Docs manifest + markdown loader |
| 6.16.2-1 | Render pipeline + delete doc-content |
| 6.16.2-2 | Nav/TOC/alias redirects + validators |
| 6.16.2-3 | Generated AI/product facts hooks (as needed) |
| 6.16.2-4 | Release readiness and publication |

## Forbidden

New package; schema break; default upload; fabricating partners.
