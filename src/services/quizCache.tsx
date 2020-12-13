import { shuffleArray } from '../Utils/Utils';

export interface offlineDataType {
	question: string;
	answer: string;
	options: string[];
}

export interface offlineDataTypeProps {
	category: string;
	correct_answer: string;
	difficulty: string;
	incorrect_answers: string[];
	question: string;
	type: string;
}

export async function quizCache(): Promise<offlineDataType[]> {
	const difficulty = 'EASY';
	const amount = 10;

	const offlineQuizEndpoint = await fetch(
		`https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`
	);

	const cacheData = await offlineQuizEndpoint.json();

	return cacheData.results.map((result: offlineDataTypeProps) => {
		return {
			question: result.question,
			answer: result.correct_answer,
			options: shuffleArray(result.incorrect_answers.concat(result.correct_answer))
		};
	});
}
