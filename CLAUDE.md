# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
CoopLedger is a blockchain-based platform enabling farmers to collaboratively participate and vote on decisions for responsible and transparent agricultural management.

## Architecture
The project is divided into three main components:
- **API (`/api`)**: Backend server using Express.js, TypeScript, Drizzle ORM (Neon PostgreSQL), Better-Auth, Socket.io for real-time updates, and BullMQ for background tasks.
- **Mobile (`/mobile`)**: Mobile application built with Expo, Expo Router, and Better-Auth client.
- **Landing (`/landing`)**: Multilingual landing page built with Next.js (App Router) supporting English and French.

## Common Commands

### API
- Development: `cd api && npm run dev`
- Build: `cd api && npm run build`
- Start: `cd api && npm start`
- Docker: `cd api && docker build -t coopledger-api .`

### Mobile
- Start: `cd mobile && npm start`
- Android: `cd mobile && npm run android`
- iOS: `cd mobile && npm run ios`
- Web: `cd mobile && npm run web`
- Lint: `cd mobile && npm run lint`

### Landing
- Development: `cd landing && npm run dev`
- Build: `cd landing && npm run build`

## Design System
### Typography
- **Primary Font**: `GoogleSansText`
- **Weights**:
  - Regular: `GoogleSansText-Regular` (Body text, inputs)
  - Medium: `GoogleSansText-Medium` (Labels, buttons, sub-headers)
  - Bold: `GoogleSansText-Bold` (Headers, titles)
  - Italic: `GoogleSansText-Italic` / `GoogleSansText-BoldItalic`

### Color Palette
- **Primary (Growth/Nature)**: `#2d936c` (Green) - Use for main calls-to-action (CTAs), success states, and key brand accents.
- **Secondary (Trust/Tech)**: `#7cc6fe` (Blue) - Use for supporting actions, links, info banners, and highlights.
- **Tertiary (Earth/Warmth)**: `#f2e3bc` (Beige) - Use for soft backgrounds, cards, subtle highlights, and organic accents.
- **Neutrals**:
  - Dark Gray: `#333333` (Primary text)
  - Medium Gray: `#666666` (Subtitles, secondary text)
  - Light Gray: `#DDDDDD` (Borders, disabled states)
  - Off-White: `#F9F9F9` (Input backgrounds)

### UI Principles
- **User-Centricity**: Prioritize clarity, accessibility, and a warm, welcoming feel for farmers.
- **Consistency**: Every text element MUST use a `GoogleSansText` variant.
- **Purposeful Color**: Use Beige to break the starkness of white, Green for action, and Blue for guidance.

## Development Guidelines
- **Git**: All commits must be co-authored by Claude (`Co-Authored-By: Claude <noreply@anthropic.com>`).
- **Auth**: Authentication is centralized using Better-Auth across API and Mobile.
- **Mobile Development**: Use `expo/skills` for mobile-specific tasks.
- **API Environment**: Ensure `.env` is configured based on `.env.example` in the `/api` directory.
