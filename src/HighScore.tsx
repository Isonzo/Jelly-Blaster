import React, { useEffect } from 'react';
import firestore from './firebase.js';
import { collection, query, orderBy, limit, onSnapshot} from 'firebase/firestore';

interface Scores {
    name: string;
    highscore: number;
}

export default function HighScore() {
    const [highScores, setHighScores] = React.useState<Scores[]>([]);

    useEffect(() => {
        const q = query(collection(firestore, "highscores"), orderBy("highscore", "desc"), limit(10));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const highScores: Scores[] = [];
            querySnapshot.forEach((doc) => {
                highScores.push(doc.data() as Scores);
            });
            setHighScores(highScores);
        })

        return () => unsubscribe();
    }, [])
    return (
        <div>
            <h2>High Scores</h2>
            <ul>
                {highScores.map((highScore, index) => <li key={index}>{highScore.name}: {highScore.highscore}</li>)}
            </ul>
        </div>
    )
}
