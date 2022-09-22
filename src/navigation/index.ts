export enum Routes {
	SignIn = 'SignIn',
	SignUp = 'SignUp',
	TrainingSelect = 'TrainingSelect',
	TrainingList = 'TrainingList',
}

export const names: Record<Routes, string> = {
	[Routes.SignIn]: 'Авторизация',
	[Routes.SignUp]: 'Регистрация',
	[Routes.TrainingSelect]: 'Выбор тренировки',
	[Routes.TrainingList]: 'Тренировка',
}
