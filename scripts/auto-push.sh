#!/usr/bin/env bash
set -euo pipefail

repo_url="${1:-}"
commit_msg="${2:-chore: update}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not inside a git repository."
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  if [[ -z "$repo_url" ]]; then
    echo "Missing repo URL. Usage: ./scripts/auto-push.sh <repo-url> [commit-message]"
    exit 1
  fi
  git remote add origin "$repo_url"
fi

branch="$(git rev-parse --abbrev-ref HEAD)"

if ! git diff --quiet || ! git diff --cached --quiet; then
  git add -A
  git commit -m "$commit_msg"
fi

git push -u origin "$branch"
