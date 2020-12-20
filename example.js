'use strict';
const {default: ow} = require('./dist');

const logError = fn => {
	try {
		fn();
	} catch (error) {
		console.log(error.message);
	}
};

const fn = input => {
	ow(input, ow.string.minLength(10));
};

logError(() => {
	fn(10);
});

logError(() => {
	fn('foo');
});
