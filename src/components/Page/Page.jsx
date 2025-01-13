import "./Page.css";
import { useState, useEffect } from "react";    

import Footer from "./Footer/Footer";
import Card from "../Card/Card";

import thumbsUp from "../../assets/images/thumbs-up.svg";  
import thumbsDown from "../../assets/images/thumbs-down.svg";
import neutral from "../../assets/images/neutral.svg";
import clapping from "../../assets/images/clapping.svg";

import { retrieveFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage'
import { pickRandom, shuffleArray } from '../../utils/arrayMethods'
import { fetchCharacter } from "../../services/api";

export default function Page() {
    const [bestScore, setBestScore] = useState(0); 
    const [currentScore, setCurrentScore] = useState(0);    
    const [deck, setDeck] = useState([]);   
    const [nextDeckScore, setNextDeckScore] = useState(12);  
    const [showCardsFront, setShowCardsFront] = useState(false);
    const [currentEmojiPin, setCurrentEmojiPin] = useState(neutral);

    useEffect(() => {
        generateDeck();
    }, []);

    function generateDeck() {
        fetchCharacter().then((character) => {    
            setDeck(pickRandom(character, 12));
            setTimeout(() => {
                setShowCardsFront(true);
                setCurrentEmojiPin(neutral);
            }, 1000); 
        });
    }

    function shuffleDeck() {
        setDeck([...shuffleArray(deck)]);   
        setTimeout(() => {
            setShowCardsFront(true);
            setCurrentEmojiPin(neutral); 
        }, (100));   
    }

    function isDeckOver() {
        return currentScore === nextDeckScore - 1;
    }

    function resetGame() {
        let newBestScore = currentScore > bestScore ? currentScore : bestScore;
        saveToLocalStorage('bestScore', newBestScore);  

        setBestScore(newBestScore);
        setNextDeckScore(12);   
        setCurrentScore(0);
        setTimeout(() => {
            generateDeck();
        }, (500)); 
    }

    function loadNextDeck() {
        setNextDeckScore(nextDeckScore + 12);
        generateDeck();
        setCurrentEmojiPin(clapping);  
    }

    function handleClick(characterClickId) {
        setShowCardsFront(false);
        deck.map((character) => {   
            if(character.id === characterClickId) {
                if(character.isHit) {
                    setCurrentEmojiPin(thumbsDown);   
                    resetGame();
                    return; 
                }

                character.hit();
                setCurrentScore(currentScore + 1); 

                setCurrentEmojiPin(thumbsUp);  

                setTimeout(() => {
                    isDeckOver() ? loadNextDeck() : shuffleDeck();
                }, (300)); 
            }
        });
    }

    return (
        <>
          <main className='main'>
            <div className="score-panel">
              <div>
                <p>Score: {currentScore}</p>
                <p>Best Score: {bestScore}</p>
              </div>
              <img 
                className='emoji-pin'
                src={currentEmojiPin} 
                alt="emoji pin" 
              />
            </div>
            <div className='cards-container' data-show-front={showCardsFront}>
              {deck.map((character) =>
                <Card
                  key={character.id}
                  characterId={character.id}
                  characterName={character.name}
                  characterImage={character.images.sm}
                  onClick={() => handleClick(character.id)}
                />
              )}
            </div>
          </main>
          <Footer/>
        </>
      );
}