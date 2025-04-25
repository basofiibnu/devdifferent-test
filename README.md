
# 🗺️ Devdifferent - Map Task

A full-stack property management app built with [Next.js](https://nextjs.org), Supabase, and Google Maps API. This app enables users to create, view, filter, and manage property listings on an interactive map, with built-in authentication and image upload support.

---

## 🚀 Features

### 🔐 Authentication
- Email/password login
- Google OAuth login
- Signup via email and password

### 🏡 Property Management
- Add, update, and delete property listings
- Property fields: price, latitude, longitude, image
- Image upload via file input or image URL

### 🔍 Filtering & Search
- Filter properties by price
- Debounced input to reduce API calls

### 🗺️ Google Maps Integration
- Display properties as markers
- Clickable markers show property details
- Fully interactive map

### 🌙 Dark Mode
- Toggle between light and dark themes
- User preference saved in `localStorage`

### 🛠️ Supabase Integration
- Authentication & session management
- Image upload via Supabase Storage
- Property data stored in Supabase PostgreSQL
- Row-Level Security (RLS) for data protection

### ⚙️ State Management
- SWR for efficient data fetching & caching
- Context API for global state (`PropertiesContext`)

---

## 🧑‍💻 Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then, open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

You can start editing the app by modifying `src/app/page.tsx`. The page auto-updates as you make changes.

---

## 🧪 Environment Variables

Create a `.env.local` file in your root directory and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_BASE_PROD_URL=your-production-url
```

---

## 🗂️ Folder Structure

```
src/
├── app/                 # Next.js routing (App Router)
│   ├── auth/            # Signin, signup, callback pages
│   └── dashboard/       # Main dashboard with map and properties
├── components/          # Reusable UI components (Header, Map, etc.)
├── context/             # Global state (e.g. PropertiesContext)
├── lib/                 # Utility functions (e.g. supabase client)
├── types/               # TypeScript types (e.g. TProperty)
```

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js (Interactive)](https://nextjs.org/learn)
- [Supabase Docs](https://supabase.com/docs)
- [Google Maps Platform Docs](https://developers.google.com/maps)

---

## ▲ Deployment

Deploy effortlessly on [Vercel](https://vercel.com):

```bash
# Push your code to GitHub, then:
vercel deploy
```

Refer to the [Next.js deployment guide](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
