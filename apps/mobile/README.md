# 🌾 AgriBandhu Mobile App

> **React Native & Expo mobile application for farmers, crop health monitoring, and smart field scheduling.**

The mobile app connects directly with the **AgriBandhu Express REST API** to provide farmers with a portable, offline-resilient toolkit directly in the field.

---

## 📱 Features

1. **🏡 Farmer Dashboard (`HomeScreen`)**
   - Active plot selector and crop variety badge.
   - Real-time microclimate sensors: ambient temperature, soil moisture percentage, wind speed, and UV index.
   - Growth timeline: Days since sowing, current growth stage (e.g., Tillering phase), and expected harvest countdown.
   - Daily field schedule checklist with one-tap completion tracking.

2. **🚜 Agricultural Lands & Plots (`FarmsScreen`)**
   - Manage multiple land holdings (Acres or Hectares).
   - Soil profile metrics: pH, Nitrogen (N), Phosphorus (P), Potassium (K), and organic carbon.
   - Interactive **Add Farm** registration modal form.

3. **🔬 AI Crop Doctor & Leaf Scanner (`DiseaseScanScreen`)**
   - Crop species selector: Wheat, Paddy/Rice, Tomato, Mustard, Cotton, Potato, Citrus.
   - Simulated camera viewfinder with automated pattern recognition.
   - Detailed pathology diagnostic report:
     - Disease identification with confidence percentage (e.g., 94.6%).
     - Severity classification (Mild, Moderate, Severe).
     - Step-by-step **Organic & Biological Remedies** (Neem oil, Trichoderma viride).
     - **Chemical Interventions** with precise dilution rates (Propiconazole, Mancozeb).
     - **Preventive farm practices**.

4. **📅 Agricultural Calendar & Schedule (`CalendarScreen`)**
   - Event categorization: Irrigation, Fertilizer top-dressing, Seeding, Harvesting, and AI Recommendations.
   - Priority filters: Critical, High, Medium, Low.
   - **One-Tap AI Schedule Generation**: Intelligently schedules future field tasks based on current crop and soil characteristics.

5. **👨‍🌾 Digital Kisan Identity & Connectivity (`ProfileScreen`)**
   - Verified Digital Farmer ID Card (Kisan ID).
   - Total land holding calculation across all plots.
   - Trilingual language selector: English, हिन्दी (Hindi), and ਪੰਜਾਬੀ (Punjabi).
   - Configurable API Base URL to toggle between `localhost:5000`, Android Emulator (`10.0.2.2:5000`), or Local LAN IP for testing on physical devices via Expo Go.

---

## 🚀 Running the Mobile App

From the monorepo root:

```bash
# Start the Metro bundler
pnpm --filter @agribandhu/mobile start
```

Or from the `apps/mobile` directory:

```bash
cd apps/mobile
npx expo start
```

### Options:
- **Scan QR Code**: Scan with the **Expo Go** app on your iOS or Android device.
- **Press `a`**: Open in an Android emulator.
- **Press `i`**: Open in an iOS simulator (macOS only).
- **Press `w`**: Open in a web browser.
