# Mohalla Kirana App - Comprehensive Use Cases & Functional Requirements

This document outlines all functional use cases across the four primary actor roles of the **Mohalla Kirana Platform**: **Homemaker (Customer)**, **Kirana Store Owner (Dukaan Owner)**, **Delivery Partner (Rider)**, and **Platform Administrator**.

---

## 1. Actor Roles & Definitions

| Role | Symbol | Description |
| :--- | :---: | :--- |
| **Homemaker** | 🏡 | Neighborhood resident ordering daily groceries, using Voice/Photo ordering, & managing monthly Khata. |
| **Store Owner** | 🏪 | Local Kirana shopkeeper accepting orders, managing inventory stock, & printing thermal receipts. |
| **Delivery Partner**| 🛵 | Neighborhood rider fulfilling hyper-local deliveries within Sarita Vihar geofence. |
| **Platform Admin** | 🛡️ | System administrator monitoring platform revenue, Supabase DB health, & idempotency logs. |

---

## 2. Homemaker (Customer) Use Cases

### UC-101: Customer Authentication & Registration
- **Actors**: Homemaker 🏡
- **Precondition**: Homemaker clicks "Sign In / Register" in Navbar or attempts to place an order without an active session.
- **Main Flow**:
  1. User selects **Sign In** or **Sign Up** tab in `CustomerAuthModal`.
  2. For **Sign Up**, user inputs Name, Phone, Email, House/Flat Number, Mohalla Address, and Password.
  3. System calls `supabase.auth.signUp()` creating a record in `auth.users` with `user_metadata`.
  4. System assigns default `customer` role entry in `public.user_roles` JOIN table.
  5. Session is stored locally in `localStorage` and Navbar updates to display authenticated user profile badge.
- **Alternative Flow**: If credentials exist during Sign In, `supabase.auth.signInWithPassword()` authenticates and loads user session.

### UC-102: Voice Note Grocery Ordering (Hinglish STT & NLP Parser)
- **Actors**: Homemaker 🏡
- **Precondition**: Customer opens Voice Note Modal.
- **Main Flow**:
  1. Customer selects Hinglish voice preset or speaks via microphone (Web Speech API).
  2. NLP Parser (`speechParser.ts`) parses Hinglish quantities ("do kg atta", "ek litre sarson tel", "teen packet parle-g").
  3. Matched catalog products appear in interactive review list with quantity controls.
  4. User clicks **"Direct Send to Kirana Store"**.
  5. System validates authentication (triggers UC-101 if unauthenticated) and inserts order into Supabase `orders` table.

### UC-103: Handwritten Photo List Scanning (Laser OCR Simulator)
- **Actors**: Homemaker 🏡
- **Precondition**: Customer opens Photo Scanner Modal.
- **Main Flow**:
  1. Customer uploads a paper grocery list photo or selects sample handwritten preset.
  2. Customer adjusts Canvas Brightness/Contrast filters.
  3. HTML5 Laser Scan Beam animates across image; OCR engine converts handwriting into catalog items.
  4. Customer confirms items and places order directly to Kirana Store.

### UC-104: Digital Khata Monthly Bill Credit & Payment Settlement
- **Actors**: Homemaker 🏡
- **Precondition**: Customer has an active Khata account.
- **Main Flow**:
  1. Customer views active balance (e.g. ₹230 / ₹5,000 credit limit).
  2. Customer selects **"Khata Credit"** during checkout to add purchase to monthly bill.
  3. System creates a `debit` entry in Supabase `khata_entries` table.
  4. Customer can settle dues via UPI. System creates a `credit` entry reducing total balance.

### UC-105: Instant UPI & Mobile Deep-Link Payment
- **Actors**: Homemaker 🏡
- **Precondition**: Customer selects "Live UPI / QR" at checkout.
- **Main Flow**:
  1. System generates dynamic QR code encoding `upi://pay?pa=guptakirana@upi&am=TOTAL`.
  2. Customer scans QR code with GPay, PhonePe, or Paytm.
  3. Alternatively on mobile, customer clicks **"Open GPay / PhonePe / Paytm"** button, triggering direct UPI app deep-linking.

---

## 3. Kirana Store Owner (Dukaan Owner) Use Cases

### UC-201: Live Order Fulfillment & Status Dispatching
- **Actors**: Kirana Store Owner 🏪
- **Main Flow**:
  1. Incoming orders appear instantly under **Pending Orders** tab with audio chime.
  2. Owner reviews items, customer phone, address, and payment mode (Khata vs UPI).
  3. Owner clicks **"Accept Order"** $\rightarrow$ Status changes to `accepted`.
  4. Owner clicks **"Dispatch Order"** $\rightarrow$ Status changes to `dispatched` & delivery rider assigned.
  5. Owner clicks **"Mark Delivered"** $\rightarrow$ Order completes & store revenue updates.

### UC-202: Thermal Receipt Printing Simulation
- **Actors**: Kirana Store Owner 🏪
- **Main Flow**:
  1. Owner clicks **"Print Receipt"** on any order card.
  2. Thermal Receipt Modal opens formatted for 58mm/80mm POS Bluetooth receipt printers.
  3. Displays store header, itemized breakdown, tax computation, and idempotency barcode.

### UC-203: Dynamic Kirana Store Profile Management
- **Actors**: Kirana Store Owner 🏪
- **Main Flow**:
  1. Owner clicks **"✏️ Edit Store Profile"** in Store Dashboard header.
  2. Owner updates Store Name, Owner Name, Mobile Phone, and Dukaan Address.
  3. Form submits and executes `supabase.from('stores').update(...)` live into PostgreSQL DB.

### UC-204: Low-Stock Inventory Management & Supplier Purchase Orders
- **Actors**: Kirana Store Owner 🏪
- **Main Flow**:
  1. Dashboard highlights products falling below `reorderLevel` (e.g. Besan stock = 4 kg).
  2. Owner adjusts stock quantities live using `+` / `-` controls.
  3. Owner clicks **"Generate FMCG Wholesaler Purchase Order"**, generating automated restock list sent to supplier.

---

## 4. Delivery Partner (Rider) Use Cases

### UC-301: Delivery Assignment & Route Optimization
- **Actors**: Delivery Partner 🛵
- **Main Flow**:
  1. Owner assigns available neighborhood delivery rider (e.g., Sonu Kumar - Rider #1).
  2. Order status transitions to `dispatched`.

### UC-302: Live HTML5 Canvas Delivery GPS Tracking Simulation
- **Actors**: Homemaker 🏡, Store Owner 🏪, Delivery Partner 🛵
- **Main Flow**:
  1. Customer or Owner clicks **"Live Track Delivery"**.
  2. Modal opens displaying interactive HTML5 Canvas Map of Sarita Vihar, Pocket B.
  3. Delivery rider icon animates live along GPS route from Store to Customer House.

---

## 5. Platform Administrator Use Cases

### UC-401: System Architecture & Idempotency Audit Log Monitoring
- **Actors**: Platform Admin 🛡️
- **Main Flow**:
  1. Admin switches view mode to **System Architecture** (`/admin`).
  2. Views real-time database connectivity, connected tables (`products`, `stores`, `orders`, `khata_entries`, `customers`, `roles`, `user_roles`), and active Edge Functions.
  3. Reviews live **Idempotency Protection Audit Log** tracking duplicate request filtering.

### UC-402: Admin Theme Manager & Brand Customizer
- **Actors**: Platform Admin 🛡️
- **Main Flow**:
  1. Admin opens **Theme Selector** sub-tab in Admin System Design View.
  2. Reviews visual theme cards for 6 themes (`Classic Dark Slate`, `Clean Light`, `Emerald Grocer`, `Midnight Sapphire`, `Sunset Ochre`, `Cyberpunk Neon`).
  3. Selects theme; application CSS `data-theme` attribute updates globally across all pages in real-time.
  4. Admin can click **"Save System Default"** or **"Copy Theme Tokens"**.

### UC-403: Role-Gated Admin Authentication & Protected Route Guard
- **Actors**: Platform Admin 🛡️
- **Main Flow**:
  1. Unauthenticated users see an **"Admin Login"** button in Navbar instead of privileged System Design controls.
  2. Clicking **"Admin Login"** triggers `CustomerAuthModal` targeting `admin` role.
  3. Direct navigation to `/admin` URL without admin privileges displays a protected guard card prompting for Admin Authentication.

### UC-404: HTML5 History Routing & Flow URL Synchronization
- **Actors**: Homemaker 🏡, Store Owner 🏪, Platform Admin 🛡️
- **Main Flow**:
  1. Navigating between views updates browser URL history (`/`, `/merchant`, `/admin`).
  2. Reloading or sharing direct route URLs opens the exact corresponding view mode.
