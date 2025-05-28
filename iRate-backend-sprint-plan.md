
# 🔧 iRate Backend 10-Day Sprint Plan

**Goal:** Complete all backend endpoints in 10 days  
**Daily Target:** 7 focused hours/day (3h AM, 2h PM, 2h night)  
**Strategy:** Build working endpoints fast, refine later. Use AI for scaffolding. Push daily.

---

## ✅ Ground Rules
- No perfect code — get it working first.
- Push to GitHub daily.
- Swagger or Postman for all endpoints.
- Use AI prompts to unblock & speed up.
- Track tasks in Notion/GitHub board.

---

## 🗓️ Day 1 – Auth & Users
- [ ] Refresh codebase structure
- [ ] Auth endpoints (register, login, refresh, logout)
- [ ] Swagger docs for Auth
- [ ] Complete User CRUD (find by ID/username/email)
- [ ] Add basic roles/permissions logic

**AI Prompts**
```
Generate a complete NestJS Auth flow with JWT access + refresh tokens using Passport and Prisma.
Add role-based access guards in NestJS using custom decorators and guards.
```

---

## 🗓️ Day 2 – Profile & Verification
- [ ] Update bio, preferences, avatar
- [ ] Email/Phone verification (with Redis TTL)
- [ ] Resend verification with cooldown
- [ ] Add rate limiting logic

**AI Prompts**
```
Build a NestJS service for email and phone verification using Redis for OTP expiry.
Add resend email/OTP logic with cooldown timer in NestJS.
```

---

## 🗓️ Day 3 – Matching & Discovery
- [ ] Build matching logic (score by interests, etc.)
- [ ] Discovery feed: nearby, interests filter
- [ ] Pagination support
- [ ] Add Haversine query for distance in PostgreSQL

**AI Prompts**
```
Generate SQL for Haversine distance filter in Prisma using raw queries.
Build a NestJS matching algorithm service with score breakdown by interests.
```

---

## 🗓️ Day 4 – Rating System
- [ ] Submit ratings (1–5 stars)
- [ ] Prevent duplicate ratings
- [ ] Show average rating on profiles
- [ ] Track daily/weekly rating activity

**AI Prompts**
```
Write a Prisma model for user ratings with foreign keys and unique constraints.
NestJS controller for submitting and retrieving user ratings with average score.
```

---

## 🗓️ Day 5 – Chat System
- [ ] Set up 1–1 conversations
- [ ] Create/send messages
- [ ] Unread message count per convo
- [ ] Mark messages as read

**AI Prompts**
```
Design a Prisma schema for 1-to-1 messaging with conversation tracking.
Build a NestJS chat module with message creation and retrieval using Prisma.
```

---

## 🗓️ Day 6 – Notifications
- [ ] Handle events: match, new msg, rating
- [ ] Build notification queue (in-memory or Redis)
- [ ] Mark notifications as read
- [ ] Add pagination

**AI Prompts**
```
Create a reusable NestJS notification service that supports different event types with a notification queue.
Design a Prisma model for user notifications with types and read status.
```

---

## 🗓️ Day 7 – Media Uploads
- [ ] User photo uploads (Cloudinary or S3)
- [ ] Limit to 4 images per user
- [ ] Replace/delete images
- [ ] Return uploaded URLs to profile

**AI Prompts**
```
NestJS service to upload and delete images on Cloudinary using Multer and Sharp.
Build a Prisma-compatible media schema to track image URLs per user.
```

---

## 🗓️ Day 8 – Admin & Metrics
- [ ] Admin dashboard endpoints
- [ ] Metrics: user growth, matches, ratings
- [ ] Secure routes with role guards

**AI Prompts**
```
Build a simple analytics metrics service in NestJS with Prisma aggregation queries.
Guard NestJS admin routes using custom decorators and roles enum.
```

---

## 🗓️ Day 9 – Email & Campaigns
- [ ] Send welcome/engagement emails
- [ ] Create templates for messages
- [ ] Use Nodemailer or SendGrid
- [ ] Add cron/batch support

**AI Prompts**
```
Send dynamic HTML emails using Nodemailer in NestJS with inlined CSS and templates.
NestJS cron job to send engagement emails to users with low activity.
```

---

## 🗓️ Day 10 – Polish & Docs
- [ ] Swagger final cleanup
- [ ] README with API usage
- [ ] Validate all DTOs and guards
- [ ] Final GitHub push and tag
- [ ] Seed script with dummy users & messages

**AI Prompts**
```
Write a Swagger config for NestJS that supports bearer auth and global tags.
Generate realistic Prisma seed script for users, ratings, and messages.
```



Rating Controller
GET /users/{userId}/ratings – Retrieve all ratings for user {userId} (protected).
POST /ratings – Submit a rating for a user (body includes targetUserId, rating value, etc.) (protected).
PUT /ratings/{ratingId} – Update an existing rating (protected).
DELETE /ratings/{ratingId} – Remove a rating (protected).
GET /ratings/statistics/{userId} – Get rating summary (average score, count) for user {userId} (protected).
Note: Use cached aggregates for scalability.


Users Controller
GET /users – List users for home feed or explore (protected). Supports pagination (e.g. ?page=&limit=) and optional filters (e.g. gender, age). This returns user “cards” (basic info and a featured photo).
GET /users/trending – List trending/popular users (protected). Similar to /users but sorted by popularity.
GET /users/search – Search users by name or tags (protected).
GET /users/{userId} – Get public profile of user {userId} (protected). Includes basic profile and public photos.
POST /users/{userId}/block – Block user {userId} (protected). (Guards to prevent messaging or viewing).
POST /users/{userId}/report – Report user {userId} for abuse (protected).


Profile Controller
GET /profile – Get current user’s full profile (protected).
PUT /profile – Update profile info (bio, preferences, etc.) (protected).
PUT /profile/password – Change password (protected).
GET /profile/photos – List current user’s profile photos (protected).
POST /profile/photos – Upload a new profile photo (protected). Multipart file.
DELETE /profile/photos/{photoId} – Delete a profile photo (protected).
PUT /profile/avatar – Set a profile photo as avatar (protected).


Notifications Controller
GET /notifications – List current user’s notifications (protected). Supports pagination.
GET /notifications/unread-count – Get unread notification count (protected).
PUT /notifications/{notificationId}/read – Mark notification as read (protected).
DELETE /notifications/{notificationId} – Delete a notification (protected).


Affiliate Controller
GET /affiliate/referrals – List users referred by current user (protected).
GET /affiliate/commissions – List commission/earnings history (protected, Creator role). Only users who have accepted chat requests (creators) see this.
GET /affiliate/invite-link – Get current user’s unique referral/invite link (protected).
GET /affiliate/stats – Get affiliate dashboard stats (protected).
POST /affiliate/send-invite – (Optional) Send an invite email to a friend (protected).


Chat & Messaging Controller
GET /chats – List 1:1 chat conversations of current user (protected). Supports pagination.
GET /chats/{chatId}/messages – Retrieve messages in chat {chatId} (protected). Supports pagination.
POST /chats/{chatId}/messages – Send a message in chat {chatId} (protected). Body includes text/media. (Guard: only if chat unlocked or user is in conversation.)
DELETE /chats/{chatId} – Delete/close a conversation (protected).
GET /chat-requests – List incoming chat requests pending your acceptance (protected).
POST /chat-requests – Create a new chat request (protected). Body includes targetUserId; this triggers payment logic to unlock messaging.
POST /chat-requests/{requestId}/accept – Accept chat request {requestId} (protected). Grants messaging access; this user becomes a creator.
POST /chat-requests/{requestId}/decline – Decline chat request {requestId} (protected).
Note: Each chat is strictly 1:1. Payment/unlocking logic should be transactional.


Subscription (Monetization) Controller
GET /subscriptions/plans – List available messaging subscription plans or token packages (protected).
GET /subscriptions – Get current user’s subscription status (protected).
POST /subscriptions/subscribe – Purchase or subscribe to messaging feature (protected). Body may include plan ID or payment info.
POST /subscriptions/cancel – Cancel messaging subscription (protected).
GET /subscriptions/history – Get payment history for subscriptions (protected).
Note: Only messaging is paid. All other features remain free in-app.


Media Controller
POST /media/profile/upload – Upload a profile image (protected). Multipart file (image). Returns media ID/URL.
DELETE /media/profile/{mediaId} – Delete a profile image (protected).
GET /media/profile/{userId} – (Optional) List public profile media for user {userId} (protected or public as needed).
POST /media/message/upload – Upload a message attachment (protected). Multipart file (image/video/audio). Returns media ID/URL.
GET /media/{mediaId} – Retrieve a media file by ID (authenticated, or via secure CDN link).
DELETE /media/{mediaId} – Delete a media file (protected, owner only).
Each endpoint should enforce role and auth guards (e.g. @UseGuards(AuthGuard, RolesGuard)) as appropriate. For example, affiliate commissions require a “creator” role. Multi-word path segments use hyphens and all paths are lowercase to follow URL conventions
blog.dreamfactory.com
. Pagination (page, limit) and query parameters should be supported on list endpoints. Caching or database indexing is recommended for heavy-read routes (e.g. user feed, trending) to ensure scalability.