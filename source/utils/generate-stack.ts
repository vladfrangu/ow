import isNode from './node/is-node';

/**
Generates a useful stacktrace that points to the user's code where the error happened on platforms without the `Error.captureStackTrace()` method.

@hidden
*/
export const generateStackTrace = () => {
	let stack = new RangeError('INTERNAL_OW_ERROR').stack!;

	// If we're running in a Node.js environment without the `Error.captureStackTrace` function present
	// we slice this function from the stack.
	if (isNode) {
		stack = stack.split('\n').slice(2).join('\n');
	}

	return stack;
};
