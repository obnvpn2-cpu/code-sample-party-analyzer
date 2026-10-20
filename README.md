# Party Analyzer Code Sample

This repository is a **public, recruitment-oriented code sample** extracted and simplified from the implementation of PokeDoctor, a personal web application.

It intentionally contains only logic that is safe to publish publicly.

## Included
- Type-effectiveness calculation
- Party-wide weakness / resistance analysis
- Role classification using weighted scoring
- Candidate recommendation using multiple weighted signals
- Unit tests for the core algorithms

## Intentionally excluded
This sample does **not** contain:
- API keys, secrets, tokens, credentials, or environment-variable values
- Production configuration
- Authentication / authorization code
- Database connection details
- Private URLs or internal endpoints
- User data or personal information
- Proprietary production datasets
- LLM / external API integration code
- Deployment configuration from the original service

The code has been reorganized so the algorithms can be understood and tested without the original application's private dependencies.

## What to look at
- Type-effectiveness lookup over the 18-type chart, including dual types and immunities
- Party-wide defensive analysis that separates stacked weaknesses from ones a teammate can safely switch into
- Stat-based role scoring with tiered thresholds instead of hard cut-offs
- Candidate ranking that combines several weighted signals into one explainable score

## Suggested reading order
1. `src/type-effectiveness.ts`
2. `src/party-analyzer.ts`
3. `src/role-classifier.ts`
4. `src/candidate-filter.ts`

## Tech stack
- TypeScript
- Vitest
- Node.js 22.12 or later is required (22.x, 24.x, or 26+, matching Vitest 5)

## Run
```bash
npm install
npm test
npm run typecheck
```

## Structure
```text
src/
  types.ts
  type-effectiveness.ts
  role-classifier.ts
  party-analyzer.ts
  candidate-filter.ts
tests/
  type-effectiveness.test.ts
  party-analyzer.test.ts
  role-classifier.test.ts
  candidate-filter.test.ts
```

This repository is not the full source code of PokeDoctor. It is a curated sample containing only code that can be safely shared for recruitment and code-review purposes.
