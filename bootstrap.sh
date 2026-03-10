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

# ------------------------------------------------------------------
# Determine where artifacts (work documents) will be stored.
# They do not need to live inside the product repo.
# ------------------------------------------------------------------

echo "Where should pipeline artifacts (specs, designs, plans) be stored?"
echo ""
echo "  1) Inside the product repo  → .agentic/features/  (committed with code)"
echo "  2) Outside the product repo → ~/agentic-artifacts/$PROJECT_NAME/  (local only)"
echo "  3) Custom path              → enter your own absolute path"
echo ""
read -rp "Choice [1/2/3, default=2]: " ARTIFACTS_CHOICE
ARTIFACTS_CHOICE="${ARTIFACTS_CHOICE:-2}"

case "$ARTIFACTS_CHOICE" in
  1)
    ARTIFACTS_PATH=".agentic/features"
    ;;
  3)
    read -rp "Artifacts path (absolute): " ARTIFACTS_PATH
    ;;
  *)
    ARTIFACTS_PATH="$HOME/agentic-artifacts/$(echo "$PROJECT_NAME" | tr '[:upper:] ' '[:lower:]-')"
    ;;
esac

# Resolve relative path to absolute if choice was 1
if [ "$ARTIFACTS_CHOICE" = "1" ]; then
  ARTIFACTS_PATH_DISPLAY=".agentic/features  (inside product repo)"
else
  ARTIFACTS_PATH_DISPLAY="$ARTIFACTS_PATH"
  mkdir -p "$ARTIFACTS_PATH"
fi

echo "Artifacts path: $ARTIFACTS_PATH_DISPLAY"

cat > "$PRODUCT_REPO/.agentic/config.yaml" <<EOF
project:
  name: "$PROJECT_NAME"

engine:
  path: "$ENGINE_DIR"

artifacts:
  # Where pipeline work documents (specs, designs, plans) are stored.
  # Can be inside the product repo (.agentic/features) or any absolute path
  # outside the repo. Defaults to an external directory so work documents
  # are not automatically committed with product code.
  path: "$ARTIFACTS_PATH"

pipeline:
  # Stage 05 implementation: report to engineer after every N tasks completed.
  # The agent presents a checkpoint summary and waits for acknowledgement before continuing.
  # Set to 0 to disable checkpoints (agent reports only at full stage end).
  checkpoint_interval_tasks: 3
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
if [ "$ARTIFACTS_CHOICE" = "1" ]; then
echo "       git add .agentic/ .claude/ .github/"
else
echo "       git add .agentic/config.yaml .claude/ .github/"
echo "       # Artifacts are stored outside the repo at: $ARTIFACTS_PATH"
echo "       # Add that path to .gitignore if needed, or leave it local-only."
fi
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
