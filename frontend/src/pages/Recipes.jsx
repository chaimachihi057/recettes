import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteRecipe, getRecipes } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (err) {
      setError('Erreur de chargement des recettes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!confirm('Supprimer cette recette ?')) return;
    try {
      await deleteRecipe(id, token);
      await load();
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="container">
      <h2>Recettes</h2>
      {user && <Link className="btn btn-ghost" to="/recipes/new">+ Nouvelle recette</Link>}
      {loading && <div className="panel">Chargement...</div>}
      {error && <div className="alert">{error}</div>}
      {!loading && recipes.length === 0 && <div className="panel">Aucune recette</div>}
      <div className="grid">
        {recipes.map(r => (
          <div key={r._id} className="card">
            <h3><Link className="nav-link" to={`/recipes/${r._id}`}>{r.title}</Link></h3>
            {r.coverImage && <img src={r.coverImage} alt={r.title} style={{ maxWidth: 200 }} />}
            <div>Ingrédients: {Array.isArray(r.ingredients) ? r.ingredients.join(', ') : ''}</div>
            <div className="row" style={{ marginTop: 8 }}>
              <Link className="btn btn-ghost" to={`/recipes/${r._id}`}>Voir</Link>
              {user && (
                <>
                  <Link className="btn btn-primary" to={`/recipes/${r._id}/edit`}>Modifier</Link>
                  <button className="btn btn-ghost" onClick={() => onDelete(r._id)}>Supprimer</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}