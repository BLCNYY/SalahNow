# Contributing to Salah[Now]

Thank you for your interest in contributing. This guide explains how to set up your environment, propose changes, and submit high-quality pull requests.

## Getting Started

1. Fork the repository and clone your fork.
2. Install Node.js 18 or later.
3. Install dependencies with `npm install`.
4. Run `npm run dev` to start the development server.

## Development Workflow

- Create a feature branch from `main` with a descriptive name such as `feature/add-language` or `fix/timezone-bug`.
- Keep changes focused and incremental to simplify reviews.
- Use TypeScript types instead of `any` and favor small, composable components.
- Ensure UI changes work on both mobile and desktop and respect accessibility expectations.
- Keep translations in sync when adding UI text.

## Quality Checks

Before opening a pull request:

- Run `npm run lint` to catch style or accessibility issues flagged by ESLint.
- Verify the app builds with `npm run build` if you change configuration or dependencies.
- Manually exercise core flows for location selection, language switching, and prayer time loading.

## Commit and PR Guidelines

- Write clear commit messages that summarize the change.
- Include screenshots for visual updates when possible.
- In pull requests, describe what changed, why it changed, and how it was tested.
- Link related issues or discussions to provide context.

## Reporting Issues

Use GitHub issues for bugs and feature ideas. Provide steps to reproduce, expected versus actual behavior, and environment details such as browser and operating system.
