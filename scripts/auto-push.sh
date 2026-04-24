#!/usr/bin/env bash
set -euo pipefail

watch_mode=0
interval=10
repo_url=""
commit_msg="chore: auto push"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --watch)
      watch_mode=1
      shift
      ;;
    --interval)
      interval="${2:?Missing value for --interval}"
      shift 2
      ;;
    -*)
      echo "Unknown option: $1"
      exit 1
      ;;
    *)
      if [[ -z "$repo_url" ]]; then
        repo_url="$1"
      elif [[ "$commit_msg" == "chore: auto push" ]]; then
        commit_msg="$1"
      else
        echo "Unexpected argument: $1"
        exit 1
      fi
      shift
      ;;
  esac
done

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

push_once() {
  if git diff --quiet && git diff --cached --quiet && [[ -z "$(git ls-files --others --exclude-standard)" ]]; then
    if [[ -n "$(git status --short --branch | awk 'NR==1 && $0 ~ /ahead/')" ]]; then
      git push -u origin "$branch"
    fi
    return 0
  fi

  git add -A

  if ! git diff --cached --quiet; then
    git commit -m "$commit_msg"
  fi

  git push -u origin "$branch"
}

if [[ "$watch_mode" -eq 1 ]]; then
  while true; do
    push_once
    sleep "$interval"
  done
fi

push_once
