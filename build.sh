#!/bin/bash

echo "Branch: $WORKERS_CI_BRANCH"

if [[ "$WORKERS_CI_BRANCH" == "main" || "$WORKERS_CI_BRANCH" == "qa" ]]; then
  npm run build
else
  echo "Branch not allowed for build. Skipping."
fi