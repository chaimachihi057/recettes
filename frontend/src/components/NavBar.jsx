import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <Link className="brand nav-link" to="/recipes">Recettes</Link>
      <span className="grow" />
      {user ? (
        <>
          <span className="nav-link">Connecté: {user.email}</span>
          <Link className="nav-link" to="/recipes/new">Nouvelle recette</Link>
          <button className="btn btn-ghost" onClick={logout}>Se déconnecter</button>
        </>
      ) : (
        <>
          <Link className="nav-link" to="/login">Se connecter</Link>
          <Link className="nav-link" to="/register">Créer un compte</Link>
        </>
      )}
    </nav>
  );
}