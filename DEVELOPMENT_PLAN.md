# WemyssWorkouts Development Plan

## Phase 1: Reliability and Structure
- [x] Add visible startup/error fallback instead of a black screen.
- [x] Make service worker app-shell files network-first so broken cached versions clear faster.
- [x] Use `components/components.js` as the single active component bundle.
- [x] Remove stale placeholder component files.
- [ ] Confirm GitHub Pages loads cleanly after deploy.

## Phase 2: Workout Logging
- [ ] Improve strength form validation and save feedback.
- [ ] Improve cardio form validation and save feedback.
- [ ] Confirm edit, delete, and duplicate flows for strength and cardio.
- [ ] Add history search and filters.

## Phase 3: Sync and Backup
- [ ] Make Google Sheets sync status clearer for success, partial success, and failure.
- [ ] Keep export/import backup easy to find and safe to use.
- [ ] Decide whether hydration should become a saved/synced data type or remain a calculator only.

## Phase 4: Mobile Install
- [ ] Confirm manifest fields, icons, and theme colors on iPhone and Android.
- [ ] Confirm offline mode after first load.
- [ ] Add short install instructions for iPhone and Android.