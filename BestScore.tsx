import React, { useEffect, useState} from 'react';
import firestore from './firebase.js';
import { collection, addDoc } from 'firebase/firestore';

export default function BestScore({bestScore}: {bestScore: number}) {
    const [name, setName] = useState('');
    const [lastSubmit, setLastSubmit] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(true);

    useEffect(() => {
        if (lastSubmit !== bestScore) {
            setIsSubmitted(false);
            return;
        }
    }, [lastSubmit, bestScore]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(name);
        if (name === ''){
            alert('Please enter your name');
            return;
        }

        try {
            addDoc(collection(firestore, "highscores"), {
                name: name,
                highscore: bestScore
            });
            setLastSubmit(bestScore);
            setIsSubmitted(true);
            setName('');
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    return (
        <div>
            <p>Your best this session: {bestScore}</p>
            <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={32}placeholder="Your name here"/>
            <button type="submit" disabled={isSubmitted}>Submit</button>
            </form>
        </div>
    )
}

