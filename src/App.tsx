import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import FacilityPage from './pages/FacilityPage';
import SubmitReview from './pages/SubmitReview';
import AddLocation from './pages/AddLocation';
import Auth from './pages/Auth';
import Terms from './pages/Terms';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/facility/:id" element={<FacilityPage />} />
                <Route path="/submit" element={<SubmitReview />} />
                <Route path="/add" element={<AddLocation />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/terms" element={<Terms />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
