# Frontend Architecture & Design Prompt for AI Builder

## Project Overview
Build a **LeetCode-style coding platform** frontend. The application allows users to browse coding problems, solve them in an integrated code editor, run/test their code against test cases, and submit solutions. It also includes an admin interface for managing problems.

## Technology Stack
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS (Utility-first)
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios
- **State Management**: React Context or Local State (useState/useEffect)

## Core Architecture & Data Flow

### 1. Authentication & Security
- **Mechanism**: JWT-based authentication.
- **Storage**: Store the user object (including `token` and `isAdmin` flag) in `localStorage`.
- **Request Interception**: Create a centralized Axios instance (`api.js`). Use a request interceptor to automatically attach the `Authorization: Bearer <token>` header to every request if the user is logged in.
- **Route Protection**: Implement a `ProtectedRoute` wrapper component.
  - If not logged in -> Redirect to `/login`.
  - If `adminOnly` prop is true and user is not admin -> Redirect to home.

### 2. Service Layer (`/src/services`)
Abstract all API calls into dedicated service files to keep components clean.
- **`authService.js`**: `login(credentials)`, `register(userData)`, `logout()`, `getCurrentUser()`.
- **`problemService.js`**: `getProblems()`, `getProblemById(id)`, `createProblem(data)`.
- **`submissionService.js`**: 
  - `runCode(data)`: Sends code + test cases to backend for dry-run.
  - `submitCode(data)`: Sends code for final evaluation.

### 3. Page Structure & Features

#### A. Public Pages
- **Login / Signup**: Simple forms with validation. Upon success, save user to local storage and redirect.

#### B. Problem List (Home)
- **Layout**: Clean table layout.
- **Columns**: Title, Difficulty (Color-coded: Green/Easy, Yellow/Medium, Red/Hard), Action (Solve button).
- **Data Fetching**: Fetch list on mount via `problemService`.

#### C. Problem Workspace (`/problems/:id`)
- **Layout**: Split-screen (Resizable preferred, or fixed 50/50).
  - **Left Panel**: Problem Description.
    - Title, Difficulty Badge.
    - Description text (support Markdown/whitespace).
    - Example Test Cases (Input/Output boxes).
  - **Right Panel**: Code Editor & Console.
    - **Editor**: Monaco Editor or similar (syntax highlighting for JS/Python).
    - **Action Bar**: "Run" (Test) and "Submit" buttons.
    - **Output Console**: Tabbed view (Output vs Result).
      - Displays stdout, error messages, or success/failure status from the backend.
      - Show "Accepted" (Green) or "Wrong Answer" (Red) status.

#### D. Admin Interface (`/admin`)
- **Access**: Restricted to users with `isAdmin: true`.
- **Feature**: Create Problem Form.
  - Fields: Title, Description, Difficulty (Dropdown), Starter Code.
  - **Dynamic Test Cases**: Ability to add/remove multiple test case rows (Input, Output, Hidden flag).

## Design Guidelines
- **Aesthetics**: Minimalist, developer-focused. Similar to VS Code or LeetCode's old UI.
- **Feedback**: Use loading spinners for async actions (Run/Submit). Show toast notifications or alerts for errors/success.
- **Responsiveness**: Desktop-first, but usable on tablets.

## API Contract (Expected Backend Endpoints)
- `POST /auth/login`, `POST /auth/signup`
- `GET /problems`, `GET /problems/:id`, `POST /problems`
- `POST /submit/run` (Dry run), `POST /submit` (Final submission)
