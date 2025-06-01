import express from 'express';
import cors from 'cors';
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { WhitepaperContent } from "./data/whitepaper.js";
import { KeyConcepts } from "./data/keyConcepts.js";
import { calculateRelevance } from "./utils/search.js";

// Keep all your existing interfaces
interface Section {
  heading: string;
  content: string;
  subsections?: Subsection[];
}

interface Subsection {
  heading: string;
  content: string;
}

interface SearchResult {
  heading: string;
  content: string;
  relevance: number;
}

// Keep your existing searchWhitepaper function
function searchWhitepaper(query: string): SearchResult[] {
  query = query.toLowerCase();
  const results: SearchResult[] = [];

  WhitepaperContent.sections.forEach((section: Section) => {
    const sectionText = `${section.heading} ${section.content}`.toLowerCase();
    const relevance = calculateRelevance(sectionText, query);

    if (relevance > 0) {
      results.push({
        heading: section.heading,
        content: section.content,
        relevance: relevance,
      });
    }

    if (section.subsections) {
      section.subsections.forEach((subsection: Subsection) => {
        const subsectionText = `${subsection.heading} ${subsection.content}`.toLowerCase();
        const subRelevance = calculateRelevance(subsectionText, query);

        if (subRelevance > 0) {
          results.push({
            heading: `${section.heading} > ${subsection.heading}`,
            content: subsection.content,
            relevance: subRelevance,
          });
        }
      });
    }
  });

  results.sort((a, b) => b.relevance - a.relevance);
  return results;
}

// Your existing tool handling functions
async function handleToolCall(params: any) {
  const { name, arguments: args } = params;
  
  try {
    switch (name) {
      case "search_whitepaper": {
        const query = args.query;
        if (!query) {
          throw new McpError(ErrorCode.InvalidParams, "Missing query parameter");
        }
        const results = searchWhitepaper(query);

        return {
          content: [
            {
              type: "text",
              text: results.length > 0
                ? `Found ${results.length} result(s) for "${query}":\n\n${results
                    .slice(0, 5)
                    .map(
                      (r: SearchResult) =>
                        `**${r.heading}**\n${r.content.substring(
                          0,
                          Math.min(1000, r.content.length)
                        )}${r.content.length > 1000 ? "..." : ""}`
                    )
                    .join("\n\n")}`
                : `No results found for "${query}". Try a different search term or browse the sections.`,
            },
          ],
        };
      }

      case "get_section": {
        const sectionName = args.section?.toLowerCase();
        if (!sectionName) {
          throw new McpError(ErrorCode.InvalidParams, "Missing section parameter");
        }
        const section = WhitepaperContent.sections.find(
          (s: Section) => s.heading.toLowerCase() === sectionName
        );

        if (!section) {
          for (const mainSection of WhitepaperContent.sections) {
            if (mainSection.subsections) {
              const subsection = mainSection.subsections.find(
                (sub: Subsection) => sub.heading.toLowerCase() === sectionName
              );

              if (subsection) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `**${mainSection.heading} > ${subsection.heading}**\n\n${subsection.content}`,
                    },
                  ],
                };
              }
            }
          }

          throw new McpError(ErrorCode.InvalidParams, `Section "${args.section}" not found`);
        }

        let content = `**${section.heading}**\n\n${section.content}`;

        if (section.subsections) {
          content +=
            "\n\n" +
            section.subsections
              .map((sub: Subsection) => `### ${sub.heading}\n\n${sub.content}`)
              .join("\n\n");
        }

        return {
          content: [
            {
              type: "text",
              text: content,
            },
          ],
        };
      }

      case "list_sections": {
        const sections = WhitepaperContent.sections
          .map((section: Section) => {
            let text = `- **${section.heading}**`;
            if (section.subsections) {
              section.subsections.forEach((sub: Subsection) => {
                text += `\n  - ${sub.heading}`;
              });
            }
            return text;
          })
          .join("\n");

        return {
          content: [
            {
              type: "text",
              text: `# Succinct Network Whitepaper Sections\n\n${sections}`,
            },
          ],
        };
      }

      case "get_key_concepts": {
        if (!args.concept) {
          throw new McpError(ErrorCode.InvalidParams, "Concept parameter is required");
        }
        const conceptQuery = args.concept.toLowerCase();
        
        const conceptKeys = Object.keys(KeyConcepts) as Array<keyof typeof KeyConcepts>;
        const matchingKey = conceptKeys.find(key => 
            String(key).toLowerCase() === conceptQuery
        );
        
        if (matchingKey) {
            return {
            content: [
                {
                type: "text",
                text: `**${String(matchingKey)}**\n\n${KeyConcepts[matchingKey]}`
                }
            ]
            };
        } else {
            const similarKeys = conceptKeys.filter(key => 
            String(key).toLowerCase().includes(conceptQuery) || 
            conceptQuery?.includes(String(key).toLowerCase())
            );
            
            if (similarKeys.length > 0) {
            return {
                content: [
                {
                    type: "text",
                    text: `Concept "${args.concept}" not found exactly. Did you mean one of these?\n\n${
                    similarKeys.map(c => `- ${String(c)}`).join('\n')
                    }\n\nUse the get_key_concepts tool with one of these exact terms.`
                }
                ]
            };
            } else {
            throw new McpError(ErrorCode.InvalidParams, `Concept "${args.concept}" not found. Try searching the whitepaper instead.`);
            }
        }
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof McpError) throw error;
    throw new McpError(ErrorCode.InternalError, String(error));
  }
}

async function handlePromptGet(params: any) {
  const name = params.name;
  
  switch (name) {
    case "whitepaper_summary":
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: "Provide a concise summary of the Succinct Network whitepaper, highlighting its key innovations and main components.",
            },
          },
        ],
      };

    case "proof_contests_explained":
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: "Explain in detail how proof contests work in the Succinct Network, including the mechanism design, incentives, and how they balance cost-effectiveness with decentralization.",
            },
          },
        ],
      };

    case "network_architecture":
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: "Describe the architecture of the Succinct Network, including how users and provers interact with the system, and how the application-specific blockchain is designed.",
            },
          },
        ],
      };

    case "applications":
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: "What are the potential applications of the Succinct Network? How can it be used to enhance existing systems or enable new use cases?",
            },
          },
        ],
      };

    default:
      throw new McpError(ErrorCode.InvalidParams, `Unknown prompt: ${name}`);
  }
}

// Express.js setup for Render deployment
const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://succinct-whitepaper-chat.vercel.app',
      ]
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Succinct Network MCP Server'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Succinct Network MCP Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      tools_list: '/tools/list',
      tools_call: '/tools/call',
      prompts_list: '/prompts/list',
      prompts_get: '/prompts/get'
    }
  });
});

// MCP Protocol endpoints
app.get('/tools/list', async (req, res) => {
  try {
    const response = {
      tools: [
        {
          name: "search_whitepaper",
          description: "Search for information in the Succinct Network whitepaper",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query to find relevant information in the whitepaper",
              },
            },
            required: ["query"],
          },
        },
        {
          name: "get_section",
          description: "Get a specific section of the whitepaper",
          inputSchema: {
            type: "object",
            properties: {
              section: {
                type: "string",
                description: "Name of the section to retrieve",
              },
            },
            required: ["section"],
          },
        },
        {
          name: "list_sections",
          description: "List all sections and subsections in the whitepaper",
          inputSchema: {
            type: "object",
            properties: {},
            required: [],
          },
        },
        {
          name: "get_key_concepts",
          description: "Get an explanation of key concepts in the Succinct Network",
          inputSchema: {
            type: "object",
            properties: {
              concept: {
                type: "string",
                description: "Name of the concept to explain",
              },
            },
            required: ["concept"],
          },
        },
      ],
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
});

app.post('/tools/call', async (req, res) => {
  try {
    const { name, arguments: args } = req.body;
    const result = await handleToolCall({ name, arguments: args });
    res.json(result);
  } catch (error) {
    if (error instanceof McpError) {
      res.status(400).json({ 
        error: error.message, 
        code: error.code 
      });
    } else {
      res.status(500).json({ 
        error: 'Internal server error', 
        details: String(error) 
      });
    }
  }
});

app.get('/prompts/list', async (req, res) => {
  try {
    const response = {
      prompts: [
        {
          name: "whitepaper_summary",
          description: "Get a summary of the entire Succinct Network whitepaper",
        },
        {
          name: "proof_contests_explained",
          description: "Get a detailed explanation of how proof contests work",
        },
        {
          name: "network_architecture",
          description: "Get an overview of the Succinct Network architecture",
        },
        {
          name: "applications",
          description: "Learn about potential applications of the Succinct Network",
        },
      ],
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
});

app.post('/prompts/get', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await handlePromptGet({ name });
    res.json(result);
  } catch (error) {
    if (error instanceof McpError) {
      res.status(400).json({ 
        error: error.message, 
        code: error.code 
      });
    } else {
      res.status(500).json({ 
        error: 'Internal server error', 
        details: String(error) 
      });
    }
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    available_endpoints: ['/health', '/tools/list', '/tools/call', '/prompts/list', '/prompts/get']
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Succinct Network MCP Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;