import { useSelector, useDispatch } from 'react-redux';
import { IState } from '@app/store/IState';
import { LocalActionCreators } from '@app/store/LocalState/ActionCreators';

interface Loader {
	loading: boolean;
	start: () => void;
	finish: () => void;
}

export function useLoader(): Loader {
	const state = useSelector((state: IState) => state.loading);
	const dispatch = useDispatch();
	const creator = new LocalActionCreators('loading');
	const start = () => dispatch(creator.set(true));
	const finish = () => dispatch(creator.set(false));

	return {
		loading: state?.item ?? false,
		start,
		finish,
	}
}
