import { ItemState, initState } from './ItemState/State';
import { User } from '../objects/User';

export interface IState {
	user: ItemState<User>;
}

export const initialState: IState = {
	user: initState<User>(),
};
