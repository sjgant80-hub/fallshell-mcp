#!/usr/bin/env node
// fallshell-mcp · MCP stdio server wrapping fallshell-sdk · MIT · AI-Native Solutions
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({ name: 'fallshell-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'fallshell_render_tools',
    description: 'renderTools · from fallshell-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { renderTools } = await import('@ai-native-solutions/fallshell-sdk');
      return typeof renderTools === 'function' ? await renderTools(args) : { error: 'renderTools not callable' };
    }
  },
  {
    name: 'fallshell_render_welcome',
    description: 'renderWelcome · from fallshell-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { renderWelcome } = await import('@ai-native-solutions/fallshell-sdk');
      return typeof renderWelcome === 'function' ? await renderWelcome(args) : { error: 'renderWelcome not callable' };
    }
  },
  {
    name: 'fallshell_open_tool',
    description: 'openTool · from fallshell-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { openTool } = await import('@ai-native-solutions/fallshell-sdk');
      return typeof openTool === 'function' ? await openTool(args) : { error: 'openTool not callable' };
    }
  },
  {
    name: 'fallshell_update_foldkit',
    description: 'updateFoldkit · from fallshell-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { updateFoldkit } = await import('@ai-native-solutions/fallshell-sdk');
      return typeof updateFoldkit === 'function' ? await updateFoldkit(args) : { error: 'updateFoldkit not callable' };
    }
  },
  {
    name: 'fallshell_render_fingerprint',
    description: 'renderFingerprint · from fallshell-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { renderFingerprint } = await import('@ai-native-solutions/fallshell-sdk');
      return typeof renderFingerprint === 'function' ? await renderFingerprint(args) : { error: 'renderFingerprint not callable' };
    }
  },
  {
    name: 'fallshell_render_history',
    description: 'renderHistory · from fallshell-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { renderHistory } = await import('@ai-native-solutions/fallshell-sdk');
      return typeof renderHistory === 'function' ? await renderHistory(args) : { error: 'renderHistory not callable' };
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ handler, ...rest }) => rest)
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const t = TOOLS.find(x => x.name === req.params.name);
  if (!t) throw new Error('unknown tool: ' + req.params.name);
  const result = await t.handler(req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
console.error('fallshell-mcp v1.0.0 · stdio ready');
