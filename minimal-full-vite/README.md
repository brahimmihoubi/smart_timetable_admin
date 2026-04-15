# Smart Timetable Admin

This project is a comprehensive administrative dashboard built with React and Vite, designed to manage institutional data and generate smart timetables. It provides a robust set of tools for managing building assets, academic structures, and scheduling logistics.

## Key Features

### Dashboard and Analytics
The application provides multiple dashboard views tailored for different administrative needs, including analytics, banking, booking, and e-commerce overviews.

### Academic Data Management
Comprehensive modules for managing core institutional data:
- Buildings and Rooms management
- Departmental organizational structures
- Groups and Academic Levels
- Teacher profiles and assignments
- Course catalogs

### Timetable Generation and Scheduling
- Automated timetable generation tools
- Conflict detection and resolution systems
- Interactive calendar view for schedule visualization
- Data export functionality for generated schedules

### Application Suite
Included productivity applications:
- File Manager for centralized document storage
- Real-time Chat application
- Integrated Mail client
- Kanban board for task management

### User and Access Management
- Multi-provider authentication support (JWT, Auth0, Firebase, Amplify, Supabase)
- Role-based access control and permission management
- Detailed user profiles and account settings

## Technology Stack
- Core Framework: React 19
- Build Tool: Vite 6
- UI Library: Material UI (MUI)
- Animations: Framer Motion
- Form Management: React Hook Form with Zod validation
- State Management: React Context API
- Routing: React Router 7
- API Client: Axios

## Project Structure
The project follows a modular architecture:
- src/actions: Application logic for authentication and data fetching
- src/auth: Authentication providers and guards
- src/components: Reusable UI components
- src/hooks: Custom React hooks
- src/layouts: Layout configurations for dashboard and auth pages
- src/pages: High-level page components
- src/sections: Content-specific components for various modules
- src/theme: Custom MUI theme and styling system
- src/utils: Helper functions and utility classes

## Getting Started
To run the project locally, install dependencies and start the development server:
```bash
npm install
npm run dev
```

The application will be available at http://localhost:3030 by default.
