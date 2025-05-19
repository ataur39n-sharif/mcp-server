# Model Context Protocol (MCP) Server

This project implements a Model Context Protocol server using TypeScript and Express.js. It provides both HTTP and stdio-based transport layers for MCP communication.

## Features

- Express.js based HTTP server implementation
- Stdio-based transport layer support
- Session management for client connections
- Built-in tools and resources:
  - Basic arithmetic operations
  - BMI calculator
  - Dynamic greeting generator
  - Weather data fetching (example of external API integration)

## Prerequisites

- Node.js (Latest LTS version recommended)
- TypeScript
- npm or pnpm package manager

## Installation

```bash
# Install dependencies
pnpm install

# Build the project
pnpm run build
```

## Usage

### Starting the HTTP Server

```bash
# Development mode with hot reload
pnpm run dev

# Production mode
pnpm start
```

The server will start on port 3000 by default.

### Using the Stdio Transport

Run the stdio-based server:

```bash
ts-node stdio-index.ts
```

## Project Structure

- `index.ts` - Main HTTP server implementation
- `stdio-index.ts` - Stdio transport implementation
- `dist/` - Compiled JavaScript output
- `tsconfig.json` - TypeScript configuration

## Available Tools

1. **Addition Tool**
   - Adds two numbers
   - Parameters: `a` and `b` (numbers)

2. **BMI Calculator**
   - Calculates Body Mass Index
   - Parameters: `weightKg` and `heightM`

3. **Dynamic Greeting**
   - Generates personalized greetings
   - Resource template: `greeting://{name}`

4. **Weather Fetcher**
   - Fetches weather data for a given city
   - Parameter: `city` (string)

## Development

### Building

```bash
pnpm run build
```

### Running Tests

```bash
# Add test commands here once implemented
```

## License

ISC