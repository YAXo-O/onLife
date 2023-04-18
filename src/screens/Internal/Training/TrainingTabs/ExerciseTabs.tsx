import * as React from 'react';

import { TrainingExercise } from '@app/objects/training/TrainingExercise';
import { Nullable } from '@app/objects/utility/Nullable';
import { TrainingTab } from '@app/screens/Internal/Training/TrainingTabs/TrainingTab';
import { MediaTab } from '@app/screens/Internal/Training/TrainingTabs/MediaTab';
import { MaterialTab } from '@app/screens/Internal/Training/TrainingTabs/MaterialTab';
import { StatsTab } from '@app/screens/Internal/Training/TrainingTabs/StatsTab';
import { OnlifeTraining } from '@app/objects/training/Training';

export enum ExerciseTab {
	Training = 0,
	Video = 1,
	Material = 2,
	Stats = 3,
}

export interface ExerciseTabsProps {
	tab: ExerciseTab;
	item?: Nullable<TrainingExercise>;
	training?: Nullable<OnlifeTraining>;
	onChange: (item: TrainingExercise) => void;
	disabled: boolean;
}

export const ExerciseTabs: React.FC<ExerciseTabsProps> = (props: ExerciseTabsProps) => {
	switch (props.tab) {
		case ExerciseTab.Training:
			return <TrainingTab item={props.item} onChange={props.onChange} disabled={props.disabled} />

		case ExerciseTab.Video:
			return <MediaTab item={props.item} />

		case ExerciseTab.Material:
			return <MaterialTab item={props.item} />

		case ExerciseTab.Stats:
			return <StatsTab training={props.training} item={props.item} />
	}
};
