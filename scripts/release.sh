#!/bin/bash
# Version Release Helper Script
# Usage: ./scripts/release.sh [major|minor|patch]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if npm version argument is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Please specify version bump type (major, minor, or patch)${NC}"
    echo "Usage: ./scripts/release.sh [major|minor|patch]"
    exit 1
fi

VERSION_TYPE=$1

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(major|minor|patch)$ ]]; then
    echo -e "${RED}Error: Invalid version type. Use major, minor, or patch${NC}"
    exit 1
fi

# Check if working directory is clean
if [[ -n $(git status -s) ]]; then
    echo -e "${RED}Error: Working directory is not clean. Please commit or stash your changes.${NC}"
    git status -s
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Warn if not on main/master
if [[ "$CURRENT_BRANCH" != "main" && "$CURRENT_BRANCH" != "master" ]]; then
    echo -e "${YELLOW}Warning: You are not on main/master branch (current: $CURRENT_BRANCH)${NC}"
    read -p "Do you want to continue? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}Current version: $CURRENT_VERSION${NC}"

# Bump version in package.json
echo -e "${YELLOW}Bumping $VERSION_TYPE version...${NC}"
npm version $VERSION_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}New version: $NEW_VERSION${NC}"

# Commit the version bump
git add package.json package-lock.json 2>/dev/null || git add package.json pnpm-lock.yaml 2>/dev/null || git add package.json
git commit -m "chore: bump version to $NEW_VERSION"

# Create git tag
echo -e "${YELLOW}Creating git tag v$NEW_VERSION...${NC}"
git tag -a "v$NEW_VERSION" -m "Release version $NEW_VERSION"

echo -e "${GREEN}✓ Version bumped to $NEW_VERSION${NC}"
echo ""
echo "Next steps:"
echo "1. Push the changes and tag:"
echo -e "   ${YELLOW}git push && git push --tags${NC}"
echo ""
echo "2. Or if you need to merge via PR:"
echo -e "   ${YELLOW}git push${NC}"
echo "   Then after PR is merged, tag the main branch and push the tag"
echo ""
echo "The Docker image will be automatically built and pushed with version tags when the tag is pushed."
