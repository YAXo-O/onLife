import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export enum Routes {
	AuthByPhone = 'AuthByPhone',
	AuthByLogin = 'AuthByLogin',
	Main = 'Main',
	TrainingView = 'TrainingView',
	TrainingList = 'TrainingList',
	Training = 'Training',
	ProfileMenu = 'ProfileMenu',
	ProfileDelete = 'ProfileDelete',
}

export const names: Record<Routes, string> = {
	[Routes.AuthByPhone]: 'Авторизация',
	[Routes.AuthByLogin]: 'Авторизация',
	[Routes.Main]: 'Основной экран',
	[Routes.TrainingView]: 'Тренировка',
	[Routes.TrainingList]: 'План Тренировка',
	[Routes.Training]: 'Тренировка',
	[Routes.ProfileMenu]: 'Личный кабинет',
	[Routes.ProfileDelete]: 'Удаление учётной записи',
}

/* Currently, all routes receive no params */
export type AppNavigationParams = Record<Routes, undefined>;

export type ExternalScreens = Routes.AuthByPhone | Routes.AuthByLogin;
export type InternalScreens = Exclude<Routes, ExternalScreens>;

export type ExternalScreenNavigationProps = NativeStackNavigationProp<AppNavigationParams, ExternalScreens>;
export type InternalScreenNavigationProps = NativeStackNavigationProp<AppNavigationParams, InternalScreens>;
export type CombinedScreenNavigationProps = NativeStackNavigationProp<AppNavigationParams, Routes>;

