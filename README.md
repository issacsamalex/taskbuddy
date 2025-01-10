# TaskBuddy - Task Management App

TaskBuddy is a modern task management application designed to enhance productivity and streamline task organization. Built with robust features, TaskBuddy caters to personal needs with an intuitive interface and powerful features.

## Demo 💻

This project is deployed on Vercel. You can access it here.

## Features ✨

#### User Authentication

- Secure user authentication using Firebase Authentication with Google Sign-In.

#### Task Management

- Create, edit, and delete tasks seamlessly.
- Organize tasks by categories (e.g., Work, Personal)
- Set due dates for tasks to stay on top of deadlines.
- Drag-and-drop functionality for easy task rearrangement.

#### Batch Actions

- Perform batch actions such as deleting multiple tasks

#### File Attachments

- Attach files or documents to tasks for better context.
- Upload files directly during task creation or editing.
- View attached files in the task detail view.

#### Filter Options

- Filter tasks by category
- Search tasks by title for quick access.

#### Board/List View

- Switch between Kanban-style board view and traditional list view for task management flexibility.

#### Responsive Design

- Fully responsive interface optimized for various screen sizes, including mobile, tablet, and desktop.

## Setup Instructions

To set up and run this project locally, follow these steps:

### Prerequisites

Ensure you have the following installed:

- Node.js and npm installed on your system.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/issacsamalex/taskbuddy.git
cd inventory-management
```

2. Install dependencies:

```bash
npm install
```

3. Set Up Firebase
   - Create a Firebase project at Firebase Console.
   - Configure Firebase Authentication and Firestore.
   - Enable Firebase Storage for file attachments.
   - Add your Firebase configuration details in the firebaseConfig.ts file.

### Running the App

```bash
npm start
```

The app will be available at http://localhost:5173.

## Challenges Faced and Solutions

- #### Working with the Data Layer & Data fetching:
  - Challenge: Initially, I was unfamiliar with the TanStack React-Query library for managing server state. Understanding its APIs and patterns was overwhelming at first.
  - Solution: I referred to the React-Query documentation, which provided clear explanations and examples. Gradually, I gained a solid understanding and implemented efficient server-state management using React-Query.
- #### File Attachments in Firebase Storage:
  - Challenge: Integrating file uploads to Firebase Storage required understanding Firebase's Storage API, which I hadn't worked with before.
  - Solution: I referred to the Firebase documentation, focusing on examples of uploading and retrieving files. This step-by-step approach helped me implement a reliable file attachment feature.
