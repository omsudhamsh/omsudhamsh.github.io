---
title: Static Content Systems for Small Sites
date: 2026-07-08
excerpt: How I keep a portfolio lightweight, editable, and GitHub Pages-friendly without a backend.
tags: Static Site, GitHub Pages, Content
slug: static-content-systems
---

The simplest content system is the one you can update without opening a new toolchain.

For a personal site, that usually means keeping the content in plain files, making the metadata easy to edit, and letting the browser do the rest. No database, no auth flow, no deployment step beyond the site itself.

## What I want from the setup

- A preview card on the homepage.
- A dedicated page for the full post.
- A Markdown source file that stays readable in any editor.
- A single index file that lists the posts in the order I want.

That combination keeps the site static while still leaving room for growth. Adding a post should feel like adding a note, not provisioning an app.

## Why Markdown works here

Markdown is enough for short technical writing because it keeps the focus on the text. Headings, lists, links, and code blocks are usually all a post needs.

For a portfolio site, the extra benefit is operational: the browser can render it directly with a lightweight parser, and GitHub Pages can serve it without any backend support.

## The practical rule

If a change requires moving through more than one system, it is probably too heavy for a personal site.

For this blog, the rule is simple:

1. Write the post in Markdown.
2. Add one metadata entry to the index.
3. Publish the site.

That is enough structure to stay organized without turning the site into a CMS project.