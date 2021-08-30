const red = 'RED';
const blue = 'BLUE';

const rows = [
	[ null, null, null, null, null, null, null ],
	[ null, null, null, null, null, null, null ],
	[ null, null, null, null, null, null, null ],
	[ null, null, null, red, null, null, red ],
	[ null, null, null, null, red, null, red ],
	[ null, null, null, null, null, red, red ],
	[ null, null, null, red, red, red, red ],
];

const RED_WIN = JSON.stringify([red, red, red, red]);
const BLUE_WIN = JSON.stringify([blue, blue, blue, blue]);
for (let i = 0 ; i < rows.length; i++) {
	const row = rows[i];
	for (let j = 0 ; j < row.length; j++) {
		if (JSON.stringify(row.slice(j, j + 4)) == RED_WIN) {
			console.log('Red Row Win');
		}
		if (JSON.stringify(row.slice(j, j + 4)) == BLUE_WIN) {
			console.log('Blue Row Win');
		}
		if (i + 3 < rows.length) {
			if (JSON.stringify([row[j], rows[i + 1][j + 1], rows[i + 2][j + 2], rows[i + 3][j + 3]]) == RED_WIN) {
				console.log('Red diagnal Win');
			}
			if (JSON.stringify([row[j], rows[i + 1][j], rows[i + 2][j], rows[i + 3][j]]) == RED_WIN) {
				console.log('Red column Win');
			}
			if (JSON.stringify([row[j], rows[i + 1][j], rows[i + 2][j], rows[i + 3][j]]) == BLUE_WIN) {
				console.log('Blue column Win');
			}
			if (JSON.stringify([row[j], rows[i + 1][j + 1], rows[i + 2][j + 2], rows[i + 3][j + 3]]) == BLUE_WIN) {
				console.log('Blue diagnal Win');
			}
		}
	}
}
