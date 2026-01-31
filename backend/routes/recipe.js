const express = require("express");
const router = require("express").Router();
const Recipe = require("../models/RecipeSchema");

// GET all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipes", error: error.message });
  }
});

// POST new recipe
router.post("/", (req, res) => {
  const { title, ingredients, instructions, coverImage, createdBy } = req.body;

  if (!title || !ingredients || !instructions || !coverImage || !createdBy) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newRecipe = new Recipe({
    title,
    ingredients,
    instructions,
    coverImage,
    createdBy,
  });

  newRecipe
    .save()
    .then((recipe) => res.status(201).json(recipe))
    .catch((err) =>
      res.status(500).json({ message: "Error creating recipe", error: err.message })
    );
});

// GET one recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipe", error: error.message });
  }
});

// UPDATE recipe by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, ingredients, instructions, coverImage } = req.body;

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { title, ingredients, instructions, coverImage },
      { new: true, runValidators: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: "Error updating recipe", error: error.message });
  }
});

// DELETE recipe by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting recipe", error: error.message });
  }
});

module.exports = router;
