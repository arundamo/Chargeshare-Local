import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { ProtectedRoute } from './components/layout/ProtectedRoute'

import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import ChargerDetailPage from './pages/ChargerDetailPage'
import SignUpPage from './pages/auth/SignUpPage'
import LoginPage from './pages/auth/LoginPage'
import HostOnboardingPage from './pages/host/HostOnboardingPage'
import HostDashboardPage from './pages/host/HostDashboardPage'
import DriverDashboardPage from './pages/driver/DriverDashboardPage'
import AdminPanelPage from './pages/admin/AdminPanelPage'
import TermsPage from './pages/static/TermsPage'
import PrivacyPage from './pages/static/PrivacyPage'
import SafetyPage from './pages/static/SafetyPage'

function NotFoundPage() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center text-center px-4">
      <div className="space-y-3">
        <p className="text-6xl font-bold text-gray-200 dark:text-gray-700">404</p>
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Page not found</p>
        <a href="/" className="text-emerald-600 hover:underline text-sm">Go home</a>
      </div>
    </div>
  )
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) return JSON.parse(saved)
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
          <Navbar darkMode={darkMode} toggleDark={() => setDarkMode(d => !d)} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/charger/:id" element={<ChargerDetailPage />} />
              <Route path="/auth/signup" element={<SignUpPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/host/onboarding" element={<HostOnboardingPage />} />
              <Route path="/host/dashboard" element={<ProtectedRoute><HostDashboardPage /></ProtectedRoute>} />
              <Route path="/driver/dashboard" element={<ProtectedRoute><DriverDashboardPage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPanelPage /></ProtectedRoute>} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/safety" element={<SafetyPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
