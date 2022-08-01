export enum Routes {
	SignIn = 'SignIn',
	SignUp = 'SignUp',
}

export const names: Record<Routes, string> = {
	[Routes.SignIn]: 'Авторизация',
	[Routes.SignUp]: 'Регистрация',
}
