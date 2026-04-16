import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Spinner from "./components/common/Spinner";
import { useAuth } from "./context/authContext";

const LoginPage = lazy(() => import("./page/auth/LoginPage"));
const RegisterPage = lazy(() => import("./page/auth/RegisterPage"));
const ResetPasswordPage = lazy(() => import("./page/auth/ResetPasswordPage"));
const NotFoundPage = lazy(() => import("./page/NotFoundPage"));
const DashboardPage = lazy(() => import("./page/Dashboard/DashboardPage"));
const DocumentListPage = lazy(() => import("./page/Documents/DocumentListPage"));
const DocumentDetailsPage = lazy(() => import("./page/Documents/DocumentDetailsPage"));
const FlashcardsPage = lazy(() => import("./page/flashcard/FlashcardsPage"));
const FlashcardListPage = lazy(() => import("./page/flashcard/FlashcardListPage"));
const QuizTakePage = lazy(() => import("./page/Quizzes/QuizTakePage"));
const QuizResultPage = lazy(() => import("./page/Quizzes/QuizResultPage"));
const ProfilePage = lazy(() => import("./page/profile/ProfilePage"));

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Router>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated
                ? <Navigate to="/dashboard" replace />
                : <Navigate to="/login" replace />
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/documents" element={<DocumentListPage />} />
            <Route path="/documents/:id" element={<DocumentDetailsPage />} />
            <Route path="/flashcards" element={<FlashcardListPage />} />
            <Route path="/documents/:id/flashcard" element={<FlashcardListPage />} />
            <Route
              path="/documents/:id/flashcard/:flashcardId"
              element={<FlashcardsPage />}
            />
            <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
            <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
