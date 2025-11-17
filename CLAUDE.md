# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an n8n community node package that integrates Synthflow AI's voice agent API with n8n workflows. The package allows users to initiate AI-powered outbound phone calls through n8n automation workflows.

## Architecture

### Core Components

- **Node Implementation** (`nodes/Synthflow/Synthflow.node.ts`): Main node class that implements `INodeType`. Defines the UI properties, operations, and execution logic for making API calls to Synthflow.
  
- **Credentials** (`credentials/SynthflowApi.credentials.ts`): Implements `ICredentialType` for API token authentication using Bearer token pattern. Includes credential testing against the `/v2/calls` endpoint.

### Key Patterns

- **n8n Node Structure**: The node uses n8n's declarative property system where the `description` object defines both UI and behavior. Operations are configured through the `properties` array using various field types (string, collection, fixedCollection).

- **Request Handling**: Uses n8n's `httpRequestWithAuthentication` helper which automatically injects credentials. The base URL (`https://api.synthflow.ai`) is defined in `requestDefaults`.

- **Custom Variables**: Implements a fixedCollection for dynamic key-value pairs that get transformed from n8n's nested array structure into a flat object for the API request (see lines 215-225 in Synthflow.node.ts).

- **Error Handling**: Supports n8n's `continueOnFail` pattern to allow workflows to continue even when individual items fail.

## Development Commands

### Build
```bash
npm run build
```
Compiles TypeScript to `dist/` directory and copies icon files using Gulp.

### Watch Mode
```bash
npm run dev
```
Runs TypeScript compiler in watch mode for active development.

### Linting
```bash
npm run lint       # Check for linting issues
npm run lintfix    # Auto-fix linting issues
```
Uses ESLint with n8n-specific plugin (`eslint-plugin-n8n-nodes-base`).

### Formatting
```bash
npm run format
```
Runs Prettier on `nodes/` and `credentials/` directories.

### Testing During Development

To test changes in a local n8n instance:

```bash
# In this directory
npm run build
npm link

# In your n8n installation directory  
npm link n8n-nodes-synthflow

# Restart n8n to load changes
```

After making changes, rebuild and restart n8n to see updates.

## File Structure

```
credentials/
  └── SynthflowApi.credentials.ts    # API authentication
nodes/
  └── Synthflow/
      ├── Synthflow.node.ts          # Node implementation
      └── synthflow.svg              # Node icon
dist/                                # Compiled output (generated)
```

## TypeScript Configuration

- **Target**: ES2019 with CommonJS modules
- **Strict Mode**: Enabled with `noUnusedLocals` and `noUnusedParameters`
- **Compilation**: Only includes `credentials/**/*` and `nodes/**/*`
- **Output**: Declaration files and source maps are generated

## API Integration

The node integrates with Synthflow AI's v2 API:

- **Endpoint**: `POST /v2/calls`
- **Authentication**: Bearer token via Authorization header
- **Required Fields**: `model_id`, `phone`, `name`
- **Optional Fields**: `lead_email`, `lead_timezone`, `prompt`, `greeting`, `custom_variables`

Phone numbers must be in E.164 format (e.g., +1234567890).

## Publishing

The `prepublishOnly` script runs build and linting with stricter rules (`.eslintrc.prepublish.js`) before npm publish. Only the `dist/` directory is included in the published package.


