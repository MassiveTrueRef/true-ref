#!/bin/bash

echo "Branch: $CF_PAGES_BRANCH"

if [[ "$CF_PAGES_BRANCH" == "main" || "$CF_PAGES_BRANCH" == "qa" ]]; then
  npm run build
else
  echo "Branch not allowed for build. Skipping."
fi