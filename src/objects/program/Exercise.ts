import { WithId } from '../utility/WithId';
import { ExerciseMuscle } from './ExerciseMuscle';

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

export interface Exercise extends WithId {
	name: string;
	details: string;
	description: string;

	image: string;
	schema: string;
	video: string;
	audio: string;

	properties: number;
	muscles: Array<ExerciseMuscle>;
}
