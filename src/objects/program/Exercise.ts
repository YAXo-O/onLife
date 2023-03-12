import { WithId } from '../utility/WithId';
import { ExerciseMuscle } from './ExerciseMuscle';
import { Nullable } from '@app/objects/utility/Nullable';

export enum ExerciseProperty {
	EPWeight = 1,
	EPRounds = 1 << 1,
	EPRepeats = 1 << 2,
	EPIntervals = 1 << 3,
}

export function hasProperty(property: number, value: ExerciseProperty): boolean {
	return !!(property & value);
}

export function toArray(properties: number): Array<ExerciseProperty> {
	const result = [];

	if (hasProperty(properties, ExerciseProperty.EPWeight)) result.push(ExerciseProperty.EPWeight);
	if (hasProperty(properties, ExerciseProperty.EPRounds)) result.push(ExerciseProperty.EPRounds);
	if (hasProperty(properties, ExerciseProperty.EPRepeats)) result.push(ExerciseProperty.EPRepeats);
	if (hasProperty(properties, ExerciseProperty.EPIntervals)) result.push(ExerciseProperty.EPIntervals);

	return result;
}

export interface OnlifeExercise extends WithId {
	name: string;
	details: string;
	description: string;

	image: Nullable<string>;
	schema: Nullable<string>;
	video: Nullable<string>;
	audio: Nullable<string>;

	properties: number;
	muscles: Array<ExerciseMuscle>;
}

export interface PowerTrainExercise extends WithId {
	name: string;
	intro: Nullable<string>;
	text: Nullable<string>;
	photo: Nullable<string>;
	scheme: Nullable<string>;
	video: {
		preview: string;
		url: string;
	};
	audio?: Nullable<string>;
}
