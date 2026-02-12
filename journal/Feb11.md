# Building a Personal Finance Dashboard with AI (Day 1)

I kicked off this project on February 11 with a clear goal: build a greenfield personal finance app using AI-assisted development, and document what the process actually feels like in practice. I wanted to capture both sides honestly—where things were frictionless and where they were not.

## What Went Smoothly

One of the biggest wins was environment setup and portability. GitHub Codespaces made it easy to work across multiple machines. I moved between my desktop at home and a laptop while I was out, and the experience stayed consistent with very little setup overhead.

The frontend stack also came together quickly. Getting Next.js and the rest of the client-side foundation in place was straightforward, which helped me spend more time on product direction instead of initial scaffolding.

## Where I Hit Friction

The main snag was database setup. I initially planned to use PostgreSQL, but setup in the dev container started to slow progress. Rather than get stuck on infrastructure details this early, I switched to SQLite.

That tradeoff was the right move for this stage: lower setup complexity, faster iteration, and better alignment with the immediate goal of proving the concept.

## Progress So Far

- Seeded the database successfully.
- Used Prisma to inspect and visualize SQLite data.
- Prompted an update to the default Next.js page.
- Generated a general personal finance dashboard quickly, with responsive behavior out of the box.

## Plan for February 12

Next, I want to expand beyond a single page and start wiring in app behavior:

- Add several additional pages.
- Connect routes and screen interactions.
- Persist UI interactions to the database and reflect updates back in the interface.

This phase should make the UI architecture clearer and show which pieces are worth extracting into reusable components. It should also create a good opportunity for isolated testing—both for database operations and individual UI components.