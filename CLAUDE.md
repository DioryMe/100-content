# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `yarn` - Install dependencies
- `yarn dev` - Start development server with Vite
- `yarn build` - Build for production (runs TypeScript check then Vite build)
- `yarn preview` - Preview production build locally
- `yarn pre-deploy` - Build and prepare for deployment (copies index.html to 200.html for SPA routing)
- `yarn deploy` - Deploy to Surge.sh at http://diory-selain.surge.sh

## Architecture Overview

This is a React-based browser application for working with Diograph content libraries. The app provides both grid and swipe-based interfaces for content exploration and includes archive functionality.

### Core Technologies
- **React 19** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Vite** for build tooling
- **@diograph libraries** for content management (@diograph/diograph, @diograph/http-client)

### Key Architecture Patterns

**State Management**: Single Redux store with `diorySlice` handling all diograph data, content loading, and navigation state. The slice manages:
- Diograph loading from remote rooms via HTTP client
- Focus/story navigation with prev/next logic
- Async content loading with blob URL generation
- Archive room aggregation into global diograph

**Content Loading**: Two-tier system:
1. Diograph metadata loaded from `diograph.json` 
2. Individual content items loaded on-demand as blob URLs with proper MIME type handling

**Room System**: Uses localStorage for room configuration:
- `roomAddress` - Current room endpoint
- `basicAuthToken` - Authentication token
- `archiveRooms` - Array of archive room configurations

**Routing Structure**:
- `/` - Home page
- `/welcome` - Credential setup (bypasses diograph loading)
- `/diory/:focusId/grid` - Grid view for specific diory
- `/diory/:focusId/content` - Content swipe view
- `/archive` - Archive grid combining multiple rooms
- `/archive/diory/:focusId` - Individual archive diory view

### Key Files
- `src/store/diorySlice.ts` - Central state management with async thunks for data loading
- `src/utils/globalDiograph.ts` - Archive aggregation logic
- `src/App.tsx` - Route configuration and diograph initialization
- `src/setCredentials.tsx` - Room credential management

The app follows a content-first architecture where all UI components are driven by the diograph state, with clear separation between content metadata and actual content loading.