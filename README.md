# CineQuest: The Human-Centric Movie Discovery Platform

![CineQuest Landing](/api/placeholder/1200/400)

CineQuest is a premium, full-stack cinematic exploration platform designed to solve "Choice Paralysis." It transforms raw metadata from The Movie Database (TMDB) into an intuitive, emotionally resonant discovery experience.


## Key Features

- **Smart Mood Discovery**: A custom innovation that curates movies based on emotional states (e.g., "Adrenaline Rush", "Rainy Day Melancholy") rather than just static genres.
- **Real-time Analytics**: Dynamic dashboard tracking trending titles and user preference matrices.
- **Advanced Semantic Search**: Resolves search visibility issues and handles complex query parameters with zero-crash fallbacks.
- **Secure Watchlist**: Persistently track "to-watch" lists and marked-viewing history.
- **Multi-Dimensional Discovery**: Explore via Genres, Trending Windows, and Top-Rated cinematic categories.

---

## Technical Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion (Animations).
- **Backend**: Django REST Framework (DRF), Python 3.x.
- **Database**: SQLite (Development) / PostgreSQL (Production ready).
- **Testing**: Jest & React Testing Library (Frontend), Django TestCase (Backend).
- **API**: Integrated with [TMDB v3 API](https://www.themoviedb.org/documentation/api).

---

## Getting Started

### 1. Prerequisites
- Python 3.9+
- Node.js 18+
- TMDB API Key ([Get one here](https://www.themoviedb.org/settings/api))

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure Environment
cp .env.example .env  # Or create a .env file
# Add your TMDB_API_KEY and DJANGO_SECRET_KEY

# Prepare Database
python manage.py migrate
python manage.py sync_movies --genres
python manage.py sync_movies --trending 2

# Start Server
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install

npm run dev
```
Navigate to `http://localhost:3000` to start exploring.

---

## Quality Assurance

### Backend Unit Tests
We maintain 5 core unit tests covering Model integrity and URL constructors.
```bash
python manage.py test
```

### Frontend Component Tests
We maintain 3 behavioral tests using Jest for utility logic and UI rendering.
```bash
npm test
```

---

## Contributors & Work Distribution

Detailed work distribution, including specific code-file assignments for each member, can be found in the [**CONTRIBUTIONS.md**](./CONTRIBUTIONS.md) file.

**Lead Architect:** Geno Owor Joshua  
**Technical Documentation:** Technical Report [**PDF/MD**](./Technical_Report.md)

---

## Academic Credentials
- **Course**: Software Construction (SYE3209)
- **Institution**: Uganda Christian University
- **Faculty**: Engineering, Design, and Technology
- **Department**: Computing and Technology
- **Date**: April 2026

---

## License
Released under the MIT License. For academic evaluation purposes only.

---

## How the Application Works (End-to-End)

This section explains the full execution flow of CineQuest from UI interaction to backend logic and external data sources.

### 1. System Architecture

- **Frontend (Next.js 14 + TypeScript)** renders all user-facing pages and calls backend APIs.
- **Backend (Django REST Framework)** exposes REST endpoints for movies, users, and recommendations.
- **TMDB API** is the primary external movie metadata source.
- **SQLite (local DB)** stores users, synced movie entities, watchlists, and interaction history.

### 2. Request Flow

1. A user opens a page in the frontend (for example Home, Search, Mood, Genre, Dashboard).
2. Frontend components call typed API helpers from `src/lib/api.ts`.
3. Requests go to `/api/...` in Next.js, which is rewritten to `http://localhost:8000/api/...`.
4. Django routes requests through app-specific URL modules:
	 - `/api/movies/...`
	 - `/api/recommendations/...`
	 - `/api/users/...`
5. DRF views process request parameters and either:
	 - read/write local DB models, or
	 - call service-layer integrations (TMDB / Wikipedia), then return JSON.

### 3. Frontend Layer (User Experience)

- **Home page** fetches trending, now-playing, and top-rated collections in parallel.
- **Search and discovery pages** pass filters (query, genre, year, rating, runtime, language, sorting) to backend endpoints.
- **Movie detail pages** display rich data (overview, cast, recommendations, similar titles, optional Wikipedia summary).
- **Auth context** keeps session tokens in memory/sessionStorage and automatically refreshes expired access tokens.

### 4. Backend Apps and Responsibilities

- **movies app**
	- Domain models: `Movie`, `Genre`, `Person`, `MovieCast`, `WatchProvider`.
	- Public endpoints for trending, search, now-playing, top-rated, compare, mood discovery, and time-machine capsules.
	- ViewSet actions for movie recommendations/similar lists and Wikipedia enrichment.

- **users app**
	- Custom `User` model (with profile extras like avatar, favorite genres, country).
	- Registration and profile endpoints.
	- JWT authentication via SimpleJWT.

- **recommendations app**
	- Tracks interactions (view/like/dislike/watchlist/watched/search).
	- Computes weighted genre preferences.
	- Produces personalized recommendation feeds.
	- Stores and manages user watchlist state and dashboard aggregates.

### 5. Data Sources and Caching Strategy

- **TMDBService** wraps TMDB API calls for search, discover, details, people, recommendations, and providers.
- Django cache is used to reduce repeated external calls and improve response time.
- **MovieSyncService** can persist TMDB movie/genre/person/provider data locally for richer local querying.
- **WikipediaService** adds optional contextual summaries for movie detail pages.

### 6. Personalization Logic

1. User actions are recorded in `UserMovieInteraction`.
2. Interactions are converted to weighted signals (for example like > watched > view > search, with dislike negative).
3. Genre preference weights are normalized and saved per user.
4. Recommendation engine discovers movies from top-weighted genres.
5. Already watched/disliked movies are filtered out.
6. Final candidates are ranked and returned as personalized results.

### 7. Time Machine Feature

- The time-machine endpoint builds a "cinematic year capsule" for a given year.
- It combines TMDB discover/credits data with curated historical mappings (Oscar winners and notable global events).
- Output includes yearly briefing, top films, key icons, and category highlights.

### 8. Authentication and Security Model

- Unauthenticated users can browse public movie content.
- Personalized endpoints require JWT-authenticated users.
- Frontend sends Bearer tokens automatically when available.
- On token expiry, frontend refreshes via `/api/auth/token/refresh/` and retries failed requests.

### 9. Running State Verified

At the time of this update, both development services were started and responded successfully:

- Backend: `http://127.0.0.1:8000` (Django)
- Frontend: `http://localhost:3000` (Next.js)

Both endpoints returned HTTP `200` during runtime verification.
