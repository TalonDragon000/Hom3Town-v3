# Hom3Town-v3 Security & Quality Audit Report
**Branch:** GrokBot-Mgr  
**Date:** September 12, 2026  
**Total Source Files Analyzed:** 23 TypeScript/TSX files  
**Existing Open Issues:** 19  

---

## Executive Summary

This audit identified **28 distinct issues** across the Hom3Town-v3 codebase, categorized into critical bugs, security concerns, type safety issues, UX problems, and technical debt. The application shows promise but requires attention to production readiness, error handling, and user experience consistency.

**Key Findings:**
- 5 P0 (Critical) issues requiring immediate attention
- 12 P1 (High priority) issues affecting functionality/UX
- 11 P2 (Medium priority) improvements and optimizations

---

## Repository Structure Overview

```
Hom3Town-v3/
├── account-kit-app/          # Main Next.js application
│   ├── app/
│   │   ├── components/       # React components (12 files)
│   │   ├── utils/            # Utility functions & data managers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── styles/           # CSS files
│   │   ├── dashboard/        # Dashboard page
│   │   ├── create-avatar/    # Character creator page
│   │   └── login/            # Login page
│   ├── public/images/        # Static assets & sprite sheets
│   └── config.ts             # Account Kit configuration
└── package.json              # Root-level wrapper

**Key Entrypoints:**
- `app/page.tsx` - Landing page
- `app/dashboard/page.tsx` - User dashboard (requires auth)
- `app/create-avatar/page.tsx` - Character customization
- `app/providers.tsx` - Alchemy Account Kit provider setup
- `config.ts` - Environment variables & chain configuration
```

---

## Environment Configuration Analysis

### Current Setup
- **Chain:** Shape Sepolia (testnet)
- **Auth Methods:** Google OAuth, WalletConnect
- **State Management:** localStorage + React hooks
- **Image Storage:** Pinata IPFS

### Environment Variables Required
1. `NEXT_PUBLIC_ALCHEMY_API_KEY` ✓ (configured)
2. `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` ✓ (configured)
3. `NEXT_PUBLIC_PINATA_JWT` ⚠️ (referenced but handling issues)
4. `NEXT_PUBLIC_PINATA_GATEWAY` ⚠️ (referenced but handling issues)

### ⚠️ Missing: `.env.example` file for onboarding contributors

---

## Critical Issues (P0)

### 1. **Broken Imports Causing Build Failure**
**Severity:** P0 (Critical)  
**File:** `account-kit-app/app/dashboard/page.tsx:17-19`  
**Issue:** Three non-existent components are imported:
```typescript
import MintBtn from "../components/MintBtn";           // ❌ File doesn't exist
import ClaimCharacterBtn from "../components/ClaimCharacterBtn";  // ✓ Exists but unused
import MintButton from "../components/MintButton";     // ❌ File doesn't exist
```
Only `MintButton` is used in the JSX (line 81), but the file doesn't exist.

**Impact:** Application will fail to build. TypeScript/ESLint errors in IDE.

**Root Cause:** Incomplete refactoring or code cleanup.

---

### 2. **Missing Default Avatar Image**
**Severity:** P0 (Critical)  
**Files:** Multiple components reference `/images/anon.png`  
**Issue:** 
- Code references: `/images/anon.png`
- Actual file: `/images/annon.PNG` (typo: double 'n', uppercase extension)

**Affected Components:**
- `app/components/Avatar.tsx:62`
- `app/components/Navbar.tsx:12`
- `app/dashboard/page.tsx:78`
- `app/create-avatar/page.tsx:6`

**Impact:** Default avatar won't display, showing broken image placeholders. Poor first-user experience.

**Fix:** Rename `annon.PNG` → `anon.png` OR update all references to match existing filename.

---

### 3. **Environment Variables Accessed Incorrectly in Client Components**
**Severity:** P0 (Security/Functionality)  
**Files:**
- `account-kit-app/app/components/CharacterPreview.tsx:102`
- `account-kit-app/app/components/ClaimCharacterBtn.tsx:39`

**Issue:**
```typescript
const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;
if (!pinataJWT) {
    throw new Error("Pinata JWT is not configured");
}
```

**Problems:**
1. Runtime checks for build-time variables (Next.js inlines these at build)
2. No graceful degradation - throws errors that crash the component
3. JWT validation logic commented out but should be server-side anyway
4. Exposes API configuration details in client-side error messages

**Impact:** 
- IPFS uploads will fail silently or with cryptic errors
- Poor UX when env vars missing
- Security: JWT exposed in client bundle

**Recommended Fix:**
- Move IPFS uploads to API routes (`/api/upload-avatar`)
- Keep secrets server-side only
- Return user-friendly errors to client

---

### 4. **Avatar Component Props Type Mismatch**
**Severity:** P0 (Type Safety)  
**File:** `account-kit-app/app/components/Avatar.tsx:10-14`  
**Issue:**
```typescript
interface AvatarProps {
    defaultImagePath: string;
    className?: string;
    size: 'small' | 'normal';  // ❌ Required in interface
}

export const Avatar: React.FC<AvatarProps> = ({ 
    defaultImagePath,
    className = '',
    size = 'normal'  // ✓ But has default value
}) => {
```

**Impact:** TypeScript confusion, potential runtime errors if size not provided despite default.

**Fix:** Make `size` optional in interface: `size?: 'small' | 'normal'`

---

### 5. **Incomplete NFT Minting Implementation**
**Severity:** P0 (Core Feature Incomplete)  
**Related Issue:** #7 (Mint Button for avatar)  
**File:** `account-kit-app/app/dashboard/page.tsx:81`

**Issue:**
- Dashboard uses `<MintButton />` which doesn't exist
- `ClaimCharacterBtn.tsx` exists but handles only IPFS upload, no blockchain minting
- No smart contract integration found in codebase
- README mentions NFT minting as core feature, but implementation missing

**Impact:** Core feature non-functional. Users cannot mint NFTs as advertised.

**Suggested Path:**
1. Create proper `MintButton` component
2. Integrate with Avatar.sol smart contract (mentioned in #7)
3. Add disclaimer modal (per #7 requirements)
4. Implement transaction handling & gas sponsorship (#11)

---

## High Priority Issues (P1)

### 6. **Character Preview Rendering Too Small**
**Severity:** P1 (UX/Visual Bug)  
**Related Issue:** #39 (tiny character preview)  
**File:** `account-kit-app/app/styles/character-creator.css:19-29`

**Issue:**
```css
.preview-character {
    width: 256px;
    height: 256px;
    /* ... */
}

.preview-layer {
    width: 64px;      /* ⚠️ Sprite is only 64x128px */
    height: 128px;    /* in a 256x256px container */
    /* ... */
}
```

**Impact:** Character appears tiny in preview box, poor visual feedback during customization.

**Fix:** Scale sprites 2x or 4x to fill container properly.

---

### 7. **No Default Underwear on Body Selection**
**Severity:** P1 (UX/Content)  
**Related Issue:** #37 (underwear default)  
**File:** `account-kit-app/app/components/CharacterCreatorClient.tsx:74-91`

**Issue:** When user selects a body, underwear should auto-select to avoid naked avatars.

**Current Behavior:**
```typescript
if (category === 'body') {
    const newGender = determineGender(frameId);
    if (newGender !== selectedGender) {
        setSelectedFrames({
            ...DEFAULT_SELECTED_FRAMES,
            body: frameId
        });
        // ❌ No underwear auto-selection
    }
}
```

**Fix:** Add default underwear based on gender when body is selected:
```typescript
const defaultUnderwear = newGender === 'male' ? 24 : 25; // Per spriteMetadata.ts
setSelectedFrames({
    ...DEFAULT_SELECTED_FRAMES,
    body: frameId,
    clothes: [defaultUnderwear]
});
```

---

### 8. **Excessive Console Logging in Production Code**
**Severity:** P1 (Performance/Security)  
**Files:** 23+ occurrences across codebase

**Issue:** Sensitive data logged to console:
- User addresses: `dashboard/page.tsx:32-35`
- Avatar configurations: `CharacterCreatorClient.tsx:59`
- API responses: `ClaimCharacterBtn.tsx:94`
- UserDataManager operations: `userDataManager.ts` (13 console.log statements)

**Impact:**
- Performance overhead
- Sensitive data exposure in production
- Cluttered browser console

**Fix:** 
- Use proper logging library with levels (e.g., `debug`, `pino`)
- Strip logs in production builds
- Add `eslint-plugin-no-console` rule

---

### 9. **No Loading States for Async Operations**
**Severity:** P1 (UX)  
**Files:**
- `ClaimCharacterBtn.tsx` - IPFS upload has no loading indicator
- `CharacterPreview.tsx:85-169` - Export function no loading state
- `dashboard/page.tsx:27-57` - User data fetch shows "Loading..." in wrong place

**Issue:** Users don't know if actions are processing. Buttons can be clicked multiple times.

**Impact:** Confusion, duplicate transactions, poor UX.

**Fix:**
- Add loading states to all async button actions
- Disable buttons during processing
- Show progress indicators for uploads

---

### 10. **Character Creator Tabs Disabled Without Clear Feedback**
**Severity:** P1 (UX)  
**File:** `app/components/CharacterCreator.tsx:96-103`

**Issue:**
```typescript
const isDisabled = category !== 'body' && 
    (selectedFrames.body === null || selectedFrames.body === undefined);
```
Tabs are disabled until body selected, but user gets no explanation why.

**Impact:** Users confused why they can't click tabs.

**Fix:** Add tooltip or helper text: "Select a body type first to unlock customization options"

---

### 11. **Username Validation But No Backend Integration**
**Severity:** P1 (Incomplete Feature)  
**File:** `app/components/EditProfileBtn.tsx:18-20`

**Issue:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidUsername) return;
    
    // TODO: Add API call to update username
    console.log('Update username to:', username);
    setIsModalOpen(false);
    // ❌ Username not actually saved anywhere
};
```

**Impact:** User thinks they changed username, but it's not persisted.

**Fix:**
- Either implement backend endpoint
- Or save to localStorage via UserDataManager
- Or remove feature with "Coming Soon" label

---

### 12. **Inconsistent Error Handling Patterns**
**Severity:** P1 (Developer Experience/Reliability)  
**Examples:**

1. Silent failures:
```typescript
// userDataManager.ts:131
console.error('Failed to load or draw images:', error);
// ❌ No user notification
```

2. Alert-based errors:
```typescript
// CharacterCreatorClient.tsx:62
alert('Failed to save character configuration. Please try again.');
```

3. Try-catch without recovery:
```typescript
// CharacterPreview.tsx:91-168
try {
    // ... upload logic
} catch (error) {
    console.error("Error during export/upload:", error);
    alert(`Error: ${error.message}`);
    // ❌ No cleanup, button stays in limbo
}
```

**Fix:** Standardize error handling with:
- Toast notifications library (e.g., `react-hot-toast`)
- Consistent error boundaries
- Recovery mechanisms

---

### 13. **localStorage Without SSR Safety Checks**
**Severity:** P1 (Next.js Compatibility)  
**File:** `app/utils/userDataManager.ts:55-63`

**Issue:**
```typescript
getUserData(): UserData {
    if (typeof window === 'undefined') {
        console.log('UserDataManager - Window undefined, returning default data');
        return DEFAULT_USER_DATA;
    }
    const storedData = localStorage.getItem(this.storageKey);
    // ...
}
```

**Problem:** Checks exist but inconsistently applied. Other components may call localStorage without checks.

**Impact:** Hydration errors, SSR failures.

**Fix:** 
- Audit all localStorage usage
- Consider using `next-client-cookies` or similar SSR-safe storage
- Add ESLint rule to prevent direct localStorage access

---

### 14. **Dead Code: Unused Login Import**
**Severity:** P1 (Code Quality)  
**File:** `app/dashboard/page.tsx:10`

**Issue:**
```typescript
import Login from "../login/page";  // ❌ Imported but never used
```

**Impact:** Bundle bloat, developer confusion.

---

### 15. **Gender Filtering Logic Missing for Body Category**
**Severity:** P1 (Logic Bug)  
**File:** `app/components/CharacterCreator.tsx:46-56`

**Issue:**
```typescript
if (selectedGender && activeCategory !== 'body') {
    const isAllowed = isFrameAllowedForGender(frameId, selectedGender);
    if (!isAllowed) {
        return null;
    }
}
```
Body category never filtered, so all 6 bodies show even after gender determined. Could confuse users or allow mismatched selections.

---

### 16. **No Mobile Responsiveness**
**Severity:** P1 (UX/Accessibility)  
**Related Issue:** #32 (Mobile-Friendly)  
**Files:** Character creator CSS uses fixed widths

**Issue:**
```css
.preview-container {
    max-width: 300px;  /* Fixed width */
}
.create-container {
    max-width: 500px;  /* Fixed width */
}
```

**Impact:** Poor mobile experience, layout breaks on small screens.

---

### 17. **Long Text Not Truncated**
**Severity:** P1 (UX)  
**Related Issue:** #33 (Shorten or wrap long text)  
**File:** `app/dashboard/page.tsx:90`

**Issue:**
```tsx
<p><b>Account ID:</b> {user?.address || 'Not Connected'}</p>
```

Full wallet address (42 chars) breaks layout on mobile, hard to read.

**Fix:** Truncate with ellipsis: `{user?.address.slice(0,6)}...{user?.address.slice(-4)}`

---

## Medium Priority Issues (P2)

### 18. **Commented Debug Code Littering Codebase**
**Severity:** P2 (Code Quality)  
**Files:** 30+ commented `console.log` statements

**Examples:**
- `characterData.ts:47, 54, 65, 76, 81, 88`
- `spriteUtils.ts:19, 30, 38`
- `CharacterCreator.tsx:35, 37, 41, 50, 54, 64`

**Fix:** Remove before production or use conditional debug builds.

---

### 19. **Blank Frame IDs Hardcoded**
**Severity:** P2 (Maintainability)  
**File:** `app/utils/characterData.ts:56-60`

**Issue:**
```typescript
const blankFrames = [23, 31, 32, 33, 34, 35, 128, 129, 130, 131];
```

**Problem:** Magic numbers with no documentation. If sprite sheet changes, this breaks.

**Fix:** 
- Add comments explaining each blank frame
- OR mark blanks in `spriteMetadata.ts` with `isBlank: true` property

---

### 20. **Duplicate CSS Button Definitions**
**Severity:** P2 (Code Quality)  
**File:** `app/globals.css:220-240`

**Issue:**
```css
.btn {
  @apply px-4 py-2 rounded-md;
}
/* ... */
.btn {
  background-color: var(--blue-color);
  /* ... duplicate definition */
}
```

Two `.btn` classes will conflict. Second overrides first.

---

### 21. **Frame ID Display Styling Issues**
**Severity:** P2 (UX)  
**File:** `app/styles/character-creator.css:141-154`

**Issue:**
```css
.frame-id-display {
    visibility: hidden;
    /* ... positioned OUTSIDE sprite-option box */
    bottom: -25px;  /* Below container */
}
```

ID labels positioned outside containers, no hover trigger to show them.

**Fix:** Add `:hover` trigger or remove if not needed.

---

### 22. **No Image Optimization**
**Severity:** P2 (Performance)  
**Files:** Next.js `<Image>` component used inconsistently

**Examples:**
- `CharacterPreview.tsx:180-186` uses `<Image>` ✓
- `Avatar.tsx:62-72` uses `<Image>` ✓
- But sprite sheet loaded as CSS background-image (no optimization)

**Impact:** Slower page loads, poor Core Web Vitals.

---

### 23. **Hardcoded URLs**
**Severity:** P2 (Maintainability)  
**File:** `app/components/Footer.tsx:6-16`

**Issue:**
```typescript
const openGitHub = () => {
  window.open('https://github.com/TalonDragon000/Hom3Town-v3', '_blank');
};
```

**Fix:** Move to config file or environment variables for easier updates.

---

### 24. **Unused Sour_Gummy Font Import**
**Severity:** P2 (Performance)  
**File:** `app/layout.tsx:12`

**Issue:**
```typescript
const sourGummy = Sour_Gummy({ subsets: ["latin"] });
// ❌ Defined but never used in className
```

**Impact:** Unnecessary font download, bundle bloat.

---

### 25. **No ARIA Labels or Accessibility Features**
**Severity:** P2 (Accessibility)  
**Files:** All interactive components

**Examples:**
- Buttons missing `aria-label`
- No keyboard navigation for sprite selection
- No screen reader support for avatar preview

**Fix:** Add ARIA attributes, keyboard handlers, focus management.

---

### 26. **UserDataManager Singleton Pattern Risks**
**Severity:** P2 (Architecture)  
**File:** `app/utils/userDataManager.ts:41-52`

**Issue:** Singleton pattern can cause issues in React 18's concurrent rendering.

**Better Approach:** Use React Context or Zustand for state management.

---

### 27. **No Rate Limiting or Validation on IPFS Uploads**
**Severity:** P2 (Security)  
**Files:** `ClaimCharacterBtn.tsx`, `CharacterPreview.tsx`

**Issue:** No checks prevent users from spamming Pinata uploads.

**Impact:** Could exhaust Pinata quota, cost money.

**Fix:** Implement rate limiting, file size validation, duplicate detection.

---

### 28. **Missing TypeScript Strict Mode**
**Severity:** P2 (Type Safety)  
**File:** `tsconfig.json:10`

**Issue:**
```json
"strict": true,
```
Enabled ✓ but implicit `any` types found:
- `characterData.ts:10` - `Record<Category, number | null | number[]>`
- `spriteMetadata.ts:22` - `Record<string, SpriteProperties[]>`

**Fix:** Enable `noImplicitAny`, fix violations.

---

## Cross-Reference with Existing Issues

| Issue # | Title | Status | Audit Findings |
|---------|-------|--------|----------------|
| #7 | Mint Button for avatar | Open | Confirmed missing (Finding #5) |
| #9 | Link user metadata to wallet addresses | Open | localStorage not linked to wallet switching |
| #11 | Free Avatar NFT | Open | Paymaster not implemented |
| #29 | Dashboard: Change Avatar Preview to the NFT | Open | Dashboard still uses localStorage avatar |
| #30 | Save Button: Limit NFT Updates | Open | No update limiting logic found |
| #31 | UX/UI: Make the website pretty | Open | Multiple UX issues found (Findings #6, #10, #17) |
| #32 | Mobile-Friendly | Open | Confirmed (Finding #16) |
| #33 | Shorten or wrap long text | Open | Confirmed (Finding #17) |
| #35 | Character Creator: Bugs | Open | 8+ bugs found in creator components |
| #36 | Make more categories | Open |架构支持更多分类，需要添加元数据 |
| #37 | underwear default | Open | Confirmed (Finding #7) |
| #39 | tiny character preview | Open | Confirmed (Finding #6) |

**New Issues Not Covered by Existing Tickets:** 16

---

## Recommended Sub-Issues to Create

### Critical (Create First)

#### SUB-01: Fix Broken MintButton Import in Dashboard
**Priority:** P0  
**Title:** `[BUG] Dashboard fails to build due to missing MintButton component`  
**Affected Files:**
- `app/dashboard/page.tsx:17-19, 81`

**Rationale:** Prevents application from building. Must fix immediately.

**Suggested Fix:**
1. Create `app/components/MintButton.tsx` with proper NFT minting logic
2. Remove unused imports (MintBtn, ClaimCharacterBtn, Login)
3. Connect to Avatar.sol smart contract

---

#### SUB-02: Fix Missing Default Avatar Image
**Priority:** P0  
**Title:** `[BUG] Default avatar image path mismatch breaks avatar display`  
**Affected Files:**
- `public/images/annon.PNG` (actual file)
- All components referencing `/images/anon.png`

**Rationale:** Critical UX issue - users see broken images on first load.

**Suggested Fix:** Rename `annon.PNG` → `anon.png`

---

#### SUB-03: Move IPFS Upload Logic to API Routes
**Priority:** P0  
**Title:** `[SECURITY] Environment variables exposed in client bundle`  
**Affected Files:**
- `app/components/CharacterPreview.tsx:102-122`
- `app/components/ClaimCharacterBtn.tsx:39-60`

**Rationale:** 
- Security risk: JWT tokens in client bundle
- Better error handling on server side
- Enables rate limiting and validation

**Suggested Implementation:**
```typescript
// app/api/upload-avatar/route.ts
export async function POST(request: Request) {
    const { imageData, metadata } = await request.json();
    // Server-side Pinata upload
}
```

---

#### SUB-04: Fix Avatar Component Type Safety
**Priority:** P0  
**Title:** `[TYPE] Avatar component size prop type mismatch`  
**Affected Files:**
- `app/components/Avatar.tsx:10-14`

**Rationale:** Prevents TypeScript errors, improves developer experience.

---

### High Priority

#### SUB-05: Scale Character Preview Sprites
**Priority:** P1  
**Title:** `[UX] Character preview renders too small in creator (Issue #39)`  
**Affected Files:**
- `app/styles/character-creator.css:19-40`

**Suggested Fix:** Apply 2x or 4x transform scale to `.preview-layer`

---

#### SUB-06: Auto-Select Default Underwear on Body Selection
**Priority:** P1  
**Title:** `[UX] Auto-select underwear when body type chosen (Issue #37)`  
**Affected Files:**
- `app/components/CharacterCreatorClient.tsx:74-91`

**Implementation:**
```typescript
const defaultClothing = {
    male: [24],    // Male underwear (ID 24)
    female: [25]   // Female underwear (ID 25)
};
```

---

#### SUB-07: Implement Production Logging Strategy
**Priority:** P1  
**Title:** `[REFACTOR] Remove console.log statements and add proper logging`  
**Affected Files:** 23+ files

**Suggested Implementation:**
- Add `next-logger` or similar
- Create `utils/logger.ts` wrapper
- Strip logs in production builds
- Keep error reporting (Sentry integration?)

---

#### SUB-08: Add Loading States to All Async Actions
**Priority:** P1  
**Title:** `[UX] Add loading indicators for IPFS uploads and data fetching`  
**Affected Files:**
- `ClaimCharacterBtn.tsx`
- `CharacterPreview.tsx:85-169`
- `dashboard/page.tsx`

**Implementation:** Use `useState` for `isUploading`, disable buttons, show spinners

---

#### SUB-09: Add Character Creator Helper Text
**Priority:** P1  
**Title:** `[UX] Explain why customization tabs are disabled`  
**Affected Files:**
- `app/components/CharacterCreator.tsx:86-108`

**Suggested Text:** "👆 Select a body type above to unlock customization options"

---

#### SUB-10: Implement Username Save Functionality
**Priority:** P1  
**Title:** `[FEATURE] Complete username edit functionality in profile modal`  
**Affected Files:**
- `app/components/EditProfileBtn.tsx:18-20`
- `app/utils/userDataManager.ts:150-152`

**Options:**
1. Save to localStorage via UserDataManager
2. Create API endpoint for backend storage
3. Remove feature until backend ready

---

#### SUB-11: Standardize Error Handling
**Priority:** P1  
**Title:** `[REFACTOR] Replace alerts with toast notifications`  
**Affected Files:** Multiple

**Suggested Library:** `react-hot-toast`

---

#### SUB-12: Add SSR-Safe localStorage Wrapper
**Priority:** P1  
**Title:** `[BUG] Prevent hydration errors from localStorage access`  
**Affected Files:**
- `app/utils/userDataManager.ts`
- Add ESLint rule

**Implementation:** Create `useLocalStorage` hook with SSR checks

---

#### SUB-13: Remove Dead Code (Unused Imports)
**Priority:** P1  
**Title:** `[REFACTOR] Remove unused imports and dead code`  
**Affected Files:**
- `dashboard/page.tsx:10, 17-18`
- `layout.tsx:12` (unused font)

**Tool:** Run `npx depcheck` and ESLint's unused vars rule

---

#### SUB-14: Truncate Long Wallet Addresses
**Priority:** P1  
**Title:** `[UX] Format long wallet addresses and CIDs (Issue #33)`  
**Affected Files:**
- `app/dashboard/page.tsx:90-92`

**Implementation:**
```typescript
const truncateAddress = (addr: string) => 
    `${addr.slice(0,6)}...${addr.slice(-4)}`;
```

---

### Medium Priority

#### SUB-15: Remove Commented Debug Code
**Priority:** P2  
**Title:** `[CLEANUP] Remove commented console.log statements`  
**Affected Files:** 30+ occurrences

**Rationale:** Code cleanliness, reduces noise for new contributors.

---

#### SUB-16: Document Blank Frame IDs
**Priority:** P2  
**Title:** `[DOCS] Add comments explaining blank frame IDs in characterData.ts`  
**Affected Files:**
- `app/utils/characterData.ts:56-60`

---

#### SUB-17: Fix Duplicate Button CSS Classes
**Priority:** P2  
**Title:** `[CSS] Resolve duplicate .btn class definitions`  
**Affected Files:**
- `app/globals.css:220-240`

---

#### SUB-18: Fix Frame ID Display Visibility
**Priority:** P2  
**Title:** `[UI] Frame ID tooltips not showing on hover`  
**Affected Files:**
- `app/styles/character-creator.css:141-154`

**Suggested Fix:**
```css
.sprite-option:hover .frame-id-display {
    visibility: visible;
}
```

---

#### SUB-19: Optimize Sprite Sheet Loading
**Priority:** P2  
**Title:** `[PERF] Optimize sprite sheet image loading`  
**Affected Files:**
- `public/images/starter-set.png`
- Consider WebP format, lazy loading

---

#### SUB-20: Externalize Hardcoded URLs
**Priority:** P2  
**Title:** `[REFACTOR] Move hardcoded URLs to config file`  
**Affected Files:**
- `app/components/Footer.tsx:6-16`

---

#### SUB-21: Add ARIA Labels and Keyboard Navigation
**Priority:** P2  
**Title:** `[A11Y] Improve accessibility of character creator`  
**Affected Files:** All components

**Implementation:**
- Add `aria-label` to all buttons
- Add keyboard handlers (arrow keys for sprite selection)
- Add focus indicators
- Test with screen readers

---

#### SUB-22: Refactor UserDataManager to React Context
**Priority:** P2  
**Title:** `[REFACTOR] Replace singleton UserDataManager with React Context`  
**Affected Files:**
- `app/utils/userDataManager.ts`
- All components using UserDataManager

**Rationale:** Better React 18 compatibility, easier testing, clearer data flow.

---

#### SUB-23: Add Rate Limiting to IPFS Uploads
**Priority:** P2  
**Title:** `[SECURITY] Prevent spam uploads to Pinata`  
**Affected Files:**
- Future API route: `app/api/upload-avatar/route.ts`

**Implementation:**
- Client-side: Disable button for 5s after upload
- Server-side: Rate limit by IP/wallet address
- Add file size validation (max 5MB)

---

#### SUB-24: Enable and Fix TypeScript Strict Mode Violations
**Priority:** P2  
**Title:** `[TYPE] Fix implicit any types and enable stricter TypeScript`  
**Affected Files:**
- `tsconfig.json`
- `characterData.ts:10`
- `spriteMetadata.ts:22`

---

#### SUB-25: Create .env.example File
**Priority:** P2  
**Title:** `[DOCS] Add .env.example for contributor onboarding`  
**Content:**
```bash
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
# Server-side only (move IPFS to API routes first)
PINATA_JWT=your_pinata_jwt_here
PINATA_GATEWAY=your_pinata_gateway_here
```

---

#### SUB-26: Add Mobile Responsive Breakpoints
**Priority:** P2  
**Title:** `[UX] Make character creator mobile responsive (Issue #32)`  
**Affected Files:**
- `app/styles/character-creator.css`
- `app/globals.css`

**Implementation:** Add CSS media queries for tablet/mobile layouts

---

#### SUB-27: Link Avatar to Wallet Address Switching
**Priority:** P2  
**Title:** `[FEATURE] Save avatar config per wallet address (Issue #9)`  
**Affected Files:**
- `app/utils/userDataManager.ts`

**Implementation:**
```typescript
private getStorageKey(address: string): string {
    return `hom3town_user_${address}`;
}
```

---

#### SUB-28: Add Wallet Address Disconnect Handler
**Priority:** P2  
**Title:** `[FEATURE] Handle wallet disconnect and multi-wallet switching`  
**Affected Files:**
- `app/utils/userDataManager.ts`
- `app/dashboard/page.tsx`

**Implementation:** Listen to Account Kit disconnect events, clear user-specific data

---

## Security Considerations Summary

1. **JWT Exposure** (P0): Pinata credentials in client bundle
2. **No Rate Limiting** (P2): IPFS uploads can be spammed
3. **localStorage Security** (P1): Data not encrypted, vulnerable to XSS
4. **No Input Validation** (P2): User inputs not sanitized before storage
5. **Console Logging Sensitive Data** (P1): Addresses and configs logged

**Recommendation:** Conduct full security audit before mainnet deployment.

---

## Performance Considerations

1. **Sprite Sheet Size:** 94KB (acceptable)
2. **Unused Font:** Sour_Gummy loaded but not used (+50KB)
3. **No Code Splitting:** All components loaded upfront
4. **No Image Optimization:** CSS background-images bypass Next.js optimization

**Recommended:**
- Implement lazy loading for dashboard/creator routes
- Use Next.js `<Image>` for sprite sheet with proper sizing
- Remove unused fonts

---

## Testing Gaps

- **No test files found** in repository
- No CI/CD configuration
- No pre-commit hooks (ESLint/Prettier)

**Recommendation:** Set up basic testing infrastructure:
- Unit tests for utility functions (`characterData.ts`, `userDataManager.ts`)
- Integration tests for character creator flow
- E2E tests for critical paths (login → create → mint)

---

## Conclusion

Hom3Town-v3 demonstrates solid foundational architecture but requires attention to production readiness. The character customization system is well-structured, but several critical bugs (#1-5) must be fixed before deployment.

**Immediate Next Steps:**
1. Fix broken imports (SUB-01)
2. Fix image path mismatch (SUB-02)
3. Move IPFS logic server-side (SUB-03)
4. Implement proper error handling (SUB-07, SUB-11)
5. Add loading states (SUB-08)

**Estimated Effort:**
- P0 issues: 2-3 days
- P1 issues: 5-7 days
- P2 issues: 8-10 days
- **Total:** 15-20 days for comprehensive resolution

This audit provides a roadmap for improving code quality, security, and user experience before broader deployment or mainnet launch.

---

**Audit Conducted By:** Cloud Agent (Cursor AI)  
**Contact:** Reference Issue #40 for questions  
**Next Review:** After P0 + P1 fixes implemented