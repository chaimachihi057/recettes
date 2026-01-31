import './App.css'

import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Recipes from './pages/Recipes.jsx'
import RecipeDetail from './pages/RecipeDetail.jsx'
import RecipeForm from './pages/RecipeForm.jsx'
import { useAuth } from './context/AuthContext.jsx'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Chargement...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/recipes" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/new" element={
          <ProtectedRoute>
            <RecipeForm isEdit={false} />
          </ProtectedRoute>
        } />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/recipes/:id/edit" element={
          <ProtectedRoute>
            <RecipeForm isEdit={true} />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App
