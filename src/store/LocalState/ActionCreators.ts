import { IState } from '../IState';
import { LocalDispatchType, LocalActionType, SetLocalAction } from './Actions';

type GetState = () => IState;
type LocalThunk<T, TResult = void> = (dispatch: LocalDispatchType<T>, getState: GetState) => TResult;


export class LocalActionCreators<TStore extends keyof IState> {
	private readonly store: TStore;

	constructor(store: TStore) {
		this.store = store;
	}

	set<T>(item: T): LocalThunk<T> {
		const action: SetLocalAction<T> = {
			type: LocalActionType.Set,
			payload: item,
			store: this.store,
		};

		return (dispatch: LocalDispatchType<T>) => dispatch(action);
	}
}
