# Hom3Town consolidation plan

**Date:** 2026-09-12  
**Branch:** `GrokBot-Mgr`  
**Related:** Issue #40, `AUDIT_REPORT.md`  
**Machine scanned:** Cami-Home-Desk — `D:\dev files\GameDEV\repos\hom3town`

---

## Git branch reality check (Hom3Town-v3)

| Ref | SHA (short) | Notes |
|---|---|---|
| `origin/main` | `3df68b1` | Current GitHub source of truth |
| `origin/v3.3` | `3df68b1` | **Identical to `main`** (no unique commits) |
| `origin/GrokBot-Mgr` | `cfc53ce` | `main` + `AUDIT_REPORT.md` only |
| Local `HEAD` | `4e488f0` | **27 commits behind** `origin/main` |
| Deleted on remote | `v3.1`, `v3.1.1` | Pruned after fetch; history lived via merges into main |

**Implication:** Diffing local working tree vs `main` vs `v3.3` yields the **same git diff**. The useful split is:

1. **Missing remote work** — 27 commits on `origin/main` not in local `HEAD` (Nav/Footer split, anon.png fixes, pinata export, remove nested `git/` dir, etc.)
2. **Local uncommitted edits** on top of old `HEAD` (anon typo renames, async `updateFromAccountKit`, `config.ts` churn, nested `git/hom3town-v3` still present, lockfile noise)

Do **not** `git pull` until local salvage is committed or stashed onto `GrokBot-Mgr`.

---

## Diff summary: local working tree vs `origin/main` (= `v3.3`)

~67 paths / ~5.8k insertions / ~4.1k deletions when comparing dirty tree to `origin/main`. That number is **misleading** — most of it is “never pulled remote commits” plus a leftover nested `git/hom3town-v3/` tree that **main already deleted**.

### What remote `main` already fixed (local is missing)

From `HEAD..origin/main` (27 commits), including:

- Separated `Navbar` / `Footer` components
- Footer / CSS / layout fixes
- `anon.png` path + sizing fixes (typo Annon→Anon on remote)
- Pinata export character work
- `tokenId` on `UserData`
- **Deleted nested `git/` directory**
- Merges from `v3.1.1` / collaborator PRs

### Pure local uncommitted changes (vs local `HEAD` only)

Worth reviewing before sync:

| Path | Local change | Recommendation |
|---|---|---|
| `account-kit-app/app/**` anon→anon path strings | Aligns with remote intent | **Salvage names only if still needed after pull**; remote already fixed anon |
| `userDataManager.ts` | Reworked `logAvatarAsPNG` toward html2canvas; default username `Anon`; async `updateFromAccountKit` in dashboard | **Salvage carefully** — recap says `logAvatarAsPNG` is dead/broken; prefer remote + new mint work over keeping this |
| `dashboard/page.tsx` | async userData update; anon paths; minor className | Re-apply async bit **after** updating to main if still desired |
| `config.ts` | Simplified Account Kit config; **hardcoded Alchemy API key in working tree**; chain flipped toward `sepolia` | **Do not commit secrets.** Restore env-based key. Decide Shape vs Sepolia intentionally |
| `git/hom3town-v3/**` | Nested duplicate app still modified locally | **Delete / do not salvage** — remote already removed this |
| `package.json` / lockfiles | Large churn | Regenerate after sync; don’t hand-merge |
| Untracked `anon.PNG` / `Anon.svg` | Local renames | Keep assets if missing on main; verify against remote `anon.png` |
| Untracked `backup.zip` | Archive blob | **Do not commit** — move to backups folder or delete |
| Untracked `env.ts` | Env *name* exports including private-key slots | **Do not commit** — keep local-only / use `.env` |

### Local vs `GrokBot-Mgr`

Same as vs `main`, plus local tree **lacks** `AUDIT_REPORT.md` (expected).

---

## Sibling folders under `D:\dev files\GameDEV\repos\hom3town`

### KEEP (active)

| Path | Why |
|---|---|
| `hom3town-v3/` | Primary app; git remote → Hom3Town-v3. Sync to `main`, continue work on `GrokBot-Mgr` |
| `shapeNFT-test-v2/` | Contracts workhorse; git remote `shapecraft-nft-test`, branch `v3`, **ahead of origin** with Avatar.sol work |
| `spritesheet-uploader/` | Tooling; referenced in 9/11 recap (Netlify deploy) |
| `hom3town-v4/` | Design/planning sandbox (logos, stitch mocks, nested docs) — keep as **assets/notes**, not as app runtime |
| `hom3town-recap-9-11-26.md` | Strategy source of truth (extend v3 → PixiJS `/world`) |

### ARCHIVE (zip + move aside; don’t delete yet)

Suggested archive root: `D:\dev files\GameDEV\repos\hom3town\_archive\2026-09-12\`

| Path | Why archive |
|---|---|
| `Hom3Town/` | Early 0.0.1 client/server/account-kit, no git |
| `metaverse-homebase/` | Earliest prototype |
| `hom3town-v2/` | Pre-hackathon Next experiment, no git |
| `hom3town-v2-login/` | Login experiment, no git |
| `hom3town-v3.1/` | Nested copy + loose `.tsx.txt` scratch patches |
| `hom3town-v3.2/` | Nested copy, no git |
| `hom3town-v3.3/` | Local `hom3town-app` experiment (**not** the same as git branch `v3.3`, which equals `main`) |
| `MintNFT-main/` | Older hardhat/airdrop kit |
| `shape-nft-test/` | Older hardhat NFT test |
| `shapeNFT-test/` | Older uploader test (has git → `shape-nft-test`) — superseded by v2 |

### DELETE (only after archive verified)

| Path | Why |
|---|---|
| `hom3town-v3/backup.zip` | Untracked dump; redundant if `_archive` exists |
| `hom3town-v3/git/` | Nested duplicate; already removed on `main` — delete after confirming no unique files vs `account-kit-app/` |
| Duplicate nested `node_modules` / `.next` inside archived trees | Safe to wipe anytime to save disk |

---

## Recommended next actions (in order)

1. **Rotate** any Alchemy key that was hardcoded in local `config.ts`; switch back to env var.
2. On local `hom3town-v3`: commit *non-secret* salvage onto a WIP commit **or** stash; then checkout/create tracking for `GrokBot-Mgr` from `origin/GrokBot-Mgr`.
3. Merge/rebase `origin/main` into `GrokBot-Mgr` (GrokBot-Mgr is already based on current main + audit doc).
4. Re-apply only the salvage rows marked above (likely: async userData if still wanted; confirm anon assets).
5. Execute **ARCHIVE** moves for sibling folders; keep `hom3town-v3`, `shapeNFT-test-v2`, `spritesheet-uploader`, `hom3town-v4` (assets), recap.
6. Continue product fixes on `GrokBot-Mgr` per `#40` / `AUDIT_REPORT.md` (mint wiring, Pinata server-side, etc.). **No PR until you say so.**

---

## Decision log

- MVP path (from recap): **extend v3**, defer full multi-repo split.
- Git branch `v3.3` ≠ folder `hom3town-v3.3`.
- Consolidation authority for upcoming edits: branch **`GrokBot-Mgr`**.
