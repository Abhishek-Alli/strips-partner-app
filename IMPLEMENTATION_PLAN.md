# Implementation Plan

## Implementation Order
1. Unit Converter API (quick win, no dependencies)
2. Calculator/Budget Algorithm improvements (shared layer, offline)
3. Login - Social Auth (Google/Facebook OAuth)
4. Google Maps Integration
5. Real-time Chat (Socket.IO)

---

## FEATURE 1: Unit Converter API

### Backend - Create
- `backend/src/services/converter.service.js` — Pure math converter with Length (8 units), Area (8 units inc. gunta/bigha/cent), Weight (7 units), Volume (5 units), Temperature (celsius/fahrenheit/kelvin)
- Conversion method: `value * fromUnit.toBase / toUnit.toBase` (special handling for temperature)

### Backend - Modify
- `backend/src/controllers/utilities.controller.js` — Replace 501 stubs with real converter service calls

### Mobile - Modify
- `mobile/src/services/utilitiesService.ts` — Update interfaces for new converter shape
- `mobile/src/screens/utilities/ConvertersScreen.tsx` — Category tabs (length/area/weight/volume/temp), live conversion

---

## FEATURE 2: Calculator & Budget Algorithm Improvements

### Shared - Modify
- `shared/core/algorithms/construction/materialCalculator.ts` — Add: paint, tiles, flooring, electrical wiring, plumbing pipes, waterproofing calculators
- `shared/core/algorithms/budget/costConstants.ts` — Expand to 25+ Indian city multipliers, add labor cost rates, material rates by quality grade
- `shared/core/algorithms/budget/budgetEstimator.ts` — Add labor cost, detailed material breakdown in results

### Mobile - Modify
- `mobile/src/screens/calculators/ConstructionCalculatorScreen.tsx` — New collapsible sections for paint/tiles/electrical/plumbing
- `mobile/src/screens/calculators/BudgetEstimatorScreen.tsx` — City dropdown from constants, labor cost toggle, detailed breakdown

---

## FEATURE 3: Social Login (Google + Facebook)

### Packages needed
- `expo-auth-session` + `expo-crypto` (mobile)

### Backend - Create
- `backend/src/controllers/socialAuth.controller.js` — Verify Google idToken via `https://oauth2.googleapis.com/tokeninfo`, verify Facebook token via `https://graph.facebook.com/me`, look up or flag as new user
- `backend/src/routes/socialAuth.routes.js` — POST /social/google, POST /social/facebook

### Backend - Modify
- `backend/src/routes/auth.routes.js` — Mount social routes at /social/*

### Mobile - Modify
- `mobile/src/services/socialAuthService.ts` — Replace mock with real expo-auth-session OAuth flow
- `mobile/src/services/auth.service.ts` — Add `socialLogin(provider, token)` method
- `mobile/src/contexts/AuthContext.tsx` — Add `loginWithSocial()`
- `mobile/src/screens/auth/LoginScreen.tsx` — Wire social buttons to real flow

---

## FEATURE 4: Google Maps

### Packages needed
- `react-native-maps` (mobile)

### Backend - Create
- `backend/src/services/geocoding.service.js` — Google Geocoding API calls via Node https module
- `backend/src/controllers/location.controller.js` — geocode, reverseGeocode, nearbyDealers
- `backend/src/routes/location.routes.js` — POST /location/geocode, /reverse-geocode, GET /nearby-dealers

### Backend - Modify
- `backend/src/config/env.config.js` — Add GOOGLE_MAPS_API_KEY
- `backend/src/routes/index.js` — Mount location routes
- `backend/src/controllers/search.controller.js` — Haversine SQL for radius search

### Mobile - Create
- `mobile/src/components/map/LocationPicker.tsx` — Draggable marker + search bar, calls reverseGeocode
- `mobile/src/components/map/DealerMapView.tsx` — Multi-marker map with callout cards
- `mobile/src/services/locationService.ts` — Wraps backend location API

### Mobile - Modify
- `mobile/src/screens/search/DealerSearchScreen.tsx` — Wire map view mode to DealerMapView
- `mobile/src/screens/dealer/DealerManageProfileScreen.tsx` — Add "Set Business Location" with LocationPicker
- `mobile/app.json` — Add Google Maps API key config for iOS/Android

---

## FEATURE 5: Real-time Chat

### Packages needed
- `socket.io` (backend), `socket.io-client` (mobile)

### Backend - Create
- `backend/src/services/chat.service.js` — DB queries for conversations + messages (CRUD)
- `backend/src/controllers/chat.controller.js` — REST endpoints (getConversations, getMessages, sendMessage, createConversation, markRead)
- `backend/src/routes/chat.routes.js` — All behind authenticate middleware
- `backend/src/services/socket.service.js` — Socket.IO setup with JWT auth middleware, join rooms, send_message, typing, mark_read events

### Backend - Modify
- `backend/src/server.js` — Wrap app in http.createServer, pass to initializeSocket
- `backend/src/routes/index.js` — Mount chat routes

### Mobile - Create
- `mobile/src/services/chatService.ts` — REST API wrapper
- `mobile/src/services/socketService.ts` — Socket.IO client singleton
- `mobile/src/contexts/ChatContext.tsx` — Provides conversations/messages, real-time updates
- `mobile/src/screens/chat/ConversationListScreen.tsx` — List view with unread badges
- `mobile/src/screens/chat/ChatScreen.tsx` — Message bubbles, typing indicator, input bar

### Mobile - Modify
- `mobile/src/navigation/AppNavigator.tsx` — Register chat screens, wrap with ChatContext
