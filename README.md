# MAE Financial App

This is a Next.js application for MAE, a Mobile Finance Assistant.

## Getting Started

First, ensure you have Node.js and npm/yarn installed.

### Firebase Setup

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project (or use an existing one).
2.  In your Firebase project, go to Project Settings.
3.  Under the "General" tab, scroll down to "Your apps".
4.  Click on the Web icon (`</>`) to add a new web app.
5.  Register your app. You'll be given a `firebaseConfig` object.
6.  Create a `.env.local` file in the root of this project (next to `package.json`).
7.  Add your Firebase configuration to `.env.local` like this, replacing the placeholder values:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-app
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
    ```

8.  Enable Authentication: In the Firebase console, go to "Authentication" (under Build) and enable the "Email/Password" sign-in method.
9.  Set up Firestore: In the Firebase console, go to "Firestore Database" (under Build) and create a database. Start in **test mode** for easier development (you can secure it later with security rules).
    *   You'll need a `users` collection. Each document in this collection will have an ID equal to the Firebase Auth user's UID.
    *   Each user document should have fields like `name` (string), `email` (string), `balance` (number), `createdAt` (timestamp).
    *   Each user document can have a subcollection named `transactions`. Transaction documents can have fields like `type` ('incoming' or 'outgoing'), `amount` (number), `description` (string), `timestamp` (timestamp), `recipient` (string, optional).

### Genkit AI Setup (Optional - For Financial Tips)

If you plan to use the AI-powered financial tips:

1.  Ensure you have a Google AI API key. Refer to Genkit and Google AI documentation for setup.
2.  Set your Google AI API key in your environment (e.g., in `.env.local`):
    ```env
    GOOGLE_API_KEY=YOUR_GOOGLE_AI_API_KEY
    ```

### Running the Development Server

1.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

2.  Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

Open [http://localhost:9002](http://localhost:9002) (or the port specified in `package.json` scripts) with your browser to see the result.

## Key Features

*   User Authentication (Email/Password)
*   Balance and Transaction History Display
*   Money Transfers
*   QR Code Payments (Display and Simulated Scan)
*   AI-Powered Financial Tips (via Genkit)
*   PWA Ready (Manifest and Service Worker)

## Project Structure

*   `src/app/`: Next.js App Router pages and layouts.
*   `src/components/mae/`: Custom React components specific to the MAE app.
*   `src/components/ui/`: ShadCN UI components.
*   `src/lib/`: Utility functions, Firebase configuration.
*   `src/app/actions.ts`: Server Actions for backend logic.
*   `src/ai/`: Genkit AI flow configurations.
*   `public/`: Static assets, including PWA manifest, service worker, and icons.

## Customization

*   **Styling**: Modify `src/app/globals.css` and `tailwind.config.ts` for theme changes.
*   **Icons**: Replace placeholder icons in `public/icons/` with your actual app icons.
*   **Firebase Config**: Ensure your Firebase project details are correctly set up in `.env.local` and that `src/lib/firebase.ts` is correctly reading them.
*   **QR Code Functionality**: The QR code scanning is simulated by file upload. For a real mobile app, you would integrate a camera-based QR scanner.
```