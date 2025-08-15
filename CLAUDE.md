# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the acady-api-builder library - a TypeScript library for building platform-independent REST APIs in combination with the acady framework. The library provides a unified API interface that can work with different platforms like Express.js and AWS API Gateway.

## Architecture

### Core Components

1. **ApiBuilder** (src/core/api-builder.ts): Central routing and request handling class that:
   - Registers HTTP routes (GET, POST, PUT, DELETE, etc.)
   - Processes incoming requests through converters
   - Matches routes and executes handlers
   - Handles errors and returns appropriate responses

2. **Platform Converters**: Transform platform-specific requests/responses to/from the unified Acady format
   - **ExpressConverter** (src/converters/express-converter.ts): Handles Express.js requests/responses
   - **AwsGatewayConverter** (src/converters/aws-gateway-converter.ts): Handles AWS API Gateway events (supports both v1.0 and v2.0)

3. **Request/Response DTOs**:
   - **AcadyApiRequest**: Unified request format with headers, body, path params, query params
   - **AcadyApiResponse**: Unified response format with status, headers, body, and optional base64 encoding

4. **ApiHeaders**: Custom headers implementation for managing HTTP headers across platforms

## Development Commands

```bash
# Build the TypeScript project
npm run build

# Clean build directory
npm run clean

# Run tests
npm run test

# Prepare package (clean + build)
npm run prepare
```

## Testing

- Tests use Jest with ts-jest for TypeScript support
- Test files should match pattern: `(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$`
- Run a single test: `npx jest path/to/test.ts`

## Key Implementation Details

- The library uses CommonJS module system
- TypeScript target: ES2019
- Main entry point: build/index.js (compiled from src/index.ts)
- All source files are in the `src/` directory
- Built files go to `build/` directory

## Request Flow

1. Platform-specific event arrives (Express request or AWS Gateway event)
2. ApiBuilder.process() receives the event with the event type
3. Appropriate converter transforms the event to AcadyApiRequest
4. RouteMatchingHelper finds the best matching route
5. Route handler processes the request and returns AcadyApiResponse
6. Converter transforms response back to platform-specific format

## Important Notes

- The library uses npm (package-lock.json present, no yarn.lock)
- Body parsing supports JSON content type detection and automatic parsing
- AWS Gateway converter supports both HTTP API v1.0 and v2.0 event formats
- Error handling returns 404 for unmatched routes and 500 for exceptions