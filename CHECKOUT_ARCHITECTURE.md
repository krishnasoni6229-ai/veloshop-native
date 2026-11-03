# Production Checkout Architecture

This document specifies how the production checkout journey functions in this React Native (Expo) architecture when connected to a live Shopify Plus store.

---

## 1. High-Level Architecture Overview

```mermaid
flowchart TD
    A[React Native App] -->|1. Cart Operations (GraphQL)| B[Shopify Storefront API]
    B -->|2. Returns cartId + checkoutUrl| A
    A -->|3. Attach Buyer Identity & Discounts| B
    A -->|4. Launch In-App Web Sheet (Shop Pay / Apple Pay)| C[Shopify Hosted Checkout / Web Sheet]
    C -->|5. Customer Authenticates & Completes Payment| D[Shopify Payment Gateway]
    D -->|6. Deep-link Return: veloshop://checkout/success| A
    D -->|7. Webhook: orders/create| E[Merchant Order Service]
    E -->|8. Push Notification| A
```

---

## 2. Step-by-Step Checkout Flow

### Step 1: Headless Cart Initialization & Mutation
* **GraphQL Operations**: All local cart state actions (`addToCart`, `updateQuantity`, `removeItem`) communicate with the **Shopify Storefront API v2025-01** using the `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, and `cartLinesRemove` mutations.
* **Session Persistence**: The `cart.id` (Shopify GID: `gid://shopify/Cart/...`) and the `cart` data are persisted locally via Zustand with `@react-native-async-storage/async-storage`.
* **Inventory Reservation & Validation**: Each mutation validates stock availability on Shopify's edge servers. If a variant goes out of stock, `userErrors` are caught by the data layer and surfaced gracefully to the user via the in-app `ErrorBanner`.

### Step 2: Buyer Identity & Discount Attachment
Before the user taps **"Proceed to Checkout"**, the application enriches the cart with buyer identity:
```graphql
mutation CartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
  cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
    cart {
      id
      checkoutUrl
      buyerIdentity {
        email
        phone
      }
    }
  }
}
```
* If the user is logged in, their Shopify Customer Access Token (`customerAccessToken`) is attached to `buyerIdentity`, automatically pre-filling saved addresses, loyalty rewards, and default payment methods.
* Any active promo or referral codes are validated via `cartDiscountCodesUpdate`.

### Step 3: Secure Web Checkout Handoff (Shop Pay & Native Biometrics)
Because native app in-app card forms require high-tier PCI-DSS Level 1 certification, modern Shopify architectures (including Gymshark's production app) hand off the payment step to **Shopify's Web Checkout sheet**:
1. **In-App Browser / Web Sheet**: The `checkoutUrl` returned by the Storefront API is opened using `expo-web-browser` or `react-native-webview`:
   ```ts
   import * as WebBrowser from 'expo-web-browser';

   await WebBrowser.openBrowserAsync(cart.checkoutUrl, {
     presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
     toolbarColor: '#000000',
     controlsColor: '#FFFFFF',
   });
   ```
2. **Accelerated Checkout**:
   - **Apple Pay**: On iOS devices, the web sheet invokes the Apple Pay sheet automatically via the Payment Request API.
   - **Google Pay**: On Android devices, Google Pay is presented natively.
   - **Shop Pay**: Registered Shop Pay buyers authenticate via SMS OTP or Face ID/Touch ID with 1-click checkout.

### Step 4: Post-Purchase Universal Linking & App Return
1. In Shopify Admin → **Settings → Checkout → Post-purchase Page**, the store is configured with an automated redirect URL:
   `veloshop://checkout/success?order_id={order_id}&cart_id={cart_id}`
2. The React Native app registers this custom scheme and universal link in `app.json` (`scheme: "veloshop"`).
3. When the customer completes payment, the browser redirects to the app scheme. Expo Router catches the link:
   - Dismisses the web browser sheet.
   - Clears the active cart state via `useCartStore.getState().clearCart()`.
   - Navigates the customer to an **Order Confirmation Screen** displaying the order number and estimated delivery date.

### Step 5: Webhook Reconciliation & Real-Time Notifications
1. Shopify fires an asynchronous `orders/create` or `orders/paid` webhook to the merchant backend.
2. The backend syncs the order to the ERP and generates a push notification payload via the **Expo Push Notification Service**.
3. The customer receives a native push notification: *"Your order #10842 is confirmed and being prepared for shipment!"*

---

## 3. Data Layer Isolation & Architectural Boundary

The codebase strictly enforces the separation of concerns:
* **API Client (`src/api/shopifyClient.ts`)**: Encapsulates all network I/O, GraphQL mutations, sample data mocking, and normalization logic.
* **Store Management (`src/store/cartStore.ts`)**: Zustand store orchestrating cart state and AsyncStorage persistence.
* **UI Components (`src/components/`, `app/`)**: Pure presentation layer consuming hooks (`useStore`, `useTheme`, `useCartStore`) with zero direct knowledge of network transports.
