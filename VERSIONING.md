# Version Management & Docker Image Tagging

This document explains how version tracking works for the Bookstore application and its Docker images.

## Overview

The project uses semantic versioning (SemVer) following the `MAJOR.MINOR.PATCH` format:
- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

## Docker Image Tags

Docker images are automatically built and tagged in multiple ways depending on how they're triggered:

### When PR is Merged to Main/Master
Triggered by: Merging a Pull Request to `main` or `master`

Tags created:
- `latest` - Always points to the most recent build
- `<version>` - Version from package.json (e.g., `1.0.0`)
- `<major>.<minor>` - Semantic version (e.g., `1.0`)
- `<major>` - Major version only (e.g., `1`)
- `<branch>-<sha>` - Branch name with commit SHA

**Example:**
```
your-dockerhub-username/bookstore:latest
your-dockerhub-username/bookstore:1.0.0
your-dockerhub-username/bookstore:1.0
your-dockerhub-username/bookstore:1
your-dockerhub-username/bookstore:main-abc1234
```

### When Version Tag is Pushed
Triggered by: Pushing a git tag matching `v*.*.*` (e.g., `v1.2.3`)

Tags created:
- `latest` - Always points to the most recent release
- `<version>` - Full semantic version (e.g., `1.2.3`)
- `<major>.<minor>` - Major and minor (e.g., `1.2`)
- `<major>` - Major version only (e.g., `1`)

**Example:**
```bash
# After pushing tag v1.2.3
your-dockerhub-username/bookstore:latest
your-dockerhub-username/bookstore:1.2.3
your-dockerhub-username/bookstore:1.2
your-dockerhub-username/bookstore:1
```

## How to Create a New Version

### Option 1: Using the Helper Script (Recommended)

We provide a convenient script to automate version bumping:

```bash
# For a patch release (1.0.0 -> 1.0.1)
./scripts/release.sh patch

# For a minor release (1.0.0 -> 1.1.0)
./scripts/release.sh minor

# For a major release (1.0.0 -> 2.0.0)
./scripts/release.sh major
```

The script will:
1. Check if your working directory is clean
2. Bump the version in package.json
3. Create a git commit with the version change
4. Create a git tag (e.g., `v1.2.3`)
5. Show you the commands to push

After running the script, push your changes:
```bash
git push && git push --tags
```

### Option 2: Manual Version Bump

1. **Update package.json version:**
   ```bash
   npm version patch  # or minor, or major
   ```

2. **Commit the change:**
   ```bash
   git add package.json pnpm-lock.yaml
   git commit -m "chore: bump version to X.Y.Z"
   ```

3. **Create and push a tag:**
   ```bash
   git tag -a v1.2.3 -m "Release version 1.2.3"
   git push && git push --tags
   ```

## Pulling Specific Versions

Users can pull specific versions of your Docker image:

```bash
# Latest version
docker pull your-dockerhub-username/bookstore:latest

# Specific version
docker pull your-dockerhub-username/bookstore:1.2.3

# Any version in 1.2.x series
docker pull your-dockerhub-username/bookstore:1.2

# Any version in 1.x.x series
docker pull your-dockerhub-username/bookstore:1
```

## GitHub Workflows

### docker-push.yml
- **Trigger:** PR merged to main/master
- **Purpose:** Continuous delivery of the latest code
- **Tags:** Uses package.json version + semantic versions

### docker-release.yml
- **Trigger:** Git tag pushed (v*.*.*)
- **Purpose:** Official releases
- **Tags:** Semantic versioning from git tag

## Best Practices

1. **Always bump version before creating a release**
   - Use the helper script or npm version command

2. **Follow semantic versioning rules**
   - Breaking changes = MAJOR bump
   - New features = MINOR bump
   - Bug fixes = PATCH bump

3. **Tag releases consistently**
   - Always prefix with 'v' (e.g., v1.2.3)
   - Match the version in package.json

4. **Document changes**
   - Consider maintaining a CHANGELOG.md
   - Use meaningful git commit messages

5. **Test before tagging**
   - Ensure CI passes
   - Test the Docker image locally if needed

## Checking Current Version

```bash
# Check package.json version
node -p "require('./package.json').version"

# Check git tags
git tag --list

# Check latest tag
git describe --tags --abbrev=0
```

## Troubleshooting

### "Working directory is not clean" error
Commit or stash your changes before creating a version:
```bash
git status
git add .
git commit -m "your changes"
```

### Docker image not building after tag push
1. Check GitHub Actions workflow runs
2. Verify secrets are configured: `DOCKER_USERNAME` and `DOCKER_PASSWORD`
3. Check the workflow logs for errors

### Wrong version in Docker image
Ensure package.json version matches your git tag (without the 'v' prefix)

## Examples

### Example 1: Bug Fix Release
```bash
# Current version: 1.0.0
./scripts/release.sh patch
# New version: 1.0.1
git push && git push --tags
# Docker images: 1.0.1, 1.0, 1, latest
```

### Example 2: New Feature Release
```bash
# Current version: 1.0.1
./scripts/release.sh minor
# New version: 1.1.0
git push && git push --tags
# Docker images: 1.1.0, 1.1, 1, latest
```

### Example 3: Breaking Change Release
```bash
# Current version: 1.1.0
./scripts/release.sh major
# New version: 2.0.0
git push && git push --tags
# Docker images: 2.0.0, 2.0, 2, latest
```
