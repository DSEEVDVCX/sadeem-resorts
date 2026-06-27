# Sadeem Resorts — Electronic Booking System

A single-page, responsive booking system designed for multiple resorts/chalets. It works seamlessly on both mobile devices and desktops.

## Features
- Image gallery for each resort
- Google Maps location integration
- Interactive calendar displaying available and booked dates
- Direct booking requests via WhatsApp (select resort, date, and send)
- Social media integration (Instagram, TikTok, WhatsApp)
- Fully responsive RTL (Right-to-Left) Arabic design
- **New:** Advanced UI with animations, PWA support, and an Admin Dashboard using localStorage.

## Project Structure
```text
index.html                  ← Main Landing Page (Hero, Units, Map)
unit-details.html           ← Unit specific details page
faq.html                    ← Frequently Asked Questions
cancellation-policy.html    ← Cancellation Policy rules
admin.html                  ← Admin Dashboard (Secured with password)
manifest.json               ← PWA Manifest
sw.js                       ← Service Worker for offline support
css/
  ├── style.css             ← Main stylesheet
  └── admin.css             ← Admin Dashboard styles
js/
  ├── data.js               ← Data & Settings (Reads from localStorage)
  ├── app.js                ← Main Logic (Calendar, WhatsApp, UI)
  ├── admin.js              ← Admin Dashboard Logic (CRUD)
  └── shared.js             ← Shared utilities across files
assets/images/              ← Resort images and logos
```

## Local Setup
To run the project locally, simply open `index.html` in your browser, or start a simple local server:
```powershell
python -m http.server 8000
```
Then visit: `http://localhost:8000`

## Live Deployment
The project is hosted via **GitHub Pages**.
Live Website: [https://dseevdvcx.github.io/sadeem-resorts/](https://dseevdvcx.github.io/sadeem-resorts/)

## Customization (No coding required)
To modify settings quickly:
- Open `js/data.js` to change WhatsApp numbers, brand name, social media links, and the default `UNITS` array (resort details, prices, features).
- To update the logo, replace `assets/images/logo.png` with your new logo image.

## Admin Dashboard
Access the `admin.html` page to manage your resorts directly from the browser.
- **Login:** The dashboard is protected by a password.
- **Features:** Update booked dates, change prices, edit resort descriptions, and manage social links.
- **Storage:** Data is saved locally in your browser using `localStorage`.

*Note: Since this relies on `localStorage`, your admin changes will only apply to the specific browser/device you are using. For cross-device syncing, a backend database (like Firebase or Supabase) would be required.*
