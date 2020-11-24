const wrapStackTrace = (err: ArgumentError, stack: string) => `${err.name}: ${err.message}\n${stack}`;

/**
@hidden
*/
export class ArgumentError extends Error {
	readonly validationErrors: ReadonlyMap<string, string[]>;

	constructor(message: string, context: Function, stack: string, errors = new Map<string, string[]>()) {
		super(message);

		this.name = 'ArgumentError';

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, context);
		} else {
			this.stack = wrapStackTrace(this, stack);
		}

		this.validationErrors = errors;
	}
}