import React, { useState } from 'react';
import './octopus.scss';
import Game from './Game';
import HighScore from './HighScore';
import BestScore from './BestScore';

function App() {
    const [score, setScore] = useState(0);
  return (
    <div className="app">
        <h1>Jelly Blaster</h1>
        <h3>Controls: Space to swimp up, enter to shoot</h3>
        <p>Can also tap/click left part of screen to swim, and right part to shoot</p>
        <Game setScore={setScore} />
        <HighScore />
        <BestScore bestScore={score}/>
    </div>
  );
}

export default App;
