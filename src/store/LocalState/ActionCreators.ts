import { IState } from '@app/store/IState';
import { LocalDispatchType, LocalActionType, SetLocalAction, ClearLocalAction } from '@app/store/LocalState/Actions';
import { ThunkAction } from 'redux-thunk';

type LocalThunk<TStore extends keyof IState> = ThunkAction<void, IState[TStore], never, SetLocalAction<IState[TStore]['item']>>;

export class LocalActionCreators<TStore extends keyof IState> {
	private readonly store: TStore;

	constructor(store: TStore) {
		this.store = store;
	}

	set(item: IState[TStore]['item']): LocalThunk<TStore> {
		const action: SetLocalAction<IState[TStore]['item']> = {
			type: LocalActionType.Set,
			payload: item,
			store: this.store,
		};

		return (dispatch: LocalDispatchType<TStore>) => dispatch(action);
	}

	clear(): LocalThunk<TStore> {
		const action: ClearLocalAction = {
			type: LocalActionType.Clear,
			store: this.store,
		};

		return (dispatch: LocalDispatchType<TStore>) => dispatch(action);
	}
}
