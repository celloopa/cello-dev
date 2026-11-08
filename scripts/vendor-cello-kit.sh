#!/usr/bin/env bash
# Copy @cello-kit/analytics and @cello-kit/contracts from a cello-kit tag into vendor/cello-kit/.
# Why: cello-kit is a private repo, and Netlify builds the site with no GitHub credentials,
# so a github: dependency cannot install there. The packages ship prebuilt (dist/, index.js),
# so copying their published files is enough. Usage: scripts/vendor-cello-kit.sh v0.1.0
set -euo pipefail
TAG="${1:?usage: scripts/vendor-cello-kit.sh <cello-kit tag, e.g. v0.1.0>}"
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"; trap "rm -rf \"$TMP\"" EXIT
git -c advice.detachedHead=false clone -q --depth 1 --branch "$TAG" https://github.com/celloopa/cello-kit.git "$TMP/ck"
SHA="$(git -C "$TMP/ck" rev-parse HEAD)"
for pkg in analytics contracts; do
  src="$TMP/ck/packages/$pkg"; dest="$ROOT/vendor/cello-kit/$pkg"
  rm -rf "$dest"; mkdir -p "$dest"
  cp "$src/package.json" "$dest/"
  # copy exactly what the package publishes (its "files" list)
  node -e "for (const f of require(process.argv[1]).files ?? []) console.log(f)" "$src/package.json" |
    while read -r f; do [ -e "$src/$f" ] && cp -R "$src/$f" "$dest/"; done
done
cat > "$ROOT/vendor/cello-kit/SOURCE.md" <<MD
# Vendored cello-kit packages

Copied from github.com/celloopa/cello-kit at tag \`$TAG\` (commit \`$SHA\`) by \`scripts/vendor-cello-kit.sh\`.
Do not edit these files here. Change cello-kit, tag it, then re-run the script with the new tag.
They are vendored because cello-kit is private and Coolify builds the image without GitHub credentials.
MD
echo "vendored @cello-kit/analytics and @cello-kit/contracts from $TAG ($SHA)"
