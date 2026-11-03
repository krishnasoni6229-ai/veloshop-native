# Veloshop Native: Multi-Tenant Shopify Mobile Commerce Platform

> **Practical Assignment Submission: Shopify Store to Mobile App Platform**  
> Built with **React Native (Expo SDK 57)**, **Expo Router**, **Zustand**, and **TanStack Query**.

---

## 1. Executive Summary

Veloshop Native is a production-grade, white-label mobile commerce platform engineered to convert Shopify stores into branded, high-performance iOS and Android applications. 

The architecture solves the core challenge of multi-store support: **powering distinct brand identities and third-party app ecosystems from a single, unified codebase without maintaining separate code branches or rewriting screens**.

### Visual Reference
- **Gymshark (`gymshark`)**: High-contrast black & white athletic design, compact 4px border radius, sharp typography, Yotpo reviews enabled, Smile.io loyalty disabled.
- **Veloshop (`veloshop`)**: Energetic blue & orange sport cycling brand, modern 12px border radius, rounded pills, Smile.io loyalty rewards enabled (1,250 pts), Yotpo reviews disabled.

---

## 2. Key Architectural Features

- **Reusable Theme & Token System**: All components consume branding tokens dynamically (`primaryColor`, `secondaryColor`, `backgroundColor`, `textColor`, `cardColor`, `borderRadius`) via `useTheme()`.
- **4-Step Complete Shopping Journey**:
  1. *Welcome Screen*: Immersive hero visuals with Ken Burns animation and one-tap "Skip".
  2. *Home & Collection Screens*: Responsive hero banners, new release carousels, and grid/single toggle catalog views.
  3. *Product Details Screen*: Dynamic variant selection (Size, Colour, Rise), out-of-stock strike-throughs, and disabled states.
  4. *Shopping Bag Screen*: Real-time quantity adjustments, item removal, persistent state, subtotal/total summaries, and production checkout explanation modal.
- **Cart Persistence**: Cart state and Shopify GID persist across app restarts using Zustand with `AsyncStorage`.
- **Third-Party Integration Adapters**: Demonstrates both **Success State** and **Unavailable/Fallback State** (Yotpo Reviews & Smile.io Loyalty) through decoupled TypeScript adapter interfaces.
- **In-App Store Switcher**: Switch live between Gymshark and Veloshop under the **Account** tab to test instant reskinning and feature toggles with zero screen recompilation.
- **Separation of Concerns**: Strict boundary between presentation (`app/`, `src/components/`), business state (`src/store/`), configuration (`src/config/`), and network/data access (`src/api/`).

---

## 3. Quickstart & Setup Instructions

### Prerequisites
- Node.js 18+ (tested on Node v25.9.0)
- npm or bun
- Expo Go app on iOS/Android or Xcode / Android Studio simulator

### Installation

```bash
# 1. Clone repository & install dependencies
git clone <repo-url>
cd veloshop-native
npm install

# 2. Verify TypeScript type safety
npm run typecheck

# 3. Verify code style and linting
npm run lint

# 4. Start Expo development server
npx expo start
```

### Running on Devices & Emulators
- **iOS Simulator**: Press `i` in the Expo terminal.
- **Android Emulator**: Press `a` in the Expo terminal.
- **Physical Device**: Scan the QR code using the **Expo Go** app on iOS Camera or Android Expo Go.
- **Web Preview**: Press `w` in the Expo terminal or run `npm run web`.

---

## 4. Multi-Tenant Configuration

### Build-Time Selection
Set the target store via the `EXPO_PUBLIC_MERCHANT_ID` environment variable:
```bash
# Launch as Gymshark
EXPO_PUBLIC_MERCHANT_ID=gymshark npx expo start

# Launch as Veloshop
EXPO_PUBLIC_MERCHANT_ID=veloshop npx expo start
```

### Runtime Dynamic Switching
Navigate to the **Account** tab (`/(shop)/more`) in the running app to toggle between **Gymshark** and **Veloshop** instantly with live state updates.

---

## 5. Three-Minute Walkthrough Script

| Time | Segment | What to Show |
| :--- | :--- | :--- |
| **0:00 - 0:45** | **Welcome & Discovery Journey** | Launch app on Welcome screen → tap "Skip" → view Gymshark monochrome home feed → scroll through athletic hero banners, "New Releases" carousel, and recommended drops. |
| **0:45 - 1:30** | **Product Details & Variant Availability** | Open "SoftSense High-Rise Leggings" → switch colors and sizes → demonstrate available vs. sold-out variant (disabled button & alert) → add available size to bag. |
| **1:30 - 2:15** | **Cart Persistence & Production Checkout** | Navigate to Bag → adjust quantity (+ / −) → observe subtotal updates → reload the app to prove cart persistence → tap "Proceed to Checkout" to review the production checkout modal. |
| **2:15 - 3:00** | **Store Configuration Change & Integration Fallback** | Go to Account tab → tap "Veloshop" store switcher → app instantly switches to blue/orange theme, 12px border radius, and Veloshop products → reviews section shows unavailable fallback while Smile.io loyalty rewards display 1,250 active points. |

---

## 6. Submission Details

- **Platforms Actually Tested**:
  - **macOS / Node.js v25.9.0**: Local workspace compilation.
  - **TypeScript 6.0.3**: Strict typecheck verified (`npm run typecheck` passed with 0 errors).
  - **ESLint 9**: Verified (`npm run lint` passed with 0 errors).
  - **Expo Web / Metro Bundler**: Verified bundling.
- **AI Tools Used**: Google DeepMind Antigravity Coding Assistant.
- **One Issue Corrected**: Resolved TypeScript IDE error `TS17004` ("Cannot use JSX unless the '--jsx' flag is provided") and `TS6142` by explicitly defining `"jsx": "react-jsx"` in `tsconfig.json` compiler options, ensuring seamless IDE language server typechecking.
- **Time Spent**: ~4 hours (Architecture design, third-party ecosystem matrix, theme refactoring, cart persistence, verification).
- **Unfinished Items**: None required for prototype scope. (Live production checkout and Apple/Google merchant credentials deferred to merchant production deployment as specified in the assignment brief).

