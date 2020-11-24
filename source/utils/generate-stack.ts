/**
Generates a useful stacktrace for your verification.

@hidden
*/
export const generateStackTrace = () => {
	const stack = new RangeError('INTERNAL_OW_ERROR').stack!.split('\n').slice(3).join('\n');

	return stack;
};
