# MiraDay documentation

Migrated from `mira-agents/mira-docs` (Next.js/Fumadocs).
Preserve the source wording in English, simplified Chinese, traditional Chinese,
and Japanese. Do not generate new translations as part of format conversion.
Documentation lives in `{en,zh,zh-TW,ja}/docs`. Blog content is managed separately
in WordPress; do not restore blog pages or navigation here. Navigation and site branding live
in `docs.json`; shared styles are in `style.css` and diagrams in `snippets/`.
Validate with `mint validate` and `mint broken-links` before publishing.

# Documentation project instructions

## About this project

- This is a documentation site built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Use the Mintlify MCP server, `https://mcp.mintlify.com`, to edit content and settings via MCP
- Use the Mintlify docs MCP server, `https://www.mintlify.com/docs/mcp`, to query information about using Mintlify via MCP

## Terminology

{/* Add product-specific terms and preferred usage */}
{/* Example: Use "workspace" not "project", "member" not "user" */}

## Style preferences

{/* Add any project-specific style rules below */}

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references

## Content boundaries

{/* Define what should and shouldn't be documented */}
{/* Example: Don't document internal admin features */}
