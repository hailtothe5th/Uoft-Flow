import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import SkipToContent from './components/SkipToContent';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const FacilityPage = lazy(() => import('./pages/FacilityPage'));
const SubmitReview = lazy(() => import('./pages/SubmitReview'));
const AddLocation = lazy(() => import('./pages/AddLocation'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const AccountChecker = lazy(() => import('./pages/AccountChecker'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const UpdatePassword = lazy(() => import('./pages/UpdatePassword'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const Terms = lazy(() => import('./pages/Terms'));
const DebugDatabase = lazy(() => import('./pages/DebugDatabase'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-4 card-shadow border border-blue-100 dark:border-slate-700 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <DataProvider>
            <SkipToContent />
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors">
              <Header />
              <main id="main-content" className="flex-1" tabIndex={-1}>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/facility/:id" element={<FacilityPage />} />
                  <Route path="/submit" element={<SubmitReview />} />
                  <Route path="/add" element={<AddLocation />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/check-account" element={<AccountChecker />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />                  <Route path="/update-password" element={<UpdatePassword />} />
                  <Route path="/change-password" element={<ChangePassword />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/debug" element={<DebugDatabase />} />
                </Routes>
              </Suspense>              </main>
              <Footer />
            </div>
          </DataProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
