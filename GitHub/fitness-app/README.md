# WemyssWorkouts PWA

A modern, lightweight, and offline-first Progressive Web App (PWA) for tracking strength and cardio workouts, built for the 12-week recomp mesocycle for SGT Wemyss.

The UI is heavily inspired by Apple Fitness+, focusing on a clean, dark, and premium user experience with zero dependencies.

![WemyssWorkouts Screenshot](https://i.imgur.com/your-screenshot.png) <!-- TODO: Replace with an actual screenshot of the app -->

## ✨ Features

- **Modern UI/UX:** Clean, dark interface inspired by Apple Fitness+ with bold typography and vibrant accents.
- **Offline First:** Log workouts anytime, anywhere. The app saves all data locally to your device's browser storage (IndexedDB).
- **Google Sheets Sync:** Automatically backs up all session data to a personal Google Sheet when you're online.
- **Strength & Cardio Logging:** Dedicated forms for detailed strength sessions (sets, reps, weight, e1RM) and cardio (distance, time, HR, splits).
- **12-Week Plan:** Built-in mesocycle plan with weekly prescriptions and phase details.
- **Progress Tracking:** Visual charts for weekly volume, estimated 1RM trends, and body composition.
- **No Dependencies:** Built with vanilla JavaScript, Preact, and HTM. No build step required.
- **Installable (PWA):** Add to your phone's home screen for a native app-like experience.

## 🚀 Tech Stack

- **Frontend:** [Preact](https://preactjs.com/) with [HTM](https://github.com/developit/htm) (JSX-like syntax in template strings)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (via CDN for simplicity)
- **Local Storage:** IndexedDB for robust offline data persistence.
- **Service Worker:** Caches the app shell for instant loading and offline availability.
- **Backend Sync:** Google Apps Script for seamless integration with Google Sheets.

## 🛠️ Setup & Deployment

This app is designed for simple, serverless deployment.

1.  **Google Sheets:**
    - Create a new Google Sheet.
    - Open `Extensions > Apps Script` and paste the content of `apps-script.gs`.
    - Set your unique `API_KEY` in the script.
    - Deploy the script as a Web App, granting access to "Anyone".
    - Copy the Web App URL and your API Key.
2.  **Deployment:**
    - Drag and drop the entire project folder into Netlify.
    - Netlify provides a live URL in seconds.
3.  **App Configuration:**
    - Open the app and navigate to the `Sync` tab.
    - Paste your Google Apps Script URL and API Key to enable backups.