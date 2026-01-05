import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Background Orbs */}
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>

            <Navbar />

            <main className="container" style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/expenses"
                  element={
                    <ProtectedRoute>
                      <Expenses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/budgets"
                  element={
                    <ProtectedRoute>
                      <Budgets />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
