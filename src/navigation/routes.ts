export enum Routes {
	Auth = 'Auth',
	Main = 'Main',
	TrainingSelect = 'TrainingSelect',
	TrainingList = 'TrainingList',
	Training = 'Training',
}

export const names: Record<Routes, string> = {
	[Routes.Auth]: 'Авторизация',
	[Routes.Main]: 'Основной экран',
	[Routes.TrainingSelect]: 'Выбор тренировки',
	[Routes.TrainingList]: 'Тренировка',
	[Routes.Training]: 'Тренировка',
}
