"""
Environment Configuration Loader & Validator

Provides fail-fast validation of required environment variables for the
multi-agent social media content creation system.
"""

import os
import sys
from dotenv import load_dotenv


def validate_environment() -> bool:
    """
    Fail-fast validation of required environment variables.
    
    Returns:
        bool: True if all required variables are present
        
    Exits:
        sys.exit(1) if any required variables are missing
    """
    load_dotenv()  # Load .env file
    
    required_vars = [
        "AZURE_AI_FOUNDRY_PROJECT_ENDPOINT",
        "AZURE_OPENAI_ENDPOINT",
        "AZURE_OPENAI_CHAT_DEPLOYMENT_NAME",
    ]
    
    missing = [var for var in required_vars if not os.getenv(var)]
    
    if missing:
        print("❌ Missing required environment variables:")
        for var in missing:
            print(f"   - {var}")
        print("\nPlease configure these in your .env file.")
        print("See .env.sample for template.")
        sys.exit(1)
    
    print("✅ Environment configuration validated\n")
    return True


def get_optional_vars() -> dict:
    """
    Get optional environment variables for bonus features.
    
    Returns:
        dict: Dictionary of optional configuration values
    """
    return {
        "copilot_cli_path": os.getenv("COPILOT_CLI_PATH"),
        "app_insights_connection": os.getenv("APPLICATIONINSIGHTS_CONNECTION_STRING"),
        "content_safety_endpoint": os.getenv("CONTENT_SAFETY_ENDPOINT"),
        "content_safety_key": os.getenv("CONTENT_SAFETY_KEY"),
    }


if __name__ == "__main__":
    validate_environment()
    print("All required environment variables are configured.")
    
    optional = get_optional_vars()
    if any(optional.values()):
        print("\n📋 Optional features configured:")
        if optional["copilot_cli_path"]:
            print(f"   ✓ Custom Copilot CLI path: {optional['copilot_cli_path']}")
        if optional["app_insights_connection"]:
            print("   ✓ Observability: Application Insights tracing enabled")
        if optional["content_safety_endpoint"]:
            print("   ✓ Content Safety: Azure AI Content Safety enabled")
