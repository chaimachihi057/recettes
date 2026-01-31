import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createRecipe, getRecipe, updateRecipe } from '../api';
import { useAuth } from '../context/AuthContext';

export default function RecipeForm({ isEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [form, setForm] = useState({
    title: '',
    ingredientsText: '',
    instructions: '',
    coverImage: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        try {
          const data = await getRecipe(id);
          setForm({
            title: data.title || '',
            ingredientsText: Array.isArray(data.ingredients) ? data.ingredients.join(', ') : '',
            instructions: data.instructions || '',
            coverImage: data.coverImage || '',
          });
        } catch (err) {
          setError('Erreur de chargement de la recette');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [isEdit, id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const ingredientsArray = form.ingredientsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      title: form.title,
      ingredients: ingredientsArray,
      instructions: form.instructions,
      coverImage: form.coverImage,
    };

    try {
      if (isEdit) {
        await updateRecipe(id, payload, token);
        navigate(`/recipes/${id}`);
      } else {
        if (!user?.id) {
          setError('Vous devez être connecté pour créer une recette');
          return;
        }
        const created = await createRecipe({ ...payload, createdBy: user.id }, token);
        navigate(`/recipes/${created._id}`);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>{isEdit ? 'Modifier la recette' : 'Nouvelle recette'}</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 600 }}>
        <label>
          Titre
          <input name="title" value={form.title} onChange={onChange} required />
        </label>
        <label>
          Ingrédients (séparés par des virgules)
          <input name="ingredientsText" value={form.ingredientsText} onChange={onChange} required />
        </label>
        <label>
          Instructions
          <textarea name="instructions" rows={8} value={form.instructions} onChange={onChange} required />
        </label>
        <label>
          Image (URL)
          <input name="coverImage" value={form.coverImage} onChange={onChange} required />
        </label>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">{isEdit ? 'Enregistrer' : 'Créer'}</button>
      </form>
    </div>
  );
}