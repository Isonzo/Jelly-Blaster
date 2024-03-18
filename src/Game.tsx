import { useEffect } from 'react'
import Phaser from 'phaser'
import MainMenuScene from './MainMenu'
import PlayScene from './Play'
import CreditsScene from './Credits'

import eventsCenter from './EventsCenter'


function Game({ setScore }: { setScore: (score: number) => void }) {
    const gameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        pixelArt: true,
        scene: [MainMenuScene, PlayScene, CreditsScene],
    }

    let bestScore: number = 0

    const game = new Phaser.Game(gameConfig);

        eventsCenter.on('scoreUpdate', (score: number) => {
            if (score > bestScore) {
                bestScore = score
            }
            setScore(bestScore)
        })

    game.events.on('scoreUpdate', (score: number) => {
        setScore(score)
        console.log('Score: ' + score)
    })


    useEffect(() => {
        return () => {
            game.destroy(true)
        }
    }, [setScore])

    return <div id="game"></div>;
}

export default Game
