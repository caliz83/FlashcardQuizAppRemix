import React, { useState, useEffect, useRef } from 'react';
// import FlashcardsList, { Flashcard } from './FlashcardsList';

interface Flashcard {
    id: number;
    question: string;
    answer: string;
    options: string[];
}

interface FlashcardProps {
    flashcards: Flashcard;
}

const Flashcards = ( {flashcards}: FlashcardProps ) => {

  const [flip, setFlip] = useState(false);
       
  return (
    <div onClick={() => setFlip(!flip)} className={`card ${flip ? 'flip' : ''}`} >
    <div className='front' >
        {flashcards.question}  
        <div className='flashcard-options'>
            {flashcards.options.map(option => (
                <div key={option} className='flashcard-option'>{option}</div>

            ))}            
            </div>    
    </div>
    <div className='back' >{flashcards.answer}</div>
    </div>
  )
}

export default Flashcards
