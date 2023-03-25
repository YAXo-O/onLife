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
