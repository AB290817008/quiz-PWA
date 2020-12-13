import React, { useState } from 'react';
import { QuestionCard } from './components/QCard';
import { fetchQuestions, Difficulty, QuestionState } from './API/Api';
import { GlobalStyle, Wrapper } from './Quiz.styles';
import { initNotification } from './services/firebaseService';
import firebase from 'firebase';
import { offlineDataType } from './services/quizCache';
import './App.css';

const TOTAL_QUESTIONS = 10;

type AnswerObject = {
	question: string;
	answer: string;
	correct: boolean;
	correctAnswer: string;
};

function App() {
	const [ loading, setLoading ] = useState(false);
	const [ questions, setQuestions ] = useState<QuestionState[]>([]);
	const [ number, setNumber ] = useState(0);
	const [ userAnswers, setUserAnswers ] = useState<AnswerObject[]>([]);
	const [ score, setScore ] = useState(0);
	const [ gameOver, setGameOver ] = useState(true);

	//Offline
	// var [ offlineQuiz, setOfflineQuiz ] = useState<offlineDataType[]>([]);
	var [ reqPermission, setReqPermission ] = useState('');

	const messaging = firebase.messaging();
	initNotification().then((perm) => {
		if (perm === 'granted') {
			setReqPermission('enabled');
			messaging
				.getToken()
				.then((currentToken) => {
					if (currentToken) {
						console.log('TOKEN');
						console.log(currentToken);
					} else {
						console.log('No Instance ID token available. Request permission to generate one.');
					}
				})
				.catch((error) => {
					console.log('An error occurred while retrieving token. ', error);
				});
		}
		if (perm === 'denied') {
			setReqPermission('disabled');
		}
	});

	const startQuiz = async () => {
		setLoading(true);
		setGameOver(false);
		const newQuestions = await fetchQuestions(TOTAL_QUESTIONS, Difficulty.EASY);
		setQuestions(newQuestions);
		setScore(0);
		setUserAnswers([]);
		setNumber(0);
		setLoading(false);
	};

	const nextQuestion = async () => {
		const nextQuestion = number + 1;
		if (nextQuestion === TOTAL_QUESTIONS) {
			setGameOver(true);
		} else {
			setNumber(nextQuestion);
		}
	};

	const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!gameOver) {
			const answer = e.currentTarget.value;

			const correct = questions[number].correct_answer === answer;

			if (correct) setScore((prev) => prev + 1);

			const answerObject = {
				question: questions[number].question,
				answer,
				correct,
				correctAnswer: questions[number].correct_answer
			};

			setUserAnswers((prev) => [ ...prev, answerObject ]);
		}
	};

	return (
		<div>
			<GlobalStyle />
			<Wrapper>
				<div>
					<p className="alerts"> {reqPermission ? 'Notifications: ' + reqPermission.toUpperCase() : ''}</p>
				</div>
				<h1>Simple Quiz App</h1>
				{gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
					<button className="start" onClick={startQuiz}>
						Begin Quiz
					</button>
				) : null}
				{!gameOver ? <p className="score">Your Score: {score}</p> : null}
				{loading ? <p>Loading</p> : null}
				{!loading && !gameOver ? (
					<QuestionCard
						questionNum={number + 1}
						totalQuestions={TOTAL_QUESTIONS}
						question={questions[number].question}
						answers={questions[number].answers}
						userAnswer={userAnswers ? userAnswers[number] : undefined}
						callback={checkAnswer}
					/>
				) : null}
				{!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
					<button className="next" onClick={nextQuestion}>
						Next
					</button>
				) : null}
			</Wrapper>
		</div>
	);
}

export default App;
