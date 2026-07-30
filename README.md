# Ledger — Todo Management App

A Todo Management application built with **React** and **Redux Toolkit**, with full CRUD support (Create, Read, Update, Delete), a completion toggle, and state persisted to `localStorage` so your list survives a page refresh.

## Features

- **Add Todo** — form with title + description fields
- **Todo List** — all todos shown in a table with title, description, and status columns
- **Edit** — clicking "Edit" loads the todo's data back into the form; submitting saves the change
- **Delete** — removes a todo after a confirmation prompt
- **Mark Complete** — a checkbox-style toggle switches a todo between `pending` and `complete`
- **Global state** — all todo data and edit-mode UI state lives in a single Redux slice (`src/store/todosSlice.js`)

## Project structure

```
todo-redux-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── TodoForm.js      # Add / edit form
│   │   ├── TodoList.js      # Table wrapper + empty state
│   │   └── TodoItem.js      # Single row: toggle, edit, delete
│   ├── store/
│   │   ├── store.js         # configureStore setup
│   │   └── todosSlice.js    # createSlice: reducers + selectors
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## Getting started

```bash
cd todo-redux-app
npm install
npm start
```

This runs the app in development mode at [http://localhost:3000](http://localhost:3000).

To create a production build:

```bash
npm run build
```

## How the Redux slice works

`src/store/todosSlice.js` holds:

- `items` — array of `{ id, title, description, completed, createdAt }`
- `editingId` — the id of the todo currently loaded into the form for editing (or `null` when adding a new one)

Reducers exposed: `addTodo`, `updateTodo`, `deleteTodo`, `toggleComplete`, `startEditing`, `cancelEditing`. Every mutation writes the updated list back to `localStorage`, so a refresh doesn't lose your data — swap the `persist()` calls for an API call if you'd rather back this with a real server.

## Notes

- Styling is plain CSS (`src/App.css`) — no UI library required.
- IDs are generated with `uuid` (`v4`).
- Form validation currently just requires a non-empty title; extend `TodoForm.js` if you need stricter rules.
