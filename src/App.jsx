import './App.css';
import Game from './components/Game'
import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [foods, setFoods] = useState([{}])
  const [loading, setLoading] = useState(false);

  function getRandomInt(max) {
  return Math.floor(Math.random() * max);
  }

  function randomCuisine(arr) {
    return arr[getRandomInt(arr.length)];
  }

  function handleFoods(arr) {
    const updated = arr.slice(0, 20).map((food) => ({
      name: food.strMeal,
      src: food.strMealThumb,
      clicked: 0
    }))
    console.log(updated);
    setFoods(updated); 
  }

  let cuisine = ["American", "Italian", "British", "Jamaican"];
  useEffect(() => {
    async function fetchData () {
      const response = await fetch(`https://themealdb.com/api/json/v1/1/filter.php?a=${randomCuisine(cuisine)}`);
      const data = await response.json();
      setData(data);

      if (data.meals) {
      handleFoods(data.meals);
      }
    }
    fetchData();
  }, []);


  return (
    <>
    <div className="page-header">
      <h1>Food Memory Game</h1>
      <p>Click on each food card, but make sure not to click on it twice!</p>
    </div>
    <Game foods={foods}/>
    </>
  );
}

export default App
