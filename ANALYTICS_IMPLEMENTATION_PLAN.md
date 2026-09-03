# Mouravi Analytics Implementation Plan

## Overview
Adding Firebase Analytics to track user journeys through the Mouravi calculator application with an admin-only analytics dashboard.

---

## FILES TO CREATE

### 1. `/src/utils/firebaseConfig.js`
- Initialize Firebase App
- Export Firebase Analytics instance
- Use environment variables for Firebase configuration
- Include error handling for when Analytics is unavailable

### 2. `/src/utils/analytics.js`
- Utility functions: `trackEvent()`, `trackPageView()`, `trackUserAction()`
- Safe wrapper around Firebase Analytics
- Fails gracefully if Analytics is unavailable
- All functions are no-ops if Analytics can't initialize

### 3. `/src/components/AnalyticsDashboard.jsx`
- Admin-only dashboard component
- Display metrics:
  - Total Visitors
  - Unique Visitors
  - Sessions
  - Calculations Started
  - Calculations Completed
  - Results Viewed
  - Conversion Rate
- User Journey funnel with conversion percentages
- Charts for:
  - Top Calculator Paths (მეცხოველეობა vs სახნავი და მემცენარეობა)
  - Top Regions
  - Top Animal Types
  - Device Breakdown (Desktop/Mobile/Tablet)
- Time filter (Today, Last 7 days, Last 30 days, All time)
- Admin authentication check

### 4. `/src/AnalyticsRouter.jsx`
- Main app router component
- Route handling:
  - `/` → Main Mouravi App
  - `/admin/analytics` → AnalyticsDashboard (admin-only, requires authentication)
- Simple admin guard (Firebase Authentication)

### 5. `/src/components/AdminAuthGuard.jsx`
- Protects the analytics dashboard
- Checks if user is authenticated as admin
- Shows login form if not authenticated

### 6. `/.env.local` (template - user fills in values)
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## FILES TO MODIFY

### 1. `/src/main.jsx`
- Import AnalyticsRouter instead of App directly
- Wrap with AnalyticsRouter component

### 2. `/src/App.jsx`
- Add tracking calls at key points:
  - `website_open` - on component mount
  - `calculator_started` - when user clicks path button
  - `path_selected` - when path is selected
  - `calculator_input_completed` - when form is filled
  - `calculation_completed` - when calculation is done
  - `results_viewed` - when results are displayed
  - `rotational_grazing_enabled` - when checkbox is toggled
  - `action_plan_opened` - when action plan is opened
  - `action_plan_cta_clicked` - when CTA buttons are clicked
  - `back_clicked` - when back button is clicked
  - `calculator_reset` - when reset/restart is clicked

---

## NPM PACKAGES TO INSTALL

```bash
npm install firebase
```

---

## FIREBASE CONSOLE SETUP

### 1. Enable Google Analytics for Firebase
- Go to Firebase Console
- Navigate to Analytics
- Enable Analytics if not already enabled
- Note your **Measurement ID** (looks like: G-XXXXXXXXXX)

### 2. Set Up Firebase Authentication
- Navigate to Authentication → Sign-in method
- Enable "Email/Password" provider
- Create an admin user account (you'll use this for /admin/analytics login)

### 3. Create Admin User
- In Firebase Authentication → Users tab
- Add a new user with your admin email and password
- This is the account you'll use to log into the analytics dashboard

### 4. Get Firebase Configuration
- Project Settings → Your apps → Copy your Firebase config:
  - API Key
  - Auth Domain
  - Project ID
  - Storage Bucket
  - Messaging Sender ID
  - App ID
  - Measurement ID

---

## IMPLEMENTATION STEPS

1. ✅ Install Firebase SDK
2. ✅ Create Firebase config file
3. ✅ Create analytics utility functions
4. ✅ Create admin auth guard component
5. ✅ Create analytics dashboard component
6. ✅ Create router component
7. ✅ Update main.jsx to use router
8. ✅ Update App.jsx to add tracking calls
9. ✅ Create .env.local template
10. ✅ Test analytics in development
11. ✅ Deploy to Firebase Hosting

---

## ACCESSING THE ANALYTICS DASHBOARD

### Development:
```
http://localhost:5173/admin/analytics
```

### Production (after deployment):
```
https://your-firebase-domain.web.app/admin/analytics
```

### Access:
1. Navigate to `/admin/analytics`
2. Log in with your admin Firebase account
3. Dashboard displays real-time analytics

---

## TRACKED EVENTS

### 1. website_open
- Fired when app first loads
- Tracks: timestamp, device info

### 2. calculator_started
- Fired when user clicks path button
- Parameters: path (livestock/arable)

### 3. path_selected
- Fired when path is confirmed
- Parameters: path (livestock/arable)

### 4. calculator_input_completed
- Fired when user completes form
- Parameters: path, region, area, condition, (animal or crop)

### 5. calculation_completed
- Fired after calculation
- Parameters: path, region, area, condition, (animal/crop), results

### 6. results_viewed
- Fired when results page is displayed
- Parameters: path, suitability/capacity

### 7. rotational_grazing_enabled
- Fired when rotational grazing toggle is used
- Parameters: enabled (true/false)

### 8. action_plan_opened
- Fired when user opens action plan

### 9. action_plan_cta_clicked
- Fired when user clicks CTA in action plan
- Parameters: action_type

### 10. back_clicked
- Fired when user navigates backwards
- Parameters: from_step, to_step

### 11. calculator_reset
- Fired when user starts over
- Parameters: none

---

## PRIVACY & COMPLIANCE

✅ No personal identifying information is collected
✅ No names, emails, passwords, or addresses
✅ No keystroke recording
✅ Anonymous user analytics via Firebase
✅ Complies with Firebase Analytics privacy requirements
✅ Users can disable analytics via browser settings

---

## SECURITY NOTES

⚠️ Admin route (`/admin/analytics`) requires Firebase Authentication
⚠️ Only users with admin email/password can access dashboard
⚠️ Measurement ID is publicly visible (standard practice)
⚠️ API Key is public in frontend code (Firebase Security Rules should restrict access)
⚠️ For production, configure Firebase Realtime Database or Firestore rules to restrict analytics read access

---

## DEPLOYMENT

### Firebase Deployment:
```bash
npm run build
firebase deploy
```

### What gets deployed:
- Updated React app with analytics
- Admin dashboard at /admin/analytics
- Analytics tracking events

---

## ROLLBACK (if needed)

If you need to disable analytics:
1. Comment out imports in main.jsx
2. Remove tracking calls from App.jsx
3. Analytics dashboard will still be accessible at /admin/analytics but won't show data
4. Redeploy: `firebase deploy`

---

## TESTING CHECKLIST

- [ ] Analytics events fire on calculator_started
- [ ] Analytics events fire on path_selected
- [ ] Analytics events fire on calculation_completed
- [ ] Admin dashboard loads at /admin/analytics
- [ ] Non-admin users can't access /admin/analytics
- [ ] Dashboard displays metrics correctly
- [ ] Time filter works
- [ ] Charts render without errors
- [ ] Application works even if Analytics is disabled

