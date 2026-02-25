# TIMformation 

**TIMformation** is a centralized platform designed to help the local community of **Timișoara** stay informed about administrative projects in their city. 

This project was developed for **UniHack**, specifically for the **Public Service Community** track.

## Purpose

The main goal of TIMformation is to **centralize** information regarding public administrative projects. It provides a transparent and accessible way for locals to view:
- 🟢 **Finished Projects**
- 🔵 **Ongoing Projects** (Projects in progress)
- 🟡 **Planned Projects** (Not yet started)

By visualizing these projects on an interactive map, citizens can easily see what work is being done in their neighborhoods and across the city.

## Features

### For Regular Users (Locals)
- **Interactive Map**: Explore Timișoara with marked locations of various administrative projects.
- **Status Indicators**: Projects are color-coded based on their status (Planned, Ongoing, Finished).
- **Project Details**: Click on any marker to view detailed information about the project, including its description, timeline, and current status.
- **No Account Required**: Information is publicly accessible without needing to log in.

### For Administrators
- **Project Management**: Centralized dashboard to add new projects, update existing ones, or change their status.
- **Authentication**: Secure login system for authorized personnel to manage the data.

## Technologies Used

The application is built using modern web development technologies to ensure speed, scalability, and a great user experience:

- **Frontend**: [Next.js](https://nextjs.org/) (React Framework) with TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a responsive and modern UI
- **Maps**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/) for interactive map components
- **Database & Backend**: [Supabase](https://supabase.com/) (PostgreSQL) for real-time data and authentication
- **Deployment**: [Vercel](https://vercel.com/) for fast and reliable hosting

## Getting Started

If you want to run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ioana-28/TIMformation.git
    cd TIMformation/timformation
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the `timformation` directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This application is deployed on **Vercel**, making it globally accessible and ensuring continuous deployment with every update.

---

