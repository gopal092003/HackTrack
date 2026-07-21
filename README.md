# HackTrack

HackTrack is a personal workspace for managing hackathons, projects, learnings, and achievements.

The project was born from a common problem: information from hackathons tends to become scattered across browser tabs, documents, GitHub repositories, and note-taking apps. Registration links are easy to lose, project ideas become difficult to revisit, and valuable lessons often disappear once an event is over.

HackTrack brings these pieces together in a single application. It helps track upcoming and active hackathons, organize projects, record achievements, maintain structured journals, and preserve lessons learned from every event.

---

## Overview

HackTrack provides a centralized workspace for planning, participating in, and reflecting on hackathons. It combines event management, project tracking, journaling, and resource organization into a single application designed to make hackathon participation easier to manage over time.

---

## Features

### Hackathon Management

Track hackathons throughout their lifecycle:

* Upcoming events
* Active hackathons
* Completed hackathons
* Automatic status updates based on event dates
* Countdown timers for ongoing events

### Kanban Board

Monitor active participation using a lightweight Kanban workflow.

Columns include:

* Upcoming
* Live

Hackathons move automatically as their status changes.

### Participation History

Maintain a searchable record of every hackathon, including:

* Project names
* Achievements
* Awards
* GitHub repositories
* Event links
* Personal reflections

### Journaling

Document each hackathon using structured notes covering:

* Goals
* Approach
* Challenges
* Outcomes
* Retrospectives

### Learning Tracker

Capture lessons from every event, including:

* Technical concepts
* Development workflows
* Team collaboration
* Product ideas
* Areas for improvement

### Calendar

View important dates in one place, including:

* Registration deadlines
* Start dates
* End dates

### Resources

Maintain a collection of useful links, tools, and references related to hackathons and projects.

### Search

Search across:

* Hackathons
* Projects
* Achievements
* Journals
* Learning notes
* Resources

### Authentication

Authentication is handled using Supabase Auth with Row Level Security (RLS).

Visitors can browse public content while administrative actions remain protected.

---

## Live Demo

https://hacktrack-gopal.vercel.app

---

## Technology Stack

### Frontend

* Next.js 15 (App Router)
* React 19
* TypeScript
* Tailwind CSS v4

### Backend

* Supabase
* PostgreSQL
* Supabase Auth
* Row Level Security (RLS)

### Deployment

* Vercel

---

## Project Structure

```
HackTrack/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── hackathons/
│   │   ├── login/
│   │   ├── participation-history/
│   │   ├── sites/
│   │   └── page.tsx
│   │
│   ├── components/
│   ├── lib/
│   └── middleware.ts
│
├── supabase-migration-v2.sql
├── package.json
└── README.md
```

---

## Installation

### Create a Supabase Project

Create a new Supabase project and execute the SQL migration provided in:

```
supabase-migration-v2.sql
```

---

### Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

### Clone the Repository

```
git clone https://github.com/gopal092003/HackTrack.git

cd HackTrack
```

---

### Install Dependencies

```
npm install
```

---

### Start the Development Server

```
npm run dev
```

Open the application:

```
http://localhost:3000
```

---

## Why I Built This

I regularly participate in hackathons and wanted a single place to organize everything related to them.

Instead of switching between spreadsheets, note-taking applications, browser bookmarks, and GitHub repositories, I wanted a workspace where I could:

* Track registrations and deadlines
* Organize ongoing projects
* Record achievements
* Document lessons learned
* Build a searchable history of past hackathons

HackTrack was built to solve that problem.

---

## Future Improvements

* GitHub API integration
* Repository analytics
* Google Calendar and iCal export
* Export journals and notes
* Improved mobile experience
* Multi-user workspaces with role-based permissions

---

## Contributing

Contributions, suggestions, and feedback are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request.

---

## Author

**Gopal Gupta**

GitHub: https://github.com/gopal092003

---

## License

This project is licensed under the MIT License.
