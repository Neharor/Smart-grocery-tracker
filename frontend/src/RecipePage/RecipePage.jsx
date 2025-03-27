import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RecipePage.css"; 

const RecipePage = () => {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post("http://localhost:5000/getRecipe");
        console.log(response);
        setRecipe(response.data.recipe); // 
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, []);

  return (
    <div className="recipe-page">
      <h1>Recipe Suggestions</h1>
      {isLoading ? (
        <p>Loading recipe...</p>
      ) : recipe ? (
        <div className="recipe-container">
          <h2 class="text">Suggested Recipe:</h2>
          <p>{recipe}</p> {}
        </div>
      ) : (
        <p>No recipe found as no items are expiring!</p>
      )}
    </div>
  );
};

export default RecipePage;
