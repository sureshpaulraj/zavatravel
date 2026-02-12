"""
File Search Integration for Brand Guidelines

Handles uploading and attaching brand guidelines documents to agents
using Azure AI Foundry File Search tool.
"""

import os
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import FileSearchTool
from azure.identity import DefaultAzureCredential


def upload_brand_guidelines(project_client: AIProjectClient, file_path: str) -> str:
    """
    Upload brand guidelines document to Azure AI Foundry.
    
    Args:
        project_client: AIProjectClient instance
        file_path: Path to brand guidelines document (.docx or .md)
        
    Returns:
        str: File ID for use with FileSearchTool
        
    Raises:
        FileNotFoundError: If file_path doesn't exist
        Exception: If upload fails
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Brand guidelines not found: {file_path}")
    
    try:
        print(f"📄 Uploading brand guidelines: {file_path}")
        file = project_client.files.upload(
            file_path=file_path,
            purpose="assistants"
        )
        print(f"✅ Brand guidelines uploaded successfully (ID: {file.id})")
        return file.id
    except Exception as e:
        print(f"❌ Failed to upload brand guidelines: {e}")
        raise


def attach_file_search_tool(agent, file_id: str) -> None:
    """
    Attach File Search tool to an agent with uploaded document.
    
    Args:
        agent: Agent instance to attach tool to
        file_id: File ID from upload_brand_guidelines()
    """
    try:
        file_search_tool = FileSearchTool(file_ids=[file_id])
        agent.tools.append(file_search_tool)
        print(f"✅ File Search tool attached to {getattr(agent, 'name', 'agent')}")
    except Exception as e:
        print(f"⚠️ Failed to attach File Search tool: {e}")
        print("   Continuing without grounding...")


def create_grounded_agent(
    client,
    name: str,
    instructions: str,
    project_client: AIProjectClient,
    brand_guidelines_path: str
):
    """
    Create an agent with File Search grounding.
    
    Args:
        client: Azure OpenAI client
        name: Agent name
        instructions: Agent system instructions
        project_client: AIProjectClient for file upload
        brand_guidelines_path: Path to brand guidelines document
        
    Returns:
        Agent instance with File Search tool attached
    """
    # Create base agent
    agent = client.create_agent(
        name=name,
        instructions=instructions + "\n\nUse File Search to reference brand guidelines when generating content. Cite specific elements in your reasoning."
    )
    
    # Upload and attach brand guidelines if file exists
    if os.path.exists(brand_guidelines_path):
        try:
            file_id = upload_brand_guidelines(project_client, brand_guidelines_path)
            attach_file_search_tool(agent, file_id)
        except Exception as e:
            print(f"⚠️ Grounding setup failed: {e}")
            print("   Agent will continue without File Search...")
    else:
        print(f"⚠️ Brand guidelines not found: {brand_guidelines_path}")
        print("   Agent will continue without grounding...")
    
    return agent
