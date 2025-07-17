<#
.SYNOPSIS
  Automate init, commit and push to GitHub.
#>

param(
    [string]$RepoUrl,
    [string]$Branch = "main"
)

function PromptForRepoUrl {
    do {
        $u = Read-Host "Enter GitHub repo URL (e.g. https://github.com/user/repo.git)"
    } until ($u -match '^(https:\/\/|git@)')
    return $u
}

# 1. Check for git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git is not installed or not in PATH. Install from https://git-scm.com/downloads"
    exit 1
}

# 2. Prompt for RepoUrl if not provided
if (-not $RepoUrl) {
    $RepoUrl = PromptForRepoUrl
}

# 3. Initialize repo if needed
if (-not (Test-Path ".git")) {
    git init
    Write-Host "Initialized new git repository."
} else {
    Write-Host "Git repository already exists."
}

# 4. Add or update remote origin
try {
    $existing = git remote get-url origin 2>$null
} catch {
    $existing = $null
}

if ($existing) {
    git remote set-url origin $RepoUrl
    Write-Host "Updated remote origin to $RepoUrl"
} else {
    git remote add origin $RepoUrl
    Write-Host "Added remote origin $RepoUrl"
}

# 5. Stage all files and commit
git add .
Write-Host "Staged all files."
$msg = Read-Host "Enter commit message [Initial commit]"
if ([string]::IsNullOrWhiteSpace($msg)) { 
    $msg = "Initial commit" 
}
git commit -m $msg
Write-Host "Created commit: $msg"

# 6. Push to origin/$Branch
git push -u origin $Branch
if ($LASTEXITCODE -eq 0) {
    Write-Host "Pushed to origin/$Branch successfully."
} else {
    Write-Error "Error during push. Check branch name and permissions."
}
