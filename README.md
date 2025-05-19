# MCP (Model Context Protocol) Server

A TypeScript-based MCP server implementation that provides various tools and resources through a RESTful API interface. This server supports both HTTP and stdio transport layers for flexible integration options.

## Features

- **Session Management**: Secure session-based communication
- **Multiple Transport Layers**:
  - HTTP Server (Express-based)
  - stdio Transport for CLI applications
- **Built-in Tools**:
  - Mathematical Operations
    - Addition Tool
    - BMI Calculator
  - Weather Information Fetching
- **Dynamic Resources**:
  - Customizable Greeting Resource

## Project Structure

```
mcp/
├── src/
│   ├── config/         # Server configuration
│   ├── resources/      # Resource definitions
│   ├── tools/          # Tool implementations
│   ├── transport/      # Transport layer handlers
│   └── server.ts       # Main server implementation
├── index.ts           # HTTP server entry point
└── stdio-index.ts     # stdio server entry point
```

## Prerequisites

- Node.js (v14 or higher)
- pnpm (Package Manager)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

## Available Scripts

```json
{
  "dev": "nodemon --exec ts-node index.ts",
  "start": "tsc && node dist/index.js",
  "build": "tsc"
}
```

## Usage

### HTTP Server

Start the HTTP server:

```bash
pnpm dev
```

The server will start on port 3000 by default.

### stdio Server

Run the stdio server:

```bash
ts-node stdio-index.ts
```

## API Endpoints

### POST /mcp
- Main endpoint for client-to-server communication
- Requires `mcp-session-id` header for existing sessions
- Handles initialization requests for new sessions

### GET /mcp
- Handles server-to-client notifications via SSE
- Requires valid `mcp-session-id` header

### DELETE /mcp
- Handles session termination
- Requires valid `mcp-session-id` header

## Available Tools

### 1. Addition Tool
```typescript
server.tool("add", { 
  a: z.number(), 
  b: z.number() 
})
```

### 2. BMI Calculator
```typescript
server.tool("calculate-bmi", {
  weightKg: z.number(),
  heightM: z.number()
})
```

### 3. Weather Information
```typescript
server.tool("fetch-weather", {
  city: z.string()
})
```

## Resources

### Greeting Resource
```typescript
server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined })
)
```

## Configuration

Server configuration can be modified in `src/config/server.config.ts`:

```typescript
{
  name: "example-server",
  version: "1.0.0",
  port: 3000
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC

## Dependencies

- @modelcontextprotocol/sdk
- express
- zod
- typescript
- and more (see package.json)