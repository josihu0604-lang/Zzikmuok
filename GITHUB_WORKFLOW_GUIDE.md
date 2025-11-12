# 🔄 GitHub Workflow Guide for ZZIK LIVE

## 📌 Current Repository Status

✅ **Repository**: https://github.com/josihu0604-lang/Zzikmuok  
✅ **Main Branch**: `main` (production-ready code)  
✅ **Dev Branch**: `genspark_ai_developer` (active development)  
✅ **Initial Commit**: `f6fad99` - Full-stack platform with Next.js 15 + Expo + Supabase

---

## 🚀 Quick Start for Collaborators

### 1. Clone Repository (로컬 PC)

```bash
# Windows
cd C:\Projects
git clone https://github.com/josihu0604-lang/Zzikmuok.git
cd Zzikmuok

# macOS/Linux
cd ~/Projects
git clone https://github.com/josihu0604-lang/Zzikmuok.git
cd Zzikmuok
```

### 2. Install Dependencies

```bash
cd landing
npm ci
```

### 3. Environment Setup

```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 4. Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

---

## 🌿 Branching Strategy

### Branch Types

| Branch | Purpose | Protected |
|--------|---------|-----------|
| `main` | Production code | ✅ Yes |
| `genspark_ai_developer` | Active development | ❌ No |
| `feature/*` | New features | ❌ No |
| `hotfix/*` | Critical fixes | ❌ No |

### Naming Conventions

```bash
feature/user-authentication
feature/admin-dashboard
feature/qr-code-generator

fix/gps-validation-bug
fix/rate-limit-memory-leak

hotfix/security-patch-001
hotfix/critical-api-error

refactor/database-queries
refactor/api-structure

docs/update-readme
docs/api-documentation
```

---

## 💻 Development Workflow

### A. Feature Development (New Feature)

```bash
# 1. Checkout main branch
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/user-profile

# 3. Make changes
# ... edit files ...

# 4. Commit changes
git add .
git commit -m "feat: Add user profile page with avatar upload

- Implement profile editing form
- Add avatar upload to Supabase Storage
- Add profile picture preview
- Validate form inputs"

# 5. Push to GitHub
git push origin feature/user-profile

# 6. Create Pull Request on GitHub
# Visit: https://github.com/josihu0604-lang/Zzikmuok/pulls
# Click "New pull request"
# Base: main <- Compare: feature/user-profile
```

### B. Bug Fix

```bash
# 1. Create fix branch
git checkout main
git pull origin main
git checkout -b fix/gps-accuracy

# 2. Fix bug
# ... edit files ...

# 3. Commit
git add .
git commit -m "fix: Improve GPS accuracy threshold from 100m to 50m

Resolves #123"

# 4. Push and create PR
git push origin fix/gps-accuracy
```

### C. Hotfix (Critical Production Bug)

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/security-patch-001

# 2. Apply critical fix
# ... edit files ...

# 3. Commit
git add .
git commit -m "hotfix: Patch SQL injection vulnerability in API

SECURITY: Sanitize user inputs in /api/submissions
CVE-2024-XXXX"

# 4. Push and create URGENT PR
git push origin hotfix/security-patch-001

# 5. Merge immediately after review
```

---

## 📝 Commit Message Convention

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: Add QR code generator` |
| `fix` | Bug fix | `fix: GPS validation threshold` |
| `docs` | Documentation | `docs: Update API endpoints` |
| `style` | Code formatting | `style: Format with Prettier` |
| `refactor` | Code refactoring | `refactor: Extract validation logic` |
| `test` | Add tests | `test: Add unit tests for API` |
| `chore` | Build/tools | `chore: Update dependencies` |
| `perf` | Performance | `perf: Optimize database queries` |
| `ci` | CI/CD | `ci: Add GitHub Actions workflow` |

### Examples

```bash
# Good commits
git commit -m "feat: Add user authentication with JWT

- Implement JWT token generation
- Add middleware for protected routes
- Add login/logout API endpoints"

git commit -m "fix: Resolve rate limiting memory leak

The in-memory bucket was not clearing expired entries.
Added cleanup interval to prevent memory growth.

Closes #456"

git commit -m "docs: Add API documentation for /api/submissions

- Add request/response examples
- Document error codes
- Add authentication requirements"

# Bad commits (avoid these)
git commit -m "update"
git commit -m "fix bug"
git commit -m "wip"
```

---

## 🔀 Pull Request Process

### 1. Before Creating PR

```bash
# Sync with latest main
git checkout main
git pull origin main

# Rebase your feature branch
git checkout feature/your-feature
git rebase main

# Resolve conflicts if any
# ... fix conflicts ...
git add .
git rebase --continue

# Force push (since history changed)
git push origin feature/your-feature --force
```

### 2. Create PR on GitHub

**Template:**

```markdown
## 📋 Description
Brief description of what this PR does.

## 🎯 Related Issues
Closes #123
Fixes #456

## ✅ Changes
- Add user profile page
- Implement avatar upload
- Add form validation

## 🧪 Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manually tested on dev environment

## 📸 Screenshots (if applicable)
![Screenshot](url)

## 🚀 Deployment Notes
- Requires database migration
- Update environment variables: `NEW_VAR=value`

## ✏️ Checklist
- [ ] Code follows project conventions
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No console errors
- [ ] Reviewed my own code
```

### 3. PR Review Process

1. **Self-review** your code first
2. Request review from team members
3. Address review comments
4. Get approval from at least 1 reviewer
5. Squash and merge

### 4. After PR Merged

```bash
# Switch to main and pull latest
git checkout main
git pull origin main

# Delete local feature branch
git branch -d feature/your-feature

# Delete remote branch (optional, GitHub can do this automatically)
git push origin --delete feature/your-feature
```

---

## 🔄 Syncing with Remote

### Update Local Repository

```bash
# Fetch all remote changes
git fetch origin

# See what changed
git log origin/main --oneline

# Pull latest main
git checkout main
git pull origin main
```

### Update Feature Branch with Latest Main

```bash
# Option 1: Rebase (cleaner history, recommended)
git checkout feature/your-feature
git rebase main

# Option 2: Merge (preserves history)
git checkout feature/your-feature
git merge main
```

---

## 🛡️ Conflict Resolution

### When Conflicts Occur

```bash
# After git rebase or git merge
# Files with conflicts will be marked

# 1. Check conflicted files
git status

# 2. Open conflicted files and resolve
# Look for markers: <<<<<<<, =======, >>>>>>>

# 3. After resolving
git add <resolved-files>

# 4. Continue rebase or commit merge
git rebase --continue   # for rebase
# or
git commit              # for merge
```

### Example Conflict Resolution

```javascript
<<<<<<< HEAD (your changes)
const radius = 100; // meters
=======
const radius = 50; // meters (from main)
>>>>>>> main

// Resolve to:
const radius = 50; // meters - using stricter validation
```

---

## 🎯 Best Practices

### ✅ DO

- **Small commits**: One logical change per commit
- **Descriptive messages**: Explain WHY, not just WHAT
- **Frequent pulls**: Stay in sync with main branch
- **Test before commit**: Ensure code works
- **Review your own PR**: Catch obvious issues
- **Write tests**: Especially for new features

### ❌ DON'T

- **Commit secrets**: No API keys, passwords in code
- **Commit node_modules**: Use .gitignore
- **Push directly to main**: Always use PR
- **Commit work-in-progress**: Use `git stash` instead
- **Force push to main**: NEVER do this
- **Commit without testing**: Always test locally first

---

## 🆘 Common Commands Cheat Sheet

### Daily Workflow

```bash
# Start new feature
git checkout main && git pull origin main
git checkout -b feature/my-feature

# Save work
git add .
git commit -m "feat: Add something"

# Push to remote
git push origin feature/my-feature

# Update feature branch with latest main
git checkout main && git pull origin main
git checkout feature/my-feature
git rebase main
git push origin feature/my-feature --force

# Finish feature (after PR merged)
git checkout main && git pull origin main
git branch -d feature/my-feature
```

### Emergency Commands

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Discard all local changes
git checkout .

# Temporarily save changes
git stash
git stash pop

# See what changed
git diff
git diff --staged

# Abort merge/rebase
git merge --abort
git rebase --abort
```

---

## 📊 GitHub Repository Links

### Quick Links

- **Repository**: https://github.com/josihu0604-lang/Zzikmuok
- **Issues**: https://github.com/josihu0604-lang/Zzikmuok/issues
- **Pull Requests**: https://github.com/josihu0604-lang/Zzikmuok/pulls
- **Actions**: https://github.com/josihu0604-lang/Zzikmuok/actions
- **Settings**: https://github.com/josihu0604-lang/Zzikmuok/settings

### Web Interface Workflows

1. **Create Issue**:
   - Go to Issues → New issue
   - Use issue templates (bug report, feature request)
   - Add labels, assignees, milestones

2. **Create PR from Web**:
   - After pushing branch, GitHub shows "Compare & pull request"
   - Fill in PR template
   - Add reviewers

3. **Review PR**:
   - Go to Pull Requests → Select PR
   - Click "Files changed" tab
   - Add line comments or general comments
   - Approve or request changes

---

## 🎓 Learning Resources

### Git Basics
- [Pro Git Book](https://git-scm.com/book/en/v2)
- [GitHub Docs](https://docs.github.com/en)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

### Advanced Topics
- [Git Rebase Tutorial](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📞 Support

For questions about the Git workflow:
1. Check this guide first
2. Search existing GitHub issues
3. Ask in team chat
4. Create a new issue with `question` label

---

**Happy Coding! 🚀**

*Last updated: 2025-11-12*
