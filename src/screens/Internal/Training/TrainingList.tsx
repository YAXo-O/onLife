import * as React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

import { IState } from '../../../store/IState';
import { TrainingProgramDay, TrainingProgramDayExercise } from '../../../objects/program/TrainingProgram';
import { Nullable } from '../../../objects/utility/Nullable';
import { ExerciseCard } from '../../../components/cards/exercise/ExerciseCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<never>;

export const TrainingList: React.FC<Props> = (props: Props) => {
	const selection = useSelector((state: IState) => state.training);
	const user = useSelector((state: IState) => state.user);
	const day = React.useMemo<Nullable<TrainingProgramDay>>(() => {
		const day = selection.item?.day;
		if (day === null) return null;

		return user.item?.trainingProgram?.days.find((item: TrainingProgramDay) => item.id === day) ?? null;
	}, [user.item?.trainingProgram, selection.item?.day]);

	return (
		<View style={styles.container}>
			<ScrollView
				contentContainerStyle={{
					flexDirection: 'column',
					justifyContent: 'flex-start',
					paddingTop: 8,
					paddingBottom: 54,
				}}
			>
				<View style={styles.listContainer}>
					{
						day?.exercises?.map((item: TrainingProgramDayExercise, id: number) => (
							<ExerciseCard
								order={id}
								exercise={item}
								key={item.id}
								style={id > 0 ? styles.sibling : undefined}
							/>
						))
					}
				</View>
			</ScrollView>
			<View
				style={{
					flex: 1,
					position: 'absolute',
					backgroundColor: 'white',
					left: 0,
					right: 0,
					bottom: 0,
					paddingVertical: 8,
					maxHeight: 38,
				}}
			>
				<TouchableOpacity onPress={() => props.navigation.pop()}>
					<Text style={{ textAlign: 'center', color: 'blue' }}>
						Завершить тренировку
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	listContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		paddingHorizontal: 8,
	},
	sibling: {
		marginTop: 4,
	},
});
