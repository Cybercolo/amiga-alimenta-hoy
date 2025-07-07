
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Feed from './pages/Feed';
import PublicarComida from './pages/PublicarComida';
import MisReservas from './pages/MisReservas';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardEmpresas from './pages/DashboardEmpresas';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster"
import MessagingCenter from '@/components/MessagingCenter';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/publicar" element={<PublicarComida />} />
              <Route path="/mis-reservas" element={<MisReservas />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard-empresas" element={<DashboardEmpresas />} />
              <Route path="/mensajes" element={<MessagingCenter />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
