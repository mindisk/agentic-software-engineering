#!/usr/bin/env bash
# =============================================================================
# Agentic Software Engineering — Bootstrap
#
# Sets up a product repo to use the agentic pipeline.
# Run once per product repo; re-run to update agent copies (config.yaml is kept).
#
# Usage:
#   ./bootstrap.sh <product-repo-path> "<project-name>" [artifacts-option]
#
# artifacts-option (optional, skips the interactive prompt):
#   1            → inside the product repo (.agentic/features/)
#   2            → outside the repo (~/agentic-artifacts/<project>/)  [default]
#   /some/path   → custom absolute path
#
# Examples:
#   ./bootstrap.sh ~/projects/my-app "My Application" 2
#   ./bootstrap.sh ~/projects/my-app "My Application" 1
#   ./bootstrap.sh ~/projects/my-app "My Application" /data/artifacts
# =============================================================================

set -euo pipefail

ENGINE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ $# -lt 2 ]; then
  echo ""
  echo "Usage: ./bootstrap.sh <product-repo-path> \"<project-name>\" [artifacts-option]"
  echo ""
  echo "  artifacts-option:  1 = inside repo  |  2 = outside repo (default)  |  /abs/path = custom"
  echo ""
  echo "Example:"
  echo "  ./bootstrap.sh ~/projects/my-app \"My Application\" 2"
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

CONFIG="$PRODUCT_REPO/.agentic/config.yaml"

if [ -f "$CONFIG" ]; then
ARTIFACTS_CHOICE="kept"
echo "Kept existing: .agentic/config.yaml"
else

# ------------------------------------------------------------------
# Determine where artifacts (work documents) will be stored.
# They do not need to live inside the product repo.
# ------------------------------------------------------------------

if [ $# -ge 3 ]; then
  ARG3="$3"
  case "$ARG3" in
    1) ARTIFACTS_CHOICE="1" ;;
    2) ARTIFACTS_CHOICE="2" ;;
    /*) ARTIFACTS_CHOICE="3"; ARTIFACTS_PATH_CUSTOM="$ARG3" ;;
    *)
      echo "Error: artifacts-option must be 1, 2, or an absolute path starting with /"
      exit 1
      ;;
  esac
else
  echo "Where should pipeline artifacts (specs, designs, plans) be stored?"
  echo ""
  echo "  1) Inside the product repo  → .agentic/features/  (committed with code)"
  echo "  2) Outside the product repo → ~/agentic-artifacts/$PROJECT_NAME/  (local only)"
  echo "  3) Custom path              → enter your own absolute path"
  echo ""
  read -rp "Choice [1/2/3, default=2]: " ARTIFACTS_CHOICE
  ARTIFACTS_CHOICE="${ARTIFACTS_CHOICE:-2}"
  if [ "$ARTIFACTS_CHOICE" = "3" ]; then
    read -rp "Artifacts path (absolute): " ARTIFACTS_PATH_CUSTOM
  fi
fi

case "$ARTIFACTS_CHOICE" in
  1)
    ARTIFACTS_PATH=".agentic/features"
    ;;
  3)
    ARTIFACTS_PATH="$ARTIFACTS_PATH_CUSTOM"
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

fi

# ------------------------------------------------------------------
# 2. Install coordinator + specialist agents (re-run to update)
# ------------------------------------------------------------------

mkdir -p "$PRODUCT_REPO/.claude/agents"
for AGENT in "$ENGINE_DIR"/agents/*.md; do
  cp "$AGENT" "$PRODUCT_REPO/.claude/agents/"
  echo "Installed: .claude/agents/$(basename "$AGENT")"
done

if [ -d "$PRODUCT_REPO/.github/agents" ]; then
  echo "Warning: legacy Copilot agents found (no longer supported) — remove: rm -r \"$PRODUCT_REPO/.github/agents\""
fi

# ------------------------------------------------------------------
# Done
# ------------------------------------------------------------------

echo ""
echo "Bootstrap complete. Next steps:"
echo ""
echo "  1. Commit the pipeline config to your product repo:"
if [ "$ARTIFACTS_CHOICE" = "1" ]; then
echo "       git add .agentic/ .claude/agents/"
elif [ "$ARTIFACTS_CHOICE" = "kept" ]; then
echo "       git add .agentic/config.yaml .claude/agents/"
else
echo "       git add .agentic/config.yaml .claude/agents/"
echo "       # Artifacts are stored outside the repo at: $ARTIFACTS_PATH"
fi
echo "       git commit -m 'chore: add agentic pipeline'"
echo ""
echo "  2. Start the coordinator as the session agent from the product repo:"
echo "       cd \"$PRODUCT_REPO\" && claude --agent agentic-software-engineer"
echo ""
echo "  3. Tell the agent what you want to build."
echo ""
