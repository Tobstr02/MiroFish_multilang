# AGENTS.md

This document provides instructions for agentic coding agents operating in this repository.

## Project Structure

This is a full-stack application with a Python backend and a Vue.js frontend.

-   `backend/`: Python (Flask) application
-   `frontend/`: Vue.js 3 application

## Build, Lint, and Test Commands

### General

-   **Install all dependencies (frontend and backend):**
    ```bash
    npm run setup:all
    ```
-   **Run the application in development mode:**
    ```bash
    npm run dev
    ```

### Frontend

-   **Install frontend dependencies:**
    ```bash
    cd frontend && npm install
    ```
-   **Run frontend in development mode:**
    ```bash
    npm run frontend
    ```
-   **Build for production:**
    ```bash
    npm run build
    ```
-   **Linting and Formatting:**
    -   There are no explicit linting or formatting configurations.
    -   Please adhere to standard Vue.js and JavaScript best practices. Use Prettier with default settings for formatting.

### Backend

-   **Install backend dependencies:**
    ```bash
    npm run setup:backend
    ```
-   **Run backend server:**
    ```bash
    npm run backend
    ```
-   **Testing:**
    -   The project uses `pytest` for testing.
    -   **Run all tests:**
        ```bash
        cd backend && uv run pytest
        ```
    -   **Run a single test file:**
        ```bash
        cd backend && uv run pytest app/api/tests/test_graph.py
        ```
    -   **Run a single test function:**
        ```bash
        cd backend && uv run pytest app/api/tests/test_graph.py -k "test_function_name"
        ```
-   **Linting and Formatting:**
    -   There are no explicit linting or formatting configurations.
    -   Please adhere to PEP 8 guidelines. Use a tool like `black` or `ruff` for formatting.

## Code Style Guidelines

### General

-   **Imports:**
    -   Organize imports in three groups: standard library, third-party libraries, and internal modules.
    -   Sort imports alphabetically within each group.
-   **Naming Conventions:**
    -   Use `camelCase` for variables and functions in JavaScript/Vue.js.
    -   Use `PascalCase` for Vue.js components.
    -   Use `snake_case` for variables and functions in Python.
    -   Use `PascalCase` for classes in Python.
-   **Error Handling:**
    -   Use `try...catch` blocks for asynchronous operations in JavaScript.
    -   Use `try...except` blocks for error handling in Python.
    -   Provide meaningful error messages.

### Frontend (Vue.js)

-   **Components:**
    -   Keep components small and focused on a single responsibility.
    -   Use the `<script setup>` syntax for new components.
    -   Use `props` to pass data from parent to child components.
    -   Use `emits` to send events from child to parent components.
-   **Types:**
    -   While not strictly enforced, strive to use JSDoc for type annotations to improve code clarity.

### Backend (Python)

-   **Types:**
    -   Use type hints for all function signatures and variables.
    -   Use Pydantic for data validation and settings management.
-   **Dependency Management:**
    -   The project uses `uv` for dependency management.
    -   To add a new dependency, add it to `pyproject.toml` and run `uv sync`.
-   **Logging:**
    -   Use the application logger for logging. Do not use `print()` statements.

## Agentic Coding Conventions

-   **Cursor/Copilot Rules:**
    -   There are no `.cursor/rules/` or `.github/copilot-instructions.md` files in this repository.
    -   Please follow the guidelines in this document.
-   **Commits:**
    -   Write clear and concise commit messages.
    -   Follow the conventional commits specification.
-   **Pull Requests:**
    -   Provide a detailed description of the changes in the pull request.
    -   Reference any related issues.

This document is a living document. Please update it as the project evolves.
