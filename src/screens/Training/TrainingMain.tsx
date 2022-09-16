import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Select from 'react-native-select-dropdown';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { withUser } from '../../hooks/withUser';
import { TrainingProgramDay } from '../../objects/program/TrainingProgram';

interface OwnProps {
}

interface FormValues {
	cycle?: number;
	day?: number;
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
	day: Yup.number().required(),
});

type DaySet = Record<number, Array<TrainingProgramDay>>;

function getCycles(set: DaySet): Array<SelectItem<number>> {
	return Object.keys(set).map((key: string) => ({ label: `Цикл ${+key + 1}`, value: +key }));
}

function getDays(set: DaySet, cycle: number | undefined): Array<SelectItem<string>> {
	if (cycle === undefined || !set[cycle]) return [];

	return set[cycle].map((item: TrainingProgramDay) => ({ label: item.name, value: item.id }));
}

export const TrainingMain: React.FC<OwnProps> = (props: OwnProps) => {
	const user = withUser();
	const program = user.user?.trainingProgram;

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
			initialValues={initialValues}
			validationSchema={schema}
			onSubmit={({ day, cycle }) => console.log('Picked: ', day, cycle)}
		>
			{
				({ setFieldValue, setFieldTouched, values }) => (
					<View style={styles.container}>
						<View style={styles.card}>
							<Select
								data={cycles}
								buttonTextAfterSelection={(item: SelectItem<number>) => item.label}
								rowTextForSelection={(item: SelectItem<number>) => item.label}
								onSelect={(value: SelectItem<number>) => setFieldValue('cycle', value.value, false)}
								onBlur={() => setFieldTouched('gender', true, true)}
								buttonStyle={styles.select}
								buttonTextStyle={styles.selectText}
								defaultButtonText="Выберите цикл"
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
							/>
						</View>
					</View>
				)
			}
		</Formik>
	);
}

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
});
