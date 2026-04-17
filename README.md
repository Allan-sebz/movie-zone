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