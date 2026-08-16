# xeenox-ai-digital-marketings

## Hostinger MCP server

This repo ships a project-scoped MCP config (`.mcp.json`) for Hostinger's hosted
server at `https://mcp.hostinger.com` (streamable HTTP transport).

The server is OAuth-protected — it advertises
`authorization_servers: ["https://auth.hostinger.com"]` and the `mcp:use` scope — so
each person has to authorize it once from their own machine:

```bash
# from the repo root, so the project-scoped .mcp.json is picked up
claude
# approve the project MCP server when prompted, then:
/mcp        # select "hostinger" -> Authenticate, finish the login in the browser
```

To register it outside this repo instead (user scope, available everywhere):

```bash
claude mcp add --transport http --scope user hostinger https://mcp.hostinger.com
```

Verify with `claude mcp list` — `hostinger` should report as connected once the
browser login completes. Tokens are stored by Claude Code locally and are not
part of this repo.

On claude.ai, add the same URL under Settings → Connectors → Add custom connector;
Hostinger is not in the built-in connector directory.
