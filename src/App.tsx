import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../src/App.css";
import FlashcardsList from "./components/FlashcardsList";
import { Button } from "@chakra-ui/react";


export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  options: string[];
}

export interface Category {
  id: number;
  name: string;
}

export interface QuestionItem {
  correct_answer: string;
  incorrect_answers: string[];
  question: string;
}

const App = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const categoryElement = useRef<HTMLSelectElement | null>(null);
  const amountRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    axios.get("https://opentdb.com/api_category.php").then((response) => {
      setCategories(response.data.trivia_categories);
      console.log(response.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get("https://opentdb.com/api.php?amount=10")
      .then((response) => {
        setFlashcards(
          response.data.results.map((questionItem: QuestionItem, index: number) => {
            const answer = decodeWeirdness(questionItem.correct_answer);
            const options = [
              ...questionItem.incorrect_answers.map((a: string) =>
                decodeWeirdness(a)
              ),
              answer,
            ];
            return {
              id: `${index}-${Date.now()}`,
              question: decodeWeirdness(questionItem.question),
              answer: answer,
              options: options.sort(() => Math.random() - 0.5),
            };
          })
        );
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function decodeWeirdness(str: string): string {
    const textArea = document.createElement("textArea");
    textArea.innerHTML = str;
    return textArea.innerHTML;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    axios
      .get("https://opentdb.com/api.php", {
        params: {
          amount: amountRef.current?.value,
          category: categoryElement.current?.value,
        },
      })
      .then((response) => {
        setFlashcards(
          response.data.results.map((questionItem: QuestionItem, index: number) => {
            const correctAnswer = decodeWeirdness(questionItem.correct_answer);
            const options = questionItem.incorrect_answers.map(
                (a: string) => decodeWeirdness(a)
              );
            return {
              id: `${index}-${Date.now()}`,
              question: decodeWeirdness(questionItem.question),
              answer: correctAnswer,
              options: [...options, correctAnswer].sort(() => Math.random() - 0.5),
            };
          })
        );
      });
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="header">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select ref={categoryElement} id="category">
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Number of Questions</label>
          <input
            type="number"
            id="amount"
            min="1"
            step="1"
            defaultValue={10}
            ref={amountRef}
          />
        </div>
        <div className="form-group">
          <Button type="submit" className="btn">Go!</Button>
        </div>
      </form>
      <div className="container">
        <FlashcardsList flashcards={flashcards} />
      </div>
    </>
  );
};

const TestIt: Flashcard[] = [
  {
    id: 1,
    question: "What does a dog say?",
    answer: "woof",
    options: ["ello, guvnah", "woof", "neigh", "squeak"],
  },
  {
    id: 2,
    question: "What does a cat say?",
    answer: "meow",
    options: ["meow", "moo", "oink", "ungga ungga"],
  },
  {
    id: 3,
    question: "What does a lion say?",
    answer: "roar",
    options: ["yip", "To be or not to be", "roar", "quack"],
  },
];

export default App;
