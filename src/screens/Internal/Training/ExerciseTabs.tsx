import * as React from 'react';

import { TrainingExercise } from '@app/objects/training/TrainingExercise';
import { Nullable } from '@app/objects/utility/Nullable';
import { Training } from '@app/objects/training/Training';
import { TrainingTab } from '@app/screens/Internal/Training/TrainingTab';
import { MediaTab } from '@app/screens/Internal/Training/MediaTab';
import { MaterialTab } from '@app/screens/Internal/Training/MaterialTab';
import { StatsTab } from '@app/screens/Internal/Training/StatsTab';

export enum ExerciseTab {
	Training = 0,
	Video = 1,
	Material = 2,
	Stats = 3,
}

export interface ExerciseTabsProps {
	tab: ExerciseTab;
	item?: Nullable<TrainingExercise>;
	training?: Nullable<Training>;
	onComplete: () => void;
}

export const ExerciseTabs: React.FC<ExerciseTabsProps> = (props: ExerciseTabsProps) => {
	switch (props.tab) {
		case ExerciseTab.Training:
			return <TrainingTab training={props.training} item={props.item} onComplete={props.onComplete} />

		case ExerciseTab.Video:
			return <MediaTab training={props.training} item={props.item} />

		case ExerciseTab.Material:
			return <MaterialTab training={props.training} item={props.item} />

		case ExerciseTab.Stats:
			return <StatsTab training={props.training} item={props.item} />
	}
};
