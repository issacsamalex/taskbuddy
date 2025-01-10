import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import TaskPage from "./pages/TaskPage";
import { Toaster } from "./components/ui/toaster";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ProtectedRoute from "./features/auth/ProtectedRoute";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/taskdashboard"
              element={
                <ProtectedRoute>
                  <TaskPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </DndProvider>
  );
}

export default App;
