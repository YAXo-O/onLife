interface Palette {
	background: string;
	light: {
		gray: string;
		red: string;
	};
	regular: {
		red: string;
		green: string;
	},
	cyan: {
		'100': string;
		'90': string;
		'80': string;
		'70': string;
		'60': string;
		'50': string;
		'40': string;
		'30': string;
		'20': string;
		'0': string;
	},
	blue: {
		'50': string;
		'20': string;
		'0': string;
	},
	white: {
		'100': string;
		'90': string;
		'80': string;
		'70': string;
		'60': string;
		'50': string;
		'40': string;
		'20': string;
		'10': string;
		'0': string;
	};
}

export const palette: Palette = {
	background: '#F5F5F5',
	light: {
		gray: '#D6D6D6',
		red: '#FAA',
	},
	regular: {
		red: '#FF1A1A',
		green: '#88D026',
	},
	white: {
		'100': '#FFF',
		'90': '#FFFAFA',
		'80': '#F7F9FB',
		'70': '#E2E9F3',
		'60': '#DEE1E6',
		'50': '#D6D6D6',
		'40': '#D9D9D9',
		'20': '#AAA',
		'10': '#555',
		'0': '#000',
	},
	cyan: {
		'100': '#D7EBE9',
		'90': '#E3F0F1',
		'80': '#C8E1E4',
		'70': '#ACD1D6',
		'60': '#91C2C8',
		'50': '#75B3BA',
		'40': '#63CDDA',
		'30': '#3E949F',
		'20': '#228591',
		'0': '#2D857B',
	},
	blue: {
		'50': '#7188AC',
		'20': '#555F70',
		'0': '#112A50',
	},
};
