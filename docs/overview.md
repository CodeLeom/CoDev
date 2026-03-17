# CoDev Overview

## What is CoDev?

CoDev is a local AI developer copilot that helps you understand a codebase and generate technical content (articles, API docs, and Diátaxis-structured documentation) entirely on-device. No cloud APIs. No API keys. No data leaves your machine.

## Problem

Developers often struggle to:

- **Understand unfamiliar codebases**: Jumping into a new repo means reading through many files, tracing imports, and inferring architecture without guidance.
- **Turn understanding into documentation**: Even when they understand the code, turning that knowledge into usable docs (API references, tutorials, how-tos) is time-consuming.
- **Stay grounded**: Generic AI tools can hallucinate when asked about code. Developers need answers traceable to actual source files.

## Solution

CoDev provides:

- **Codebase Q&A (Ask)**: Ask questions about the indexed repository and get answers grounded in retrieved code.
- **Article generation**: Draft technical articles, overviews, and release notes from repository context.
- **API documentation**: Generate structured API reference docs from route handlers, controllers, and schemas.
- **Diátaxis documentation**: Produce different documentation types (tutorial, how-to, explanation, reference) suited to different reader goals.

All responses reference source file paths so you can verify and trace claims.

## Why Local AI?

- **Privacy**: Your code never leaves your machine. No telemetry, no cloud logging.
- **Offline**: After models are pulled, CoDev works without internet.
- **Reproducibility**: Same setup everywhere. No API rate limits or key management.
- **Reference implementation**: CoDev doubles as a learnable example of retrieval-augmented generation (RAG) with local inference.

## Who is this for?

- **Developers onboarding to a repo**: Quickly understand structure, auth flows, and key components.
- **DevRel engineers**: Generate documentation from real code instead of guessing.
- **Technical writers**: Use Diátaxis to produce fit-for-purpose docs.
- **Anyone learning RAG**: CoDev shows how to build local AI developer tools from scratch.
