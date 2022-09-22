export function getRandomName(length: number): string {
	const abc = 'abcdefghijklmnopqrstuvwxyz ';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += abc[Math.floor(Math.random() * abc.length)];
	}

	return result;
}
