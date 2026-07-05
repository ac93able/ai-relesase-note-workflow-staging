#!/bin/bash

# Script to populate empty commits with dummy files
# This script will be used with git rebase --exec

set -e

# Mapping of commit hashes to files and messages
declare -A FILE_MAP
FILE_MAP["4dbd1df"]="src/auth/oauth2-provider.js"
FILE_MAP["fa1e8d0"]="src/auth/oauth2-discovery.js"
FILE_MAP["5458d67"]="src/api/rate-limiter.js"
FILE_MAP["1e983e2"]="src/ui/dashboard-renderer.js"
FILE_MAP["3197f72"]="src/auth/session-validation.js"
FILE_MAP["514a7ae"]="src/api/credential-validator.js"

# Get current commit hash
CURRENT_COMMIT=$(git rev-parse --short HEAD)

# Check if this commit is one of our empty commits
if [[ ${FILE_MAP[$CURRENT_COMMIT]+_} ]]; then
    COMMIT_FILE="${FILE_MAP[$CURRENT_COMMIT]}"

    echo "Populating commit $CURRENT_COMMIT with file: $COMMIT_FILE"

    # Check if file exists
    if [ -f "$COMMIT_FILE" ]; then
        git add "$COMMIT_FILE"
        git commit --amend --no-edit
        echo "✓ Successfully amended commit $CURRENT_COMMIT"
    else
        echo "✗ File not found: $COMMIT_FILE"
        exit 1
    fi
fi
