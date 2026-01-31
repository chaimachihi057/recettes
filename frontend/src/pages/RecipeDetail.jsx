import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipe } from '../api';
import { useAuth } from '../context/AuthContext';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const data = await getRecipe(id);
        setRecipe(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (!recipe) return <div>Recette introuvable</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>{recipe.title}</h2>
      {recipe.coverImage && <img src={recipe.coverImage} alt={recipe.title} style={{ maxWidth: 300 }} />}
      <h3>Ingrédients</h3>
      <ul>
        {Array.isArray(recipe.ingredients) && recipe.ingredients.map((ing, idx) => (
          <li key={idx}>{ing}</li>
        ))}
      </ul>
      <h3>Instructions</h3>
      <p style={{ whiteSpace: 'pre-wrap' }}>{recipe.instructions}</p>
      {user && <Link to={`/recipes/${recipe._id}/edit`}>Modifier</Link>}
    </div>
  );
}