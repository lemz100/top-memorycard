import { useEffect, useState } from "react";
import '../styles/Game.css'

export default function Game ({ foods }) {
    const [score, setScore] = useState(0);
    const [topScore, setTopScore] = useState(0);
    const [status, setStatus] = useState('');
    const [shuffledFoods, setShuffledFoods] = useState([]);
    const [clickedFoods, setClickedFoods] = useState(new Set());

    // Checks for win condition.
    useEffect(() => {
    if (clickedFoods.size === foods.length && foods.length > 0) {
        setStatus("win");
        }
    }, [clickedFoods, foods]);

    // Increments score only if game is still going.
    useEffect(() => {
        if ((status === "win" || status === "lose") || clickedFoods.size === 0) return;
        setScore(s => s+1);
    }, [clickedFoods, status, foods.length])

    // Sets shuffled food state on mount
    useEffect(() => {
    if (foods.length > 0) {
        setShuffledFoods(shuffleArray(foods));
    }}, [foods]);
    
    // Shuffles foods based on shuffledFoods state.
    useEffect(() => {
    setShuffledFoods(shuffleArray(shuffledFoods));
    }, [score]);

    // Sets top score and reset's score.
    // Also times out for smooth gameplay.
    useEffect(() => {
        if(status === "lose" || status === "win"){
            setScore(0);
            setTopScore(prev => Math.max(prev, score));
            setClickedFoods(new Set());
            
        const timeout = setTimeout(() => {
            setStatus('');
        }, 3000);
        return () => clearTimeout(timeout); // Cleanup
        }
    }, [status])

    // Shuffle array function for shuffling cards.
    function shuffleArray(array) {
        // Create array copy
        let arr = array.slice();

        for (let i = arr.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements arr[i] and arr[j]
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
    }

    // Click handler
    function handleFoodClick(foodName) {
        // Breaks function if game is over.
        if (status === "win" || status === "lose") return;

        // Updates clicked foods set with current food clicked.
        setClickedFoods(prev => {
            // Doesn't update set if food is already in it.
            if (prev.has(foodName)) {
                setStatus("lose");
                return prev;
            }
        
            // Updates set with food.
            const newSet = new Set(prev);
            newSet.add(foodName);
            return newSet;
        });
    }

    // Status bar component
    function StatusBar() {
        return (
            <div className="game-status">
                <span className="scores">
                    <p>Score: {score}</p>
                    <p>Top Score: {topScore}</p>
                </span>
                {status === "win" || status === "lose" ? 
                    <h1 className="status" style={{color: status === "win" ? 'green' : 'red'}}>You {status}!</h1> : null
                }
            </div>
        )
    }
    
    // Food card component
    function FoodCard({ name, src, handleFoodClick }) {

        return (
            <div className="food-card" onClick={() => handleFoodClick(name)}>
                <div className="food-image">
                    <img src={src} alt={name}/>
                </div>
                <span className="food-name">
                    <p>{name}</p>
                </span>
            </div>
        ) 
    }

    function MainGame() {
        return (
            <div className="main-game">
                {shuffledFoods.map((food, index) => {
                    return (
                        <FoodCard key={index} name={food.name} src={food.src} handleFoodClick={handleFoodClick}/>
                    )
                    })}
            </div>
        )
    }

    return (
        <div className="game-container">
            <StatusBar />
            <MainGame />
        </div>
    )
}