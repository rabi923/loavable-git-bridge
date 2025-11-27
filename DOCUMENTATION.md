# FoodBridge - Technical Documentation

> A geolocation-based food sharing platform connecting food givers with receivers to reduce food waste and address food insecurity.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Database Schema](#4-database-schema)
5. [Authentication System](#5-authentication-system)
6. [Core Features](#6-core-features)
7. [API Reference](#7-api-reference)
8. [Component Library](#8-component-library)
9. [Custom Hooks](#9-custom-hooks)
10. [Security Implementation](#10-security-implementation)
11. [Real-time Features](#11-real-time-features)
12. [Deployment Guide](#12-deployment-guide)
13. [Scaling Considerations](#13-scaling-considerations)
14. [Environment Variables](#14-environment-variables)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Project Overview

### 1.1 Purpose
FoodBridge is a community-driven platform designed to:
- Connect individuals/organizations with surplus food to those in need
- Reduce food waste through efficient redistribution
- Provide real-time communication between givers and receivers
- Use geolocation for proximity-based matching

### 1.2 User Roles
| Role | Description | Capabilities |
|------|-------------|--------------|
| `food_giver` | Individuals/businesses with surplus food | Create listings, view requests, chat with receivers |
| `food_receiver` | Individuals/organizations needing food | Create requests, browse listings, chat with givers |

### 1.3 Key Workflows

```
┌─────────────────────────────────────────────────────────────┐
│                    FOOD GIVER FLOW                          │
├─────────────────────────────────────────────────────────────┤
│  Sign Up → Create Listing → View Requests → Chat → Handoff │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   FOOD RECEIVER FLOW                        │
├─────────────────────────────────────────────────────────────┤
│  Sign Up → Browse Listings → Create Request → Chat → Pickup│
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI library |
| TypeScript | Latest | Type safety |
| Vite | Latest | Build tool & dev server |
| React Router DOM | 6.30.1 | Client-side routing |
| Tailwind CSS | Latest | Utility-first styling |
| Radix UI | Various | Accessible UI primitives |
| TanStack Query | 5.83.0 | Server state management |
| React Hook Form | 7.61.1 | Form handling |
| Zod | 3.25.76 | Schema validation |

### 2.2 Mapping & Geolocation

| Technology | Version | Purpose |
|------------|---------|---------|
| Leaflet | 1.9.4 | Interactive maps |
| React Leaflet | 4.2.1 | React wrapper for Leaflet |
| Geolib | 3.3.4 | Distance calculations |

### 2.3 Backend (Lovable Cloud/Supabase)

| Service | Purpose |
|---------|---------|
| PostgreSQL | Relational database |
| Supabase Auth | Authentication & authorization |
| Supabase Realtime | WebSocket-based real-time updates |
| Supabase Storage | File storage (food photos) |
| Row Level Security | Database-level access control |

### 2.4 Supporting Libraries

| Library | Purpose |
|---------|---------|
| date-fns | Date formatting & manipulation |
| Lucide React | Icon library |
| Sonner | Toast notifications |
| class-variance-authority | Component variants |

---

## 3. Project Structure

```
src/
├── components/
│   ├── ui/                    # Shadcn/Radix UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── Chat/
│   │   ├── ChatList.tsx       # Conversation list view
│   │   └── ChatWindow.tsx     # Individual chat interface
│   ├── Map/
│   │   ├── MapView.tsx        # Main map component
│   │   ├── FoodListPanel.tsx  # Food listings panel
│   │   ├── RequestListPanel.tsx # Requests panel
│   │   └── BottomNavigation.tsx # Mobile navigation
│   ├── AddFoodDialog.tsx      # Create food listing form
│   ├── AddRequestDialog.tsx   # Create request form
│   ├── AppHeader.tsx          # Application header
│   ├── FoodCard.tsx           # Food listing card
│   ├── RequestCard.tsx        # Request card
│   ├── MyListings.tsx         # User's listings view
│   └── MyRequests.tsx         # User's requests view
│
├── hooks/
│   ├── useAuthSession.ts      # Authentication state management
│   ├── useChat.ts             # Chat functionality
│   ├── useConversations.ts    # Conversation list management
│   ├── useMapData.ts          # Map data fetching
│   ├── useRealtimeMessages.ts # Real-time message subscription
│   ├── useUserLocation.ts     # GPS location tracking
│   ├── use-mobile.tsx         # Mobile detection
│   └── use-toast.ts           # Toast notifications
│
├── integrations/
│   └── supabase/
│       ├── client.ts          # Supabase client instance
│       └── types.ts           # Auto-generated TypeScript types
│
├── pages/
│   ├── Index.tsx              # Landing page
│   ├── Auth.tsx               # Login/Signup page
│   ├── GiverDashboard.tsx     # Food giver dashboard
│   ├── ReceiverDashboard.tsx  # Food receiver dashboard
│   ├── Profile.tsx            # User profile page
│   ├── Settings.tsx           # Settings page
│   └── NotFound.tsx           # 404 page
│
├── utils/
│   ├── distanceCalculator.ts  # Distance calculation utilities
│   ├── geolocation.ts         # Geolocation utilities
│   └── imageCompression.ts    # Image compression utilities
│
├── lib/
│   └── utils.ts               # General utility functions (cn, etc.)
│
├── App.tsx                    # Root component with routing
├── App.css                    # Global styles
├── index.css                  # Tailwind directives & CSS variables
└── main.tsx                   # Application entry point

supabase/
├── config.toml                # Supabase configuration
├── migrations/                # Database migrations
│   ├── 20251012163019_*.sql   # Initial schema
│   └── 20251017145435_*.sql   # Profile policies
└── functions/                 # Edge functions (if any)

public/
├── favicon.ico
├── robots.txt
└── placeholder.svg
```

---

## 4. Database Schema

### 4.1 Entity Relationship Diagram

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│     profiles     │     │  food_listings   │     │  food_requests   │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│ id (PK)          │◄────│ giver_id (FK)    │     │ id (PK)          │
│ role             │     │ id (PK)          │     │ receiver_id (FK) │────►│
│ full_name        │     │ title            │     │ food_preference  │
│ phone            │     │ description      │     │ people_count     │
│ location         │     │ quantity         │     │ needed_by        │
│ organization_name│     │ photo_url        │     │ location_address │
│ profile_picture  │     │ image_urls[]     │     │ latitude         │
│ bio              │     │ location         │     │ longitude        │
│ created_at       │     │ latitude         │     │ urgency_level    │
└──────────────────┘     │ longitude        │     │ delivery_pref    │
         │               │ pickup_time      │     │ organization_name│
         │               │ food_type        │     │ notes            │
         │               │ is_available     │     │ status           │
         │               │ view_count       │     │ created_at       │
         │               │ created_at       │     │ updated_at       │
         │               │ updated_at       │     └──────────────────┘
         │               └──────────────────┘
         │
         │     ┌──────────────────┐     ┌──────────────────┐
         │     │  conversations   │     │    messages      │
         │     ├──────────────────┤     ├──────────────────┤
         └────►│ user1_id (FK)    │     │ id (PK)          │
         └────►│ user2_id (FK)    │◄────│ conversation_id  │
               │ id (PK)          │     │ sender_id (FK)   │────►│
               │ last_message_at  │     │ message_text     │
               │ created_at       │     │ read_at          │
               └──────────────────┘     │ created_at       │
                                        └──────────────────┘
```

### 4.2 Table Definitions

#### profiles
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,              -- 'food_giver' | 'food_receiver'
  full_name TEXT,
  phone TEXT,
  location TEXT,
  profile_picture_url TEXT,
  organization_name TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### food_listings
```sql
CREATE TABLE public.food_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  giver_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  quantity TEXT NOT NULL,
  photo_url TEXT,
  image_urls TEXT[],
  location TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  pickup_time TIMESTAMPTZ NOT NULL,
  food_type TEXT,
  is_available BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### food_requests
```sql
CREATE TABLE public.food_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receiver_id UUID NOT NULL REFERENCES profiles(id),
  food_preference TEXT NOT NULL,
  people_count INTEGER NOT NULL,
  needed_by TIMESTAMPTZ NOT NULL,
  location_address TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  urgency_level TEXT NOT NULL,          -- 'low' | 'medium' | 'high' | 'critical'
  delivery_preference TEXT DEFAULT 'pickup',
  organization_name TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active',         -- 'active' | 'fulfilled' | 'expired'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### conversations
```sql
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES profiles(id),
  user2_id UUID NOT NULL REFERENCES profiles(id),
  last_message_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user1_id, user2_id)            -- Ensures one conversation per user pair
);
```

#### messages
```sql
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  sender_id UUID NOT NULL REFERENCES profiles(id),
  message_text TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.3 Enums

```sql
CREATE TYPE public.user_role AS ENUM ('food_giver', 'food_receiver');
```

### 4.4 Indexes

```sql
-- Food requests geospatial queries
CREATE INDEX idx_food_requests_location ON food_requests(latitude, longitude);
CREATE INDEX idx_food_requests_status ON food_requests(status);

-- Messages performance
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_unread ON messages(conversation_id, sender_id, read_at);
```

---

## 5. Authentication System

### 5.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SIGNUP FLOW                                   │
├─────────────────────────────────────────────────────────────────────┤
│  1. User enters email, password, full_name, role                    │
│  2. supabase.auth.signUp() creates auth.users entry                 │
│  3. Database trigger handle_new_user() fires                        │
│  4. Trigger creates profiles entry with user metadata               │
│  5. User redirected to role-specific dashboard                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        LOGIN FLOW                                    │
├─────────────────────────────────────────────────────────────────────┤
│  1. User enters email, password                                     │
│  2. supabase.auth.signInWithPassword() validates credentials        │
│  3. JWT token returned and stored in localStorage                   │
│  4. Profile fetched from profiles table                             │
│  5. User redirected based on profile.role                           │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 User Signup Trigger

```sql
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    new.id,
    (new.raw_user_meta_data->>'role')::user_role,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### 5.3 Session Management Hook

```typescript
// src/hooks/useAuthSession.ts
export const useAuthSession = (expectedRole?: string) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // 2. THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Returns: { session, user, profile, loading, signOut }
};
```

---

## 6. Core Features

### 6.1 Food Listings

**Create Listing:**
```typescript
const createListing = async (data: FoodListingInput) => {
  // 1. Compress images client-side
  const compressedImages = await compressImages(data.images);
  
  // 2. Upload to Supabase Storage
  const imageUrls = await uploadImages(compressedImages, 'food-photos');
  
  // 3. Insert listing record
  const { data: listing, error } = await supabase
    .from('food_listings')
    .insert({
      giver_id: userId,
      title: data.title,
      description: data.description,
      quantity: data.quantity,
      image_urls: imageUrls,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      pickup_time: data.pickupTime,
      food_type: data.foodType
    })
    .select()
    .single();
};
```

**Query Listings:**
```typescript
const fetchListings = async () => {
  const { data, error } = await supabase
    .from('food_listings')
    .select(`
      *,
      profiles:giver_id (
        full_name,
        organization_name,
        profile_picture_url
      )
    `)
    .eq('is_available', true)
    .order('created_at', { ascending: false });
};
```

### 6.2 Food Requests

**Create Request:**
```typescript
const createRequest = async (data: FoodRequestInput) => {
  const { data: request, error } = await supabase
    .from('food_requests')
    .insert({
      receiver_id: userId,
      food_preference: data.foodPreference,
      people_count: data.peopleCount,
      needed_by: data.neededBy,
      location_address: data.locationAddress,
      latitude: data.latitude,
      longitude: data.longitude,
      urgency_level: data.urgencyLevel,
      delivery_preference: data.deliveryPreference,
      organization_name: data.organizationName,
      notes: data.notes
    })
    .select()
    .single();
};
```

### 6.3 Messaging System

**Get or Create Conversation:**
```typescript
const startConversation = async (otherUserId: string) => {
  const { data: conversationId, error } = await supabase
    .rpc('get_or_create_conversation', { other_user_id: otherUserId });
  return conversationId;
};
```

**Send Message:**
```typescript
const sendMessage = async (conversationId: string, text: string) => {
  const { error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      message_text: text
    });

  // Update conversation timestamp
  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);
};
```

### 6.4 Geolocation

**Get User Location:**
```typescript
// src/hooks/useUserLocation.ts
export const useUserLocation = () => {
  const [location, setLocation] = useState<LocationCoords | null>(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => console.error('Geolocation error:', error),
      { enableHighAccuracy: true, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return location;
};
```

**Calculate Distance:**
```typescript
// src/utils/distanceCalculator.ts
import { getDistance } from 'geolib';

export const calculateDistance = (
  point1: { latitude: number; longitude: number },
  point2: { latitude: number; longitude: number }
): number => {
  return getDistance(point1, point2) / 1000; // Returns km
};
```

---

## 7. API Reference

### 7.1 Database Functions (RPC)

#### get_or_create_conversation
```sql
-- Returns existing conversation ID or creates new one
SELECT get_or_create_conversation('other-user-uuid');
-- Returns: UUID
```

#### get_user_conversations_with_details
```sql
-- Returns all conversations for a user with metadata
SELECT * FROM get_user_conversations_with_details('user-uuid');
-- Returns: id, other_user_id, other_user_name, other_user_avatar,
--          last_message_text, last_message_at, unread_count
```

#### mark_messages_as_read
```sql
-- Marks all unread messages in conversation as read
SELECT mark_messages_as_read('conversation-uuid');
```

#### expire_old_requests
```sql
-- Expires requests past their needed_by date
SELECT expire_old_requests();
```

### 7.2 Storage Buckets

| Bucket | Public | Purpose |
|--------|--------|---------|
| `food-photos` | Yes | Food listing images |

**Upload Example:**
```typescript
const uploadImage = async (file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from('food-photos')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  const { data: { publicUrl } } = supabase.storage
    .from('food-photos')
    .getPublicUrl(path);
  
  return publicUrl;
};
```

---

## 8. Component Library

### 8.1 UI Components (Shadcn/Radix)

| Component | File | Usage |
|-----------|------|-------|
| Button | `ui/button.tsx` | Primary actions, navigation |
| Card | `ui/card.tsx` | Content containers |
| Dialog | `ui/dialog.tsx` | Modals for forms |
| Input | `ui/input.tsx` | Text inputs |
| Select | `ui/select.tsx` | Dropdown selections |
| Textarea | `ui/textarea.tsx` | Multi-line text |
| Toast | `ui/toast.tsx` | Notifications |
| Avatar | `ui/avatar.tsx` | User profile images |
| Badge | `ui/badge.tsx` | Status indicators |
| Tabs | `ui/tabs.tsx` | Tab navigation |

### 8.2 Custom Components

#### MapView
```typescript
// src/components/Map/MapView.tsx
interface MapViewProps {
  userLocation: LocationCoords | null;
  data: MapDataItem[];
  userRole: 'food_giver' | 'food_receiver';
  onStartChat: (userId: string) => void;
}
```

#### FoodCard
```typescript
// src/components/FoodCard.tsx
interface FoodCardProps {
  listing: FoodListing;
  userLocation?: LocationCoords;
  onStartChat: (giverId: string) => void;
}
```

#### RequestCard
```typescript
// src/components/RequestCard.tsx
interface RequestCardProps {
  request: FoodRequest;
  userLocation?: LocationCoords;
  onStartChat: (receiverId: string) => void;
}
```

#### ChatWindow
```typescript
// src/components/Chat/ChatWindow.tsx
interface ChatWindowProps {
  otherUserId: string;
  otherUserName?: string;
  onBack: () => void;
}
```

---

## 9. Custom Hooks

### 9.1 useAuthSession
```typescript
const { session, user, profile, loading, signOut } = useAuthSession('food_giver');
```
- Manages authentication state
- Fetches user profile
- Handles role-based redirects
- Provides sign out functionality

### 9.2 useMapData
```typescript
const { data, loading, error, refetch } = useMapData(userRole, userLocation);
```
- Fetches listings or requests based on role
- Enriches data with profile information
- Auto-refetches when location changes

### 9.3 useUserLocation
```typescript
const location = useUserLocation();
// Returns: { latitude: number, longitude: number } | null
```
- Tracks user's GPS position
- Uses watchPosition for continuous updates
- Handles permission errors gracefully

### 9.4 useChat
```typescript
const { conversationId, currentUserId, loading, sendMessage, refetch } = useChat(otherUserId);
```
- Manages conversation state
- Creates conversations on-demand
- Provides message sending functionality

### 9.5 useRealtimeMessages
```typescript
const { messages, loading } = useRealtimeMessages(conversationId);
```
- Fetches message history
- Subscribes to real-time updates
- Handles read receipts

### 9.6 useConversations
```typescript
const { conversations, loading, user } = useConversations();
```
- Fetches all user conversations
- Subscribes to new message notifications
- Returns enriched conversation details

---

## 10. Security Implementation

### 10.1 Row Level Security (RLS) Policies

#### profiles
```sql
-- Anyone can view public profile info
CREATE POLICY "Anyone can view public profile info"
ON profiles FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

#### food_listings
```sql
-- Anyone can view available listings
CREATE POLICY "Anyone can view available food listings"
ON food_listings FOR SELECT USING (is_available = true);

-- Givers can view their own listings
CREATE POLICY "Food givers can view their own listings"
ON food_listings FOR SELECT USING (auth.uid() = giver_id);

-- Givers can create listings
CREATE POLICY "Food givers can create listings"
ON food_listings FOR INSERT WITH CHECK (auth.uid() = giver_id);

-- Givers can update their own listings
CREATE POLICY "Food givers can update their own listings"
ON food_listings FOR UPDATE USING (auth.uid() = giver_id);

-- Givers can delete their own listings
CREATE POLICY "Food givers can delete their own listings"
ON food_listings FOR DELETE USING (auth.uid() = giver_id);
```

#### food_requests
```sql
-- Anyone can view active requests
CREATE POLICY "Anyone can view active requests"
ON food_requests FOR SELECT
USING (status = 'active' AND needed_by > now());

-- Receivers can view their own requests
CREATE POLICY "Receivers can view their own requests"
ON food_requests FOR SELECT USING (auth.uid() = receiver_id);

-- Receivers can create requests
CREATE POLICY "Receivers can create requests"
ON food_requests FOR INSERT WITH CHECK (auth.uid() = receiver_id);

-- Receivers can update their own requests
CREATE POLICY "Receivers can update their own requests"
ON food_requests FOR UPDATE USING (auth.uid() = receiver_id);

-- Receivers can delete their own requests
CREATE POLICY "Receivers can delete their own requests"
ON food_requests FOR DELETE USING (auth.uid() = receiver_id);
```

#### conversations
```sql
-- Users can view their own conversations
CREATE POLICY "Users can view their own conversations"
ON conversations FOR SELECT
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Users can create conversations
CREATE POLICY "Users can create conversations"
ON conversations FOR INSERT
WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Users can update their conversations
CREATE POLICY "Users can update their conversations"
ON conversations FOR UPDATE
USING (auth.uid() = user1_id OR auth.uid() = user2_id);
```

#### messages
```sql
-- Users can view messages in their conversations
CREATE POLICY "Users can view messages in their conversations"
ON messages FOR SELECT
USING (EXISTS (
  SELECT 1 FROM conversations
  WHERE conversations.id = messages.conversation_id
  AND (auth.uid() = conversations.user1_id OR auth.uid() = conversations.user2_id)
));

-- Users can send messages
CREATE POLICY "Users can send messages"
ON messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Users can update their own messages
CREATE POLICY "Users can update their own messages"
ON messages FOR UPDATE USING (auth.uid() = sender_id);
```

### 10.2 Storage Policies

```sql
-- Anyone can view food photos (public bucket)
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'food-photos');

-- Authenticated users can upload photos
CREATE POLICY "Users can upload food photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'food-photos' AND auth.role() = 'authenticated');

-- Users can update their own photos
CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'food-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own photos
CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'food-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 10.3 Security Best Practices

1. **Input Validation**: All forms use Zod schemas for validation
2. **SQL Injection**: Prevented by Supabase client parameterization
3. **XSS Prevention**: React's JSX escaping + content sanitization
4. **CSRF Protection**: Built into Supabase authentication
5. **Secure Functions**: Database functions use `SECURITY DEFINER` with restricted `search_path`

---

## 11. Real-time Features

### 11.1 Message Subscriptions

```typescript
// src/hooks/useRealtimeMessages.ts
useEffect(() => {
  if (!conversationId) return;

  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
        // Mark as read if from other user
        if (payload.new.sender_id !== currentUserId) {
          supabase.rpc('mark_messages_as_read', { p_conversation_id: conversationId });
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => {
        setMessages(prev => 
          prev.map(msg => msg.id === payload.new.id ? payload.new as Message : msg)
        );
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [conversationId]);
```

### 11.2 Conversation List Updates

```typescript
// src/hooks/useConversations.ts
useEffect(() => {
  const channel = supabase
    .channel('conversations-updates')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      },
      () => {
        // Refetch conversations when new message arrives
        fetchConversations();
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, []);
```

### 11.3 Enabling Realtime on Tables

```sql
-- Already enabled in initial migration
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
```

---

## 12. Deployment Guide

### 12.1 Prerequisites

- Lovable account
- Project connected to Lovable Cloud

### 12.2 Environment Configuration

The following variables are automatically configured:

```env
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=[anon-key]
VITE_SUPABASE_PROJECT_ID=[project-id]
```

### 12.3 Deployment Steps

1. **Frontend Deployment**
   - Click "Publish" in Lovable interface
   - Click "Update" to deploy frontend changes
   - Frontend is deployed to `[project].lovable.app`

2. **Backend Deployment**
   - Database migrations deploy automatically
   - Edge functions deploy automatically
   - No manual steps required

### 12.4 Custom Domain Setup

1. Navigate to Project > Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL is automatically provisioned

### 12.5 Post-Deployment Checklist

- [ ] Verify authentication flow works
- [ ] Test food listing creation
- [ ] Test food request creation
- [ ] Verify real-time messaging
- [ ] Test geolocation features
- [ ] Verify image uploads
- [ ] Check RLS policies are enforced

---

## 13. Scaling Considerations

### 13.1 Database Optimization

**Current Indexes:**
```sql
-- Add indexes for common queries
CREATE INDEX idx_food_listings_giver ON food_listings(giver_id);
CREATE INDEX idx_food_listings_available ON food_listings(is_available, created_at);
CREATE INDEX idx_food_requests_receiver ON food_requests(receiver_id);
CREATE INDEX idx_food_requests_status_date ON food_requests(status, needed_by);
CREATE INDEX idx_messages_created ON messages(conversation_id, created_at);
```

**Recommended for Scale:**
```sql
-- Geospatial index for location queries
CREATE EXTENSION IF NOT EXISTS postgis;
ALTER TABLE food_listings ADD COLUMN geom geometry(Point, 4326);
CREATE INDEX idx_food_listings_geom ON food_listings USING GIST(geom);

-- Partial indexes for hot queries
CREATE INDEX idx_active_requests ON food_requests(needed_by)
WHERE status = 'active';

CREATE INDEX idx_available_listings ON food_listings(created_at DESC)
WHERE is_available = true;
```

### 13.2 Caching Strategy

**TanStack Query Configuration:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes
      gcTime: 30 * 60 * 1000,          // 30 minutes  
      refetchOnWindowFocus: false,
      retry: 2
    }
  }
});
```

**Recommended Cache Keys:**
```typescript
// Listings cache
queryKey: ['food-listings', { location, radius }]

// Requests cache
queryKey: ['food-requests', { location, radius }]

// Conversations cache
queryKey: ['conversations', userId]

// Messages cache
queryKey: ['messages', conversationId]
```

### 13.3 Image Optimization

**Current Implementation:**
```typescript
// src/utils/imageCompression.ts
export const compressImage = async (file: File): Promise<Blob> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };
  return await imageCompression(file, options);
};
```

**Recommended Enhancements:**
- Implement WebP conversion for modern browsers
- Add progressive loading with blur placeholders
- Use Supabase Image Transformation for on-the-fly resizing

### 13.4 Real-time Optimization

**Connection Management:**
```typescript
// Singleton channel management
const channelManager = {
  channels: new Map(),
  
  getOrCreate(name: string, config: ChannelConfig) {
    if (!this.channels.has(name)) {
      this.channels.set(name, supabase.channel(name));
    }
    return this.channels.get(name);
  },
  
  remove(name: string) {
    const channel = this.channels.get(name);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(name);
    }
  }
};
```

### 13.5 Performance Monitoring

**Recommended Metrics:**
- Database query latency
- Real-time message delivery time
- Image upload/load times
- Authentication latency
- Geolocation API response time

### 13.6 Horizontal Scaling

| Component | Scaling Method |
|-----------|---------------|
| Frontend | CDN (automatic via Lovable) |
| Database | Lovable Cloud handles automatically |
| Storage | S3-compatible (auto-scales) |
| Realtime | WebSocket connection pooling |
| Edge Functions | Serverless (auto-scales) |

---

## 14. Environment Variables

### 14.1 Required Variables (Auto-configured)

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID |

### 14.2 Accessing in Code

```typescript
// Frontend (Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Edge Functions (Deno)
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
```

### 14.3 Adding Custom Secrets

For edge functions requiring external API keys:
1. Use Lovable's secrets management tool
2. Secrets are encrypted and stored securely
3. Available in edge functions via `Deno.env.get()`

---

## 15. Troubleshooting

### 15.1 Common Issues

#### Authentication Errors

**Issue:** "User not found" after signup
```typescript
// Solution: Ensure trigger is working
// Check auth.users has entry
// Check profiles table has matching entry
SELECT * FROM auth.users WHERE email = 'user@example.com';
SELECT * FROM profiles WHERE id = 'user-uuid';
```

**Issue:** Session lost on page refresh
```typescript
// Solution: Ensure correct auth initialization order
// 1. Set up listener FIRST
supabase.auth.onAuthStateChange(callback);
// 2. THEN check existing session
supabase.auth.getSession();
```

#### RLS Policy Errors

**Issue:** "new row violates row-level security policy"
```typescript
// Solution: Ensure user_id matches auth.uid()
const { error } = await supabase
  .from('food_listings')
  .insert({
    giver_id: user.id,  // Must match authenticated user
    // ...
  });
```

#### Real-time Not Working

**Issue:** Messages not appearing in real-time
```sql
-- Solution: Verify table is in publication
SELECT * FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Add if missing
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

#### Geolocation Errors

**Issue:** Location permission denied
```typescript
// Solution: Handle permission errors gracefully
navigator.geolocation.getCurrentPosition(
  success,
  (error) => {
    if (error.code === error.PERMISSION_DENIED) {
      toast.error('Please enable location access in your browser settings');
    }
  }
);
```

#### Image Upload Failures

**Issue:** "new row violates row-level security" on storage
```sql
-- Solution: Check storage policies
SELECT * FROM storage.policies WHERE bucket_id = 'food-photos';

-- Ensure authenticated users can upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'food-photos' AND auth.role() = 'authenticated');
```

### 15.2 Debugging Tools

**Console Logs:**
- Authentication state changes
- Real-time subscription events
- API request/response data

**Network Tab:**
- Supabase API calls
- WebSocket connections
- Storage uploads

**Supabase Logs:**
- Database query logs
- Auth logs
- Edge function logs

### 15.3 Support Resources

- Lovable Documentation: https://docs.lovable.dev
- Supabase Documentation: https://supabase.com/docs
- Community Discord: https://discord.gg/lovable

---

## Appendix A: File Reference

### A.1 Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root component, routing |
| `src/pages/Auth.tsx` | Authentication page |
| `src/pages/GiverDashboard.tsx` | Food giver interface |
| `src/pages/ReceiverDashboard.tsx` | Food receiver interface |
| `src/hooks/useAuthSession.ts` | Auth state management |
| `src/hooks/useMapData.ts` | Map data fetching |
| `src/hooks/useRealtimeMessages.ts` | Real-time messaging |
| `src/components/Map/MapView.tsx` | Interactive map |
| `src/components/Chat/ChatWindow.tsx` | Chat interface |
| `src/index.css` | Design system tokens |
| `tailwind.config.ts` | Tailwind configuration |

### A.2 Database Migrations

| Migration | Purpose |
|-----------|---------|
| `20251012163019_*.sql` | Initial schema: profiles, listings, requests, messaging |
| `20251017145435_*.sql` | Profile viewing policy for authenticated users |

---

## Appendix B: API Quick Reference

### B.1 Supabase Client Methods

```typescript
// Auth
supabase.auth.signUp({ email, password, options })
supabase.auth.signInWithPassword({ email, password })
supabase.auth.signOut()
supabase.auth.getSession()
supabase.auth.onAuthStateChange(callback)

// Database
supabase.from('table').select('*')
supabase.from('table').insert({})
supabase.from('table').update({}).eq('id', value)
supabase.from('table').delete().eq('id', value)
supabase.rpc('function_name', { params })

// Storage
supabase.storage.from('bucket').upload(path, file)
supabase.storage.from('bucket').getPublicUrl(path)
supabase.storage.from('bucket').remove([paths])

// Realtime
supabase.channel('name').on('postgres_changes', config, callback).subscribe()
supabase.removeChannel(channel)
```

### B.2 Custom RPC Functions

```typescript
// Get or create conversation
await supabase.rpc('get_or_create_conversation', { other_user_id: uuid })

// Get user conversations with details
await supabase.rpc('get_user_conversations_with_details', { p_user_id: uuid })

// Mark messages as read
await supabase.rpc('mark_messages_as_read', { p_conversation_id: uuid })

// Expire old requests
await supabase.rpc('expire_old_requests')
```

---

*Document Version: 1.0*
*Last Updated: November 27, 2025*
*Generated for: FoodBridge Project*
