#!/bin/bash

echo "Branch: $GITHUB_REF_NAME"
env | sort

if [[ "$GITHUB_REF_NAME" == "main" || "$GITHUB_REF_NAME" == "qa" ]]; then
  npm run build
else
  echo "Branch not allowed for build. Skipping."
fi