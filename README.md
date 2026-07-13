# AuthApp — React Native Authentication

A React Native app built with **Expo SDK 57** that demonstrates a complete authentication flow using the **React Context API** for state management and **React Navigation** for screen transitions.

---

## Screen Recording Demonstration

**Video Demo:** https://drive.google.com/file/d/1n_nXWCoGUna0qsUpnmMkh0VsPCwkyR5j/view?usp=sharing

---

## Features

### Authentication
- **Sign Up** — Create an account with name, email, and password
- **Login** — Authenticate with email and password
- **Logout** — Clear session and return to the login screen
- **Persistent sessions** — Auth state is persisted with `AsyncStorage`; users remain logged in after closing and reopening the app

### Validation & Error Handling
| Screen | Validations |
|--------|-------------|
| Login | Required fields, valid email format, incorrect credentials error |
| Signup | Required fields, valid email format, password minimum 6 characters, duplicate email check |

### Bonus
- **Password visibility toggle** — Eye icon on both Login and Signup screens

### Navigation
- Stack-based navigation (React Navigation v7 native-stack)
- Automatic redirect to Home when logged in; Login screen when logged out

---

## Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | ~57.0.4 | Runtime & toolchain |
| `react-native` | 0.86 | Core framework |
| `@react-navigation/native` | ^7 | Navigation core |
| `@react-navigation/native-stack` | ^7 | Stack navigator |
| `react-native-screens` | 4.25.2 | Native screen containers |
| `react-native-safe-area-context` | ~5.7.0 | Safe area handling |
| `@react-native-async-storage/async-storage` | 2.2.0 | Auth persistence |

---

## Project Structure

```
AuthApp/
├── App.js                      # Root — NavigationContainer + AuthProvider
├── context/
│   └── AuthContext.js          # Auth state & logic (login, signup, logout)
├── screens/
│   ├── LoginScreen.js          # Login form with validation
│   ├── SignupScreen.js         # Signup form with validation
│   └── HomeScreen.js           # Logged-in dashboard
├── components/
│   └── TextInputField.js       # Reusable form input component
├── hooks/
│   └── useFormValidation.js    # Custom validation hook
├── constants/
│   └── config.js               # Colors, regex patterns, storage keys
├── assets/                     # App icons & images
├── app.json                    # Expo configuration
└── package.json
```

---

## Setup & Running

### Prerequisites
- [Node.js](https://nodejs.org/) 18+
- [Expo Go](https://expo.dev/go) on your iOS or Android device, **or** a simulator/emulator

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android) or press `i` for iOS simulator / `a` for Android emulator.

---

## How It Works

### Authentication Context (`context/AuthContext.js`)

The `AuthProvider` wraps the entire app and exposes:

| Value | Type | Description |
|-------|------|-------------|
| `user` | `{ name, email } \| null` | Currently logged-in user |
| `loading` | `boolean` | True while restoring session from AsyncStorage |
| `login(email, password)` | `async function` | Validates credentials against stored users |
| `signup(name, email, password)` | `async function` | Creates a new user and logs them in |
| `logout()` | `async function` | Clears session |

User records are stored in `AsyncStorage` under the key `users` (list). The active session is stored under `currentUser`.

### Navigation Flow

```
App starts
    │
    ├─ loading=true  →  Spinner
    │
    ├─ user=null     →  Stack: [Login, Signup]
    │
    └─ user≠null     →  Stack: [Home]
```

When `user` state changes (login/logout), React Navigation automatically swaps the navigator screens.

---

## Architecture & Code Quality

### Separation of Concerns
- **Context** — Handles all auth logic and state management
- **Screens** — Pure UI components that consume context
- **Hooks** — Reusable validation logic (`useFormValidation`)
- **Components** — Reusable form inputs (`TextInputField`)
- **Constants** — Centralized config (colors, validation rules, storage keys)

### Key Improvements
1. **Reusable Validation Hook** — Encapsulates all form validation rules; easily extendable for new fields
2. **TextInputField Component** — Eliminates code duplication (used in both Login & Signup)
3. **Constants File** — All colors and configs in one place; easy to theme or refactor
4. **Error Handling** — Proper error boundaries; graceful fallbacks when AsyncStorage fails
5. **Loading States** — Visual feedback during async operations (spinner on buttons)

---

## Data Storage

User data is stored locally using **AsyncStorage** (unencrypted key-value storage):

### `users` array
```javascript
// All registered accounts
[
  { name: "John Doe", email: "john@example.com", password: "password123" },
  { name: "Jane Smith", email: "jane@example.com", password: "secure456" }
]
```

### `currentUser` object
```javascript
// Currently logged-in user (password NOT stored)
{ name: "John Doe", email: "john@example.com" }
```

---

## Testing the App

### Quick Demo Flow
1. **Validation** — Tap "Sign Up" with empty fields → See all 3 error messages
2. **Invalid Inputs** — Enter invalid email/short password → See specific errors
3. **Successful Flow** — Complete signup → Auto-login → Home screen
4. **Wrong Credentials** — Try incorrect password → Error message displayed
5. **Persistence** — Close app → Reopen → Still logged in (session restored)

### Test Credentials
After signup with:
- Name: `John Doe`
- Email: `john@example.com`
- Password: `password123`

Log in anytime with same email/password.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find module" errors | Run `npm install` |
| AsyncStorage not persisting | Clear Expo cache: `expo start --clear` |
| Expo menu (gear icon) appears | Normal in dev mode; press X to close or disable "Fast Refresh" |
| App crashes on startup | Check terminal for errors; ensure Node 18+ is installed |

