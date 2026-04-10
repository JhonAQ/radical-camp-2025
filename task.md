# Muro Radical — Social Feed Implementation

## Foundation
- [ ] Install `node-appwrite` dev dependency
- [ ] Update `lib/appwrite.ts` with Storage, Teams, config constants
- [ ] Create `lib/useAuth.ts` — auth hook
- [ ] Update `lib/utils.ts` — timeAgo helper
- [ ] Create `lib/social.ts` — social API functions
- [ ] Create `lib/notifications.ts` — notification helpers
- [ ] Create `scripts/setup-appwrite.mjs` — backend setup script

## Social Components
- [ ] `app/social/components/MediaRenderer.tsx`
- [ ] `app/social/components/StoriesBar.tsx`
- [ ] `app/social/components/PostCard.tsx`
- [ ] `app/social/components/CommentsSheet.tsx`
- [ ] `app/social/components/FullscreenViewer.tsx`
- [ ] Rewrite `app/social/page.tsx`

## Notifications
- [ ] Create `components/ui/NotificationsPanel.tsx`
- [ ] Update `components/layout/AppTopBar.tsx`

## Admin Panel
- [ ] `app/admin/layout.tsx`
- [ ] `app/admin/social/page.tsx`

## Config & Polish
- [ ] Update `next.config.ts` — Appwrite Storage hostname
- [ ] Update `app/globals.css` — new animations/utilities
- [ ] Verify build passes
