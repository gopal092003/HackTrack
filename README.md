# HackTrack

**A personal workspace for managing hackathons, projects, learnings, and achievements.**

HackTrack was built to solve a problem I kept running into during hackathons: information was scattered everywhere.

Registration links lived in browser tabs, project notes were buried in documents, achievements were difficult to track, and reflections often disappeared once an event ended.

HackTrack brings everything together in a single place. It helps track active and upcoming hackathons, document projects, record achievements, maintain structured journals, and preserve lessons learned from every event.

---

## ✨ Features

### 📅 Hackathon Management

Track hackathons through their entire lifecycle:

* Upcoming hackathons
* Live hackathons
* Completed hackathons
* Automatic status detection based on start and end dates
* Countdown timers for active events

### 📌 Kanban Workflow

Visualize ongoing participation with a lightweight Kanban board:

* Upcoming
* Live

Hackathons automatically move between columns as their status changes.

### 🏆 Participation History

Maintain a permanent record of your hackathon journey:

* Project names
* Achievements
* Prize information
* GitHub repositories
* Event links
* Learnings and reflections

### 📖 Structured Journaling

Document every hackathon with structured notes:

* Goal
* Approach
* Challenges
* Outcome
* Retrospective

These notes are stored and surfaced as a searchable knowledge base.

### 🎓 Learning Tracker

Capture lessons learned from every event:

* Technical insights
* Teamwork learnings
* Product discoveries
* Development workflows
* Mistakes and improvements

### 📅 Calendar View

Visualize important dates in one place:

* Registration deadlines
* Start dates
* End dates

### 🔗 Sites & Resources

Maintain a curated collection of useful websites, tools, and project resources.

### 🔍 Search & Navigation

Quickly find information across:

* Hackathons
* Projects
* Achievements
* Learnings
* Resources

### 🔐 Secure Authentication

Powered by Supabase Auth and Row Level Security (RLS).

Visitors can browse content while administrative actions remain protected.

---

## 🚀 Live Demo

👉 https://hacktrack-gopal.vercel.app

---

## 🛠 Tech Stack

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

## 🏁 Getting Started

### 1. Create a Supabase Project

Create a new project in Supabase and run the provided migration file.

```sql
-- Paste the contents of supabase-migration-v2.sql
```

### 2. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Clone the Repository

```bash
git clone https://github.com/gopal092003/HackTrack.git
cd HackTrack
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Start the Development Server

```bash
npm run dev
```

Visit:

```text
http://localhost:3000
```

---

## 📁 Project Structure

```text
HackTrack/
├── .gitignore
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── supabase-migration-v2.sql
├── tailwind.config.ts
├── tsconfig.json
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── hackathons/
│   │   │   └── sites/
│   │   ├── hackathons/
│   │   ├── login/
│   │   ├── participation-history/
│   │   ├── sites/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                 # Dashboard (home)
│   │
│   ├── components/
│   │   ├── forms/                   # Form components (create/edit)
│   │   ├── ui/                      # Reusable UI components (buttons, modals, etc.)
│   │   ├── dashboard-client.tsx
│   │   ├── hackathons-client.tsx
│   │   ├── history-client.tsx
│   │   ├── logout-button.tsx
│   │   ├── navbar.tsx
│   │   └── sites-client.tsx
│   │
│   ├── lib/
│   │   ├── supabase/                # Supabase client configurations
│   │   ├── auth.ts
│   │   ├── queries.ts               # Database queries & server actions
│   │   ├── types.ts                 # TypeScript interfaces
│   │   └── validations.ts
│   │
│   └── middleware.ts                # Auth middleware
│
└── README.md                        # (You can add this now)
```

---

## 🎯 Why I Built This

I participate in hackathons regularly and wanted a single place to:

* Track registrations and deadlines
* Manage ongoing projects
* Record achievements
* Capture lessons learned
* Build a searchable history of my work

HackTrack became that workspace.

---

## 🔮 Future Improvements

* GitHub API integration
* Automatic repository statistics
* Calendar export (Google Calendar / iCal)
* Export journals and learnings
* Improved mobile experience
* Multi-user support with granular permissions

---

## 🤝 Contributing

Contributions, suggestions, and feedback are always welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 📄 License

MIT License

Feel free to use, modify, and build upon this project.
