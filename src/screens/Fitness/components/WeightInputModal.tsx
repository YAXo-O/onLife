import React from 'react';

import { WeightInput } from '@app/screens/Fitness/components/subTabs/WeightInput';

interface WeightInput {
	name: string;
	value: number;
	onSubmit: (value: number) => void;
}

interface WeightInputModalProps {
	weightInput?: WeightInput | null;
	close: () => void;
}

export const WeightInputModal: React.VFC<WeightInputModalProps> = (props: WeightInputModalProps) => {
	const [value, setValue] = React.useState<number>(() => 0);

	React.useEffect(() => {
		if (props.weightInput) {
			setValue(props.weightInput.value);
		}
	}, [props.weightInput]);

	const onComplete = () => {
		if (props.weightInput) {
			props.weightInput.onSubmit(value);
		}
	};

	const setVisible = (visible: boolean) => {
		if (!visible) props.close();
	};

	return (
		<WeightInput
			value={value}
			onChange={setValue}
			onComplete={onComplete}

			caption={props.weightInput?.name}
			visible={Boolean(props.weightInput)}
			setVisible={setVisible}
		/>
	);
};
