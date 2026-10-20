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

## Tech stack
- TypeScript
- Vitest

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
  party-analyzer.test.ts
  candidate-filter.test.ts
```

This repository is not the full source code of PokeDoctor. It is a curated sample containing only code that can be safely shared for recruitment and code-review purposes.
