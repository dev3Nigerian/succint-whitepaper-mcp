# Succinct Network MCP Server

A Model Context Protocol (MCP) server that provides an AI agent interface for querying and interacting with the Succinct Network whitepaper. This server allows users to search through the whitepaper content, retrieve specific sections, and get explanations of key concepts through HTTP API endpoints.

## 🚀 Features

- **Search Functionality**: Search for specific terms or concepts within the whitepaper
- **Section Navigation**: Retrieve complete sections or subsections by name
- **Key Concept Explanations**: Get detailed explanations of important Succinct Network concepts
- **Pre-defined Prompts**: Access common queries about the whitepaper
- **HTTP API**: RESTful endpoints for easy integration with any HTTP client
- **TypeScript**: Full TypeScript support with proper type definitions

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Usage Examples](#usage-examples)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)

## 🛠 Installation

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- TypeScript (installed globally or as dev dependency)

### Step 1: Clone the Repository

```bash
git clone https://github.com/dev3Nigerian/succint-whitepaper-mcp.git
cd succinct-mcp-server
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build the Project

```bash
npm run build
```

### Step 4: Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## 🚀 Quick Start

1. **Install and start the server** (see Installation above)

2. **Test the health endpoint**:

   ```bash
   curl http://localhost:3000/health
   ```

3. **Search the whitepaper**:

   ```bash
   curl -X POST http://localhost:3000/tools/call \
     -H "Content-Type: application/json" \
     -d '{"name":"search_whitepaper","arguments":{"query":"proof contests"}}'
   ```

4. **List all available sections**:
   ```bash
   curl -X POST http://localhost:3000/tools/call \
     -H "Content-Type: application/json" \
     -d '{"name":"list_sections","arguments":{}}'
   ```

## 📚 API Documentation

**POSTMAN🚀:** https://www.postman.com/lunar-rocket-592846/succint-whitepaper-mcp/collection/fv9tqu7/succinct-network-mcp-server?action=share&creator=30802512&active-environment=30802512-c4779264-fd1a-4b00-9b9d-2273f0c4d607

### Base URL

```
http://localhost:3000
```

### Health Check

**GET** `/health`

Returns server status.

**Response:**

```json
{
  "status": "ok",
  "message": "Succinct Network MCP Server is running"
}
```

### List Available Tools

**POST** `/tools/list`

Returns all available tools for interacting with the whitepaper.

**Response:**

```json
{
  "tools": [
    {
      "name": "search_whitepaper",
      "description": "Search for information in the Succinct Network whitepaper",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "description": "Search query to find relevant information"
          }
        },
        "required": ["query"]
      }
    }
    // ... other tools
  ]
}
```

### Execute Tools

**POST** `/tools/call`

Execute a specific tool with provided arguments.

#### Search Whitepaper

**Request Body:**

```json
{
  "name": "search_whitepaper",
  "arguments": {
    "query": "proof contests"
  }
}
```

**Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Found 2 result(s) for \"proof contests\":\n\n**Proof Contests**\nProof contests are the core mechanism..."
    }
  ]
}
```

#### Get Section

**Request Body:**

```json
{
  "name": "get_section",
  "arguments": {
    "section": "Abstract"
  }
}
```

#### List Sections

**Request Body:**

```json
{
  "name": "list_sections",
  "arguments": {}
}
```

#### Get Key Concepts

**Request Body:**

```json
{
  "name": "get_key_concepts",
  "arguments": {
    "concept": "zkvm"
  }
}
```

### List Available Prompts

**POST** `/prompts/list`

Returns predefined prompts for common whitepaper queries.

### Get Prompt

**POST** `/prompts/get`

**Request Body:**

```json
{
  "name": "whitepaper_summary"
}
```

Available prompts:

- `whitepaper_summary`
- `proof_contests_explained`
- `network_architecture`
- `applications`

## 💡 Usage Examples

### Using cURL

1. **Search for "SP1":**

   ```bash
   curl -X POST http://localhost:3000/tools/call \
     -H "Content-Type: application/json" \
     -d '{"name":"search_whitepaper","arguments":{"query":"SP1"}}'
   ```

2. **Get the Introduction section:**

   ```bash
   curl -X POST http://localhost:3000/tools/call \
     -H "Content-Type: application/json" \
     -d '{"name":"get_section","arguments":{"section":"Introduction"}}'
   ```

3. **Explain proving pools:**
   ```bash
   curl -X POST http://localhost:3000/tools/call \
     -H "Content-Type: application/json" \
     -d '{"name":"get_key_concepts","arguments":{"concept":"proving pools"}}'
   ```

### Using Postman

1. **Import the Collection**: Create a new Postman collection with the base URL `http://localhost:3000`

2. **Set up requests**: Create POST requests for each endpoint with appropriate JSON bodies

3. **Test**: Use the examples above as request bodies

### Using JavaScript/Node.js

```javascript
const axios = require("axios");

async function searchWhitepaper(query) {
  try {
    const response = await axios.post("http://localhost:3000/tools/call", {
      name: "search_whitepaper",
      arguments: { query },
    });

    console.log(response.data.content[0].text);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

// Usage
searchWhitepaper("zero-knowledge proofs");
```

### Using Python

```python
import requests
import json

def search_whitepaper(query):
    url = "http://localhost:3000/tools/call"
    payload = {
        "name": "search_whitepaper",
        "arguments": {"query": query}
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        result = response.json()
        print(result['content'][0]['text'])
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

# Usage
search_whitepaper("proof contests")
```

## 📁 Project Structure

```
succinct-mcp-server/
├── src/
│   ├── data/
│   │   ├── whitepaper.ts      # Whitepaper content structure
│   │   └── keyConcepts.ts     # Key concept definitions
│   ├── utils/
│   │   └── search.ts          # Search utility functions
│   ├── transport.ts           # HTTP transport layer
│   └── index.ts              # Main server implementation
├── dist/                     # Compiled JavaScript files
├── package.json
├── tsconfig.json
└── README.md
```

### Key Files

- **`src/index.ts`**: Main server setup with MCP handlers and tool implementations
- **`src/transport.ts`**: HTTP server using Express.js for handling REST API requests
- **`src/data/whitepaper.ts`**: Structured content from the Succinct Network whitepaper
- **`src/data/keyConcepts.ts`**: Definitions and explanations of key concepts
- **`src/utils/search.ts`**: Search algorithm and relevance scoring functions

## 🔧 Development

### Available Scripts

```bash
# Build the project
npm run build

# Start the server
npm start

# Development mode (build and run)
npm run dev

# Watch for changes (TypeScript compilation)
npm run watch
```

### Environment Configuration

You can customize the server port by modifying the `HttpTransport` constructor in `src/index.ts`:

```typescript
const transport = new HttpTransport(3000); // Change port here
```

### Adding New Content

To add new sections or update whitepaper content:

1. **Edit** `src/data/whitepaper.ts` to add new sections
2. **Update** `src/data/keyConcepts.ts` to add new concept explanations
3. **Rebuild** the project: `npm run build`
4. **Restart** the server: `npm start`

### Improving Search

The search functionality can be enhanced by modifying `src/utils/search.ts`:

- Adjust relevance scoring weights
- Add stemming or fuzzy matching
- Implement semantic search

## 🧪 Testing

### Manual Testing

Use the provided cURL examples or Postman to test all endpoints.

### Automated Testing

You can create a simple test script:

```javascript
// test/basic-test.js
const axios = require("axios");

async function runTests() {
  const baseUrl = "http://localhost:3000";

  try {
    // Test health endpoint
    const health = await axios.get(`${baseUrl}/health`);
    console.log("✅ Health check passed");

    // Test search
    const search = await axios.post(`${baseUrl}/tools/call`, {
      name: "search_whitepaper",
      arguments: { query: "SP1" },
    });
    console.log("✅ Search test passed");

    // Test section retrieval
    const section = await axios.post(`${baseUrl}/tools/call`, {
      name: "get_section",
      arguments: { section: "Abstract" },
    });
    console.log("✅ Section retrieval test passed");

    console.log("🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

runTests();
```

## 🚀 Deployment

### Local Deployment

The server runs locally on port 3000 by default. Ensure the port is available and not blocked by firewall.

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

Build and run:

```bash
docker build -t succinct-mcp-server .
docker run -p 3000:3000 succinct-mcp-server
```

### Cloud Deployment

This server can be deployed to:

- **Heroku**: Add a `Procfile` with `web: node dist/index.js`
- **Railway**: Connect your GitHub repository
- **DigitalOcean App Platform**: Use the Node.js buildpack
- **AWS/GCP/Azure**: Deploy as a container or serverless function

## 📖 About the Succinct Network

This MCP server provides easy access to information about the Succinct Network, a decentralized protocol for zero-knowledge proof generation. Key topics covered include:

- **Proof Contests**: Novel auction mechanism for prover coordination
- **SP1 zkVM**: Zero-knowledge virtual machine for RISC-V programs
- **Network Architecture**: Application-specific blockchain design
- **Market Structure**: Economic incentives and prover decentralization
- **Applications**: Use cases from rollups to privacy applications

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Contribution Guidelines

- Follow TypeScript best practices
- Add appropriate error handling
- Update documentation for new features
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you encounter any issues or have questions:

1. **Check** the [Issues](https://github.com/dev3Nigerian/succint-whitepaper-mcp.git) page
2. **Create** a new issue with detailed description
3. **Include** error messages and steps to reproduce

## 🔗 Related Links

- [Succinct Network Whitepaper](https://succinct.xyz)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [SP1 Documentation](https://docs.succinct.xyz/docs/getting-started/install)

---

**Built with ❤️ for the Succinct Network community**
