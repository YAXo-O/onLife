import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Select from 'react-native-select-dropdown';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { withUser } from '../../../hooks/withUser';
import { TrainingProgramDay } from '../../../objects/program/TrainingProgram';
import { LocalActionCreators } from '../../../store/LocalState/ActionCreators';
import { Routes } from '../../../navigation';
import { formStyles } from '../../External/Auth/FormStyle';
import { IState } from '../../../store/IState';
import { CurrentTrainingDay } from '../../../store/Types';
import { LocalState } from '../../../store/LocalState/State';

interface FormValues {
	cycle?: number;
	day?: string;
}

interface SelectItem<T> {
	label: string;
	value: T;
}

const initialValues: FormValues = {
	cycle: undefined,
	day: undefined,
};

const schema = Yup.object().shape({
	cycle: Yup.number().required(),
	day: Yup.string().required(),
});

type DaySet = Record<number, Array<TrainingProgramDay>>;
type Props = NativeStackScreenProps<never>;

function getCycles(set: DaySet): Array<SelectItem<number>> {
	return Object.keys(set).map((key: string) => ({ label: `Цикл ${+key + 1}`, value: +key }));
}

function getDays(set: DaySet, cycle: number | undefined): Array<SelectItem<string>> {
	if (cycle === undefined || !set[cycle]) return [];

	return set[cycle].map((item: TrainingProgramDay) => ({ label: item.name, value: item.id }));
}

function getInitialValues(selection: LocalState<CurrentTrainingDay>): FormValues {
	return {
		cycle: selection.item?.cycle ?? undefined,
		day: selection.item?.day ?? undefined,
	};
}

export const TrainingSelect: React.FC<Props> = (props: Props) => {
	const user = withUser();
	const program = user.user?.trainingProgram;
	const selection = useSelector((state: IState) => state.training);
	const ref = React.useRef<Select>(null);
	const dispatch = useDispatch();

	if (program == null) {
		return (
			<View style={styles.container}>
				<View style={styles.card}>
					<Text style={styles.text}>
						На данный момент у вас нет доступных программ
					</Text>
				</View>
			</View>
		);
	}

	const data: DaySet = {};
	program.days.forEach((day: TrainingProgramDay) => {
		if (data[day.cycle] !== undefined) {
			data[day.cycle].push(day);
		} else {
			data[day.cycle] = [day];
		}
	});
	const cycles: Array<SelectItem<number>> = getCycles(data);

	return (
		<Formik
			initialValues={getInitialValues(selection)}
			validationSchema={schema}
			onSubmit={(selection) => {
				const creator = new LocalActionCreators<'training'>('training');
				dispatch(creator.set(selection));
				props.navigation.navigate(Routes.TrainingList);
			}}
		>
			{
				({ setFieldValue, setFieldTouched, values, handleSubmit }) => (
					<View style={styles.container}>
						<View style={styles.card}>
							<Select
								data={cycles}
								buttonTextAfterSelection={(item: SelectItem<number>) => item.label}
								rowTextForSelection={(item: SelectItem<number>) => item.label}
								onSelect={(value: SelectItem<number>) => {
									setFieldValue('cycle', value.value, false);
									setFieldValue('day', undefined, false);
									ref.current?.reset();
								}}
								onBlur={() => setFieldTouched('gender', true, true)}
								buttonStyle={styles.select}
								buttonTextStyle={styles.selectText}
								defaultButtonText="Выберите цикл"
								defaultValueByIndex={cycles.findIndex((item: SelectItem<number>) => item.value === selection.item?.cycle)}
							/>
							<Select
								data={getDays(data, values.cycle)}
								buttonTextAfterSelection={(item: SelectItem<string>) => item.label}
								rowTextForSelection={(item: SelectItem<string>) => item.label}
								onSelect={(value: SelectItem<string>) => setFieldValue('day', value.value, false)}
								onBlur={() => setFieldTouched('gender', true, true)}
								buttonStyle={styles.select}
								buttonTextStyle={styles.selectText}
								defaultButtonText="Выберите день"
								defaultValueByIndex={getDays(data, values.cycle).findIndex((item: SelectItem<string>) => item.value === selection.item?.day)}
								ref={ref}
							/>
						</View>
						<View style={styles.btnContainer}>
							<TouchableOpacity
								onPress={handleSubmit}
								style={formStyles.btn}
							>
								<Text style={formStyles.action}>
									Начать тренировку
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				)
			}
		</Formik>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
	},
	card: {
		borderRadius: 8,
		borderWidth: 2,
		borderStyle: 'solid',
		borderColor: 'rgba(220,220,220,0.15)',
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		padding: 4,
		margin: 8,
		minHeight: 64,
		flexDirection: 'column',
		justifyContent: 'center',
	},
	text: {
		textAlign: 'center',
	},
	row: {
		flexDirection: 'row',
		paddingHorizontal: 16,
	},
	center: {
		justifyContent: 'center',
	},
	action: {
		color: '#b8b8ff',
	},
	divider: {
		width: '100%',
		height: 1,
		borderBottomColor: 'rgba(220,220,220,0.15)',
		borderBottomStyle: 'solid',
		borderBottomWidth: 2,
	},
	select: {
		height: 36,
		width: '100%',
		padding: 4,
		backgroundColor: 'transparent',
	},
	selectText: {
		margin: 0,
		padding: 0,
		color: '#d0d0d0',
		fontSize: 14,
		lineHeight: 18,
	},
	btnContainer: {
		alignItems: 'center',
	},
});
