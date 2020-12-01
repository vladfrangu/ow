/**
Generates a useful stacktrace that points to the user's code where the error happened,
on platforms without the `Error.captureStackTrace` function present

@hidden
*/
export const generateStackTrace = () => {
	const stack = new RangeError('INTERNAL_OW_ERROR').stack!;

	return stack;
};
