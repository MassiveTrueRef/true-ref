#!/bin/bash

echo "Branch: $WORKERS_CI_BRANCH"

if [[ "$WORKERS_CI_BRANCH" == "main" || "$WORKERS_CI_BRANCH" == "staging" ]]; then
  CLOUDFLARE_ENV=$WORKERS_CI_BRANCH npm run deploy
else
  echo "Branch not allowed for deploy. Skipping."
fi