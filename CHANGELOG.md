# CHANGELOG

Changelog file for all my updates/notes in one easy to view location.

## V3.2 Branch Created

2/17/25

- Ran into dependency issues with v3.1, so I re-downloaded v3 and created a 3.2 branch folder on local machine.
- Going through the "Setup" steps to make sure the app is working as expected before making any repo changes.

Issues:

- `npm audit fix` showed viem dependency issues
- Unhandled Runtime Error: Must be authenticated under callstack AlchemySignerWebClient
- CSS for home is not displaying correctly
- ~~ Dashboard page build error: hydration errors ~~ Fixed
- Next.js (14.2.4) is outdated

Updates:

- Removed the timestamp "last updated" info from dashboard so it only shows if the user is logged in.
- Updated Tailwindcss codes to fix display issues
- Updated README.md file to use markdown formatting

## V3.1 Branch Created

2/10/25

- Updated local file to be able to push to GitHub branch.

2/8/25

- Branch and changelog file created to track progress and updates.

2/20/2025

- Kept running into issues with tailwindcss, next.js, and account kit dependencies. The css was not loading on the page files and I kept running into internal server errors.
-- Attempting to fix the pages and confirming the account kit login before moving on with the NFT integration to the EOA.
-- Updated to the latest version of tailwindcss.
-- Uninstalled next.js and will just use react/typescript.