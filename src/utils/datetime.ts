function fill(num: number, width: number = 2, filler: string = ''): string {
	const res = num.toString();
	const diff = width - res.length;

	if (diff <= 0) return res;

	return `${filler.repeat(diff)}${res}`;
}

export function format(date: number, format: string = 'dd/MM/yyyy'): string {
	const _date = new Date(date);
	const day = fill(_date.getDate(), 2, '0');
	const month = fill(_date.getMonth() + 1, 2, '0');
	const year = fill(_date.getFullYear(), 2, '0');

	return `${day}/${month}/${year}`;
}

// Cast from server-side date (seconds from epoch) to client-side Date
export function toDate(date: number): Date {
	return new Date(date * 1000)
}

// Cast from client-side date to server-side date (seconds from epoch)
export function fromDate(date: Date): number {
	return (+date) / 1000;
}

// Format seconds to minutes:seconds (for video and audio)
export function formatTime(time: number): string {
	if (time < 0) return '00:00';

	const value = Math.floor(time);
	const minutes = Math.floor(value / 60).toFixed(0).padStart(2, '0');
	const seconds = Math.floor(value % 60).toFixed(0).padStart(2, '0');

	return `${minutes}:${seconds}`;
}

// Current timestamp
export function now(): number {
	return +(new Date());
}
