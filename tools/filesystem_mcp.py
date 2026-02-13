"""
MCP Filesystem Server Integration

Provides tools for saving generated content to local filesystem
using Model Context Protocol (MCP) filesystem server.

Transport modes (set via MCP_TRANSPORT env var):
  - stdio (default): Direct stdio communication with the MCP server.
    Simplest setup — no extra bridge process needed.
  - streamable-http: Uses supergateway to bridge the stdio-only
    @modelcontextprotocol/server-filesystem to HTTP Streamable transport.
    Supergateway runs as a managed subprocess on MCP_SERVER_PORT (default 8000).

Prerequisites:
  npm install -g @modelcontextprotocol/server-filesystem
  # Only for streamable-http transport:
  npm install -g supergateway
"""

from __future__ import annotations

import atexit
import os
import signal
import socket
import subprocess
import time
from typing import List, Optional

# Module-level handle so we can clean up the supergateway process on exit
_gateway_process: Optional[subprocess.Popen] = None


def _port_in_use(port: int) -> bool:
    """Check whether a TCP port is already listening."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(("127.0.0.1", port)) == 0


def _start_supergateway(port: int, output_dir: str) -> subprocess.Popen:
    """
    Launch supergateway as a subprocess that bridges the stdio MCP
    filesystem server to HTTP Streamable transport.
    """
    cmd = [
        "npx", "-y", "supergateway",
        "--stdio", f"npx -y @modelcontextprotocol/server-filesystem {output_dir}",
        "--port", str(port),
        "--outputTransport", "streamableHttp",
    ]
    proc = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        shell=True,  # Required on Windows where npx is a .cmd file
        creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
            if os.name == "nt" else 0,
    )
    # Wait for the port to become available (max ~10 s)
    for _ in range(20):
        if _port_in_use(port):
            return proc
        time.sleep(0.5)
    # If we get here the server may still be starting – return anyway
    return proc


def _cleanup_gateway():
    """Terminate the supergateway subprocess if it's still running."""
    global _gateway_process
    if _gateway_process and _gateway_process.poll() is None:
        try:
            if os.name == "nt":
                _gateway_process.send_signal(signal.CTRL_BREAK_EVENT)
            else:
                _gateway_process.terminate()
            _gateway_process.wait(timeout=5)
        except Exception:
            _gateway_process.kill()
        _gateway_process = None


def get_filesystem_tools(
    output_dir: str = "./output",
    port: int | None = None,
) -> List:
    """
    Initialize MCP filesystem tool for draft saving.

    Transport is chosen via the ``MCP_TRANSPORT`` env var:
      - ``stdio``  (default) — direct stdio, no bridge needed
      - ``streamable-http``  — uses supergateway as HTTP bridge

    Args:
        output_dir: Directory the MCP filesystem server can access.
        port: TCP port for supergateway (only used with streamable-http).
              Reads MCP_SERVER_PORT env var, defaults to 8000.

    Returns:
        List with a single MCP tool, or an empty list on failure.

    Prerequisites:
        npm install -g @modelcontextprotocol/server-filesystem
        # Only for streamable-http:
        npm install -g supergateway
    """
    global _gateway_process

    if port is None:
        port = int(os.getenv("MCP_SERVER_PORT", "8000"))

    transport = os.getenv("MCP_TRANSPORT", "stdio").lower().strip()

    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # ------------------------------------------------------------------
    # Stdio transport (default)
    # ------------------------------------------------------------------
    if transport == "stdio":
        try:
            from agent_framework import MCPStdioTool

            print("🔧 Initializing MCP filesystem server (stdio)...")

            mcp_tool = MCPStdioTool(
                name="filesystem",
                command="npx",
                args=["-y", "@modelcontextprotocol/server-filesystem", output_dir],
                load_prompts=False,
            )

            print("✅ MCP filesystem tool created (stdio)")
            return [mcp_tool]

        except ImportError:
            print("⚠️ MCPStdioTool not available in agent-framework")
            return []
        except Exception as e:
            print(f"⚠️ MCP stdio setup failed: {e}")
            return []

    # ------------------------------------------------------------------
    # HTTP Streamable transport (opt-in via MCP_TRANSPORT=streamable-http)
    # ------------------------------------------------------------------
    if transport == "streamable-http":
        try:
            from agent_framework import MCPStreamableHTTPTool

            print("🔧 Initializing MCP filesystem server (HTTP Streamable)...")

            # Start supergateway if nothing is already listening on the port
            if not _port_in_use(port):
                print(f"   Launching supergateway on port {port}...")
                _gateway_process = _start_supergateway(port, output_dir)
                atexit.register(_cleanup_gateway)

                if not _port_in_use(port):
                    raise RuntimeError(
                        f"supergateway did not start on port {port} in time"
                    )
                print(f"   ✅ supergateway listening on port {port}")
            else:
                print(f"   ℹ️ Port {port} already in use – reusing existing server")

            mcp_url = f"http://127.0.0.1:{port}/mcp"
            mcp_tool = MCPStreamableHTTPTool(
                name="filesystem",
                url=mcp_url,
                load_prompts=False,
            )
            print(f"✅ MCP filesystem tool created (HTTP Streamable → {mcp_url})")
            return [mcp_tool]

        except ImportError:
            print("⚠️ MCPStreamableHTTPTool not available in agent-framework")
            return []
        except Exception as e:
            print(f"⚠️ HTTP Streamable setup failed: {e}")
            return []

    print(f"⚠️ Unknown MCP_TRANSPORT={transport!r} — expected 'stdio' or 'streamable-http'")
    return []


def save_posts_manually(content: str, output_dir: str = "./output"):
    """
    Fallback method to save posts if MCP is unavailable.
    
    Args:
        content: Markdown content to save
        output_dir: Output directory path
    """
    import os
    from datetime import datetime
    
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate timestamped filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"social-posts-{timestamp}.md"
    filepath = os.path.join(output_dir, filename)
    
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Posts saved to: {filepath}")
        return filepath
    except Exception as e:
        print(f"❌ Failed to save posts: {e}")
        return None
