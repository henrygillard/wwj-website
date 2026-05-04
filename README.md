# Wrestle With Jimmy — Website

This is the official website for Wrestle With Jimmy. It's built with React and Vite, and content (shows, photos, testimonials, etc.) is managed through a Google Sheet — no code changes needed for most updates.

---

## Table of Contents

- [How the site works](#how-the-site-works)
- [Running it locally](#running-it-locally)
- [Making changes: branches and pull requests](#making-changes-branches-and-pull-requests)
- [Updating content](#updating-content)

---

## How the site works

The site is a React app. The text and data on the page (show dates, quotes, photos, etc.) comes from a Google Sheet and gets pulled into source files by a sync script. You don't need to touch code to update content — just edit the sheet and run one command.

---

## Running it locally

**What you'll need installed:**
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Git](https://git-scm.com/)

### Step 1 — Get the code

Open a terminal and run:

```bash
git clone https://github.com/henrygillard/wwj-website.git
cd wwj-website
```

### Step 2 — Install dependencies

```bash
npm install
```

This downloads all the packages the project needs. It only needs to be run once (or again if `package.json` changes).

### Step 3 — Set up your environment file

The project needs a `.env` file with some private credentials. Copy the example file:

```bash
cp .env.example .env
```

Then open `.env` and fill in the values. Ask the project owner for the credentials — the `.env` file is never committed to GitHub for security reasons.

You'll also need the Google service account key file (`.google-credentials.json`) in the project root. Ask the project owner for this file.

### Step 4 — Start the dev server

```bash
npm run dev
```

You should see output like:

```
  VITE ready in 300ms

  ➜  Local:   http://localhost:5173/
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The page will automatically refresh whenever you save a file.

To stop the server, press `Ctrl + C` in the terminal.

---

## Making changes: branches and pull requests

When making changes to the site, **never work directly on `main`**. Instead, create a branch, make your changes, then open a pull request. This keeps the main codebase stable and lets others review changes before they go live.

### Step 1 — Make sure you're up to date

Before starting any new work, pull the latest changes from GitHub:

```bash
git checkout main
git pull
```

### Step 2 — Create a new branch

Pick a short name that describes what you're changing (no spaces — use hyphens):

```bash
git checkout -b your-branch-name
```

Examples:
- `git checkout -b update-show-dates`
- `git checkout -b fix-contact-form`
- `git checkout -b add-new-photos`

### Step 3 — Make your changes

Edit files, test things locally with `npm run dev`, and make sure everything looks right in the browser.

### Step 4 — Save your changes (commit)

Once you're happy with your changes, stage them and write a commit message:

```bash
git add .
git commit -m "Short description of what you changed"
```

A good commit message is specific: `"Fix nav link color on mobile"` is better than `"changes"`.

### Step 5 — Push your branch to GitHub

```bash
git push origin your-branch-name
```

### Step 6 — Open a pull request

1. Go to the repository on GitHub
2. You'll see a banner that says **"Compare & pull request"** — click it
3. Write a short description of what you changed and why
4. Click **"Create pull request"**

Someone will review the changes. Once approved, they'll merge it into `main` and the changes will go live.

---

## Updating content

Most content — show dates, photos, testimonials, nav links, etc. — is managed through the Google Sheet, not by editing code.

**Sheet URL:** https://docs.google.com/spreadsheets/d/1T0McDXR7VJ_Af1S8erm59_cqTGWvJoJ8_WYbjK0RoNk/edit

Edit the sheet, then run:

```bash
npm run sync-content
```

This pulls the latest content from the sheet and updates the source files locally. You can then preview your changes with `npm run dev`.

To pull content, commit, and deploy all in one step:

```bash
npm run sync-and-deploy
```

See [CONTENT.md](./CONTENT.md) for full details on each tab in the sheet.

---

## Need help?

If something isn't working, reach out to the project owner or open a GitHub issue.
