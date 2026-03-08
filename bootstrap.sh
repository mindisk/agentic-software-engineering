#!/usr/bin/env bash
# =============================================================================
# Agentic Software Engineering — Bootstrap
#
# Sets up a product repo to use the agentic pipeline.
# Run this once per product repo.
#
# Usage:
#   ./bootstrap.sh <product-repo-path> "<project-name>"
#
# Example:
#   ./bootstrap.sh ~/projects/my-app "My Application"
# =============================================================================

set -euo pipefail

ENGINE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ $# -lt 2 ]; then
  echo ""
  echo "Usage: ./bootstrap.sh <product-repo-path> \"<project-name>\""
  echo ""
  echo "Example:"
  echo "  ./bootstrap.sh ~/projects/my-app \"My Application\""
  echo ""
  exit 1
fi

PRODUCT_REPO="$(cd "$1" && pwd)"
PROJECT_NAME="$2"

if [ ! -d "$PRODUCT_REPO" ]; then
  echo "Error: $PRODUCT_REPO does not exist."
  exit 1
fi

echo ""
echo "=== Agentic Software Engineering Bootstrap ==="
echo "Product repo : $PRODUCT_REPO"
echo "Project name : $PROJECT_NAME"
echo "Engine       : $ENGINE_DIR"
echo ""

# ------------------------------------------------------------------
# 1. Create .agentic/ structure
# ------------------------------------------------------------------

mkdir -p "$PRODUCT_REPO/.agentic/features"

cat > "$PRODUCT_REPO/.agentic/config.yaml" <<EOF
project:
  name: "$PROJECT_NAME"

engine:
  path: "$ENGINE_DIR"
EOF

echo "Created: .agentic/config.yaml"

# ------------------------------------------------------------------
# 2. Place agent file in both supported locations
# ------------------------------------------------------------------

AGENT_SRC="$ENGINE_DIR/agents/agentic-software-engineer.md"

# Claude Code
mkdir -p "$PRODUCT_REPO/.claude/agents"
cp "$AGENT_SRC" "$PRODUCT_REPO/.claude/agents/agentic-software-engineer.md"
echo "Created: .claude/agents/agentic-software-engineer.md"

# GitHub Copilot (.agent.md extension required)
mkdir -p "$PRODUCT_REPO/.github/agents"
cp "$AGENT_SRC" "$PRODUCT_REPO/.github/agents/agentic-software-engineer.agent.md"
echo "Created: .github/agents/agentic-software-engineer.agent.md"

# ------------------------------------------------------------------
# Done
# ------------------------------------------------------------------

echo ""
echo "Bootstrap complete. Next steps:"
echo ""
echo "  1. Commit the pipeline config to your product repo:"
echo "       git add .agentic/ .claude/ .github/"
echo "       git commit -m 'chore: add agentic pipeline'"
echo ""
echo "  2. Open the product repo in Claude Code or VSCode Copilot."
echo ""
echo "  3. Activate the agent:"
echo "       Claude Code  → the agent is available automatically"
echo "       VSCode Copilot → type @agentic-software-engineer in chat"
echo ""
echo "  4. Tell the agent what you want to build."
echo ""
