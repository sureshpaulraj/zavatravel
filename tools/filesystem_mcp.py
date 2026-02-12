"""
MCP Filesystem Server Integration

Provides tools for saving generated content to local filesystem
using Model Context Protocol (MCP) filesystem server.
"""

from typing import List


def get_filesystem_tools():
    """
    Initialize MCP filesystem client for draft saving.
    
    Returns:
        List of MCP tools for filesystem operations
        
    Note:
        Requires npm package: @modelcontextprotocol/server-filesystem
        Install with: npm install -g @modelcontextprotocol/server-filesystem
    """
    try:
        from agent_framework.mcp import MCPClient
        
        print("🔧 Initializing MCP filesystem server...")
        
        mcp_client = MCPClient(
            command=["npx", "@modelcontextprotocol/server-filesystem", "./output"],
            transport="stdio"
        )
        
        tools = mcp_client.get_tools()
        print(f"✅ MCP filesystem server connected ({len(tools)} tools available)")
        
        return tools
    
    except ImportError:
        print("⚠️ MCP not available in agent-framework")
        print("   Continuing without filesystem tool integration...")
        return []
    
    except Exception as e:
        print(f"⚠️ MCP filesystem server connection failed: {e}")
        print("   Continuing without filesystem tool integration...")
        print("   Posts will be displayed in console only.")
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
