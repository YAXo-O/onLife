export interface CurrentTraining {
	cycle: number;
	day: string;

	exercises: Array<CurrentTrainingExercise>;
}

export interface CurrentTrainingExercise {
	exerciseId: string;
	rounds:  Array<CurrentTrainingRound>;
}

export interface CurrentTrainingRound {
	roundId: string;
	weight: number;
	timestamp: number;
}
