import {ArgumentError} from '../argument-error';
import {BasePredicate, testSymbol} from './base-predicate';
import {PredicateOptions} from './predicate';
import {Main} from '..';

const generatePredicateMessage = (errors: Map<string, string[]>) => {
	// If we have one item, return all it's errors
	if (errors.size === 1) {
		const array: string[] = errors.values().next().value;
		return `Any predicate failed with the following errors:\n- ${array.join('\n- ')}`;
	}

	const errorArray = [...errors.values()];

	const anyErrorWithoutOneItemOnly = errorArray.some(array => array.length !== 1);
	// If there's any error with more than one item, tell users to check `validationErrors` property
	if (anyErrorWithoutOneItemOnly) {
		return 'Any predicate failed. Please check the `validationErrors` property for more information';
	}

	// All errors here have just one issue, report them as normal
	return `Any predicate failed with the following errors:\n- ${errorArray.map(([item]) => item).join('\n- ')}`;
};

/**
@hidden
*/
export class AnyPredicate<T = unknown> implements BasePredicate<T> {
	constructor(
		private readonly predicates: BasePredicate[],
		private readonly options: PredicateOptions = {}
	) {}

	[testSymbol](value: T, main: Main, label: string | Function, stack: string): asserts value {
		const errors = new Map<string, string[]>();

		for (const predicate of this.predicates) {
			try {
				main(value, label, predicate, stack);
				return;
			} catch (error: unknown) {
				if (value === undefined && this.options.optional === true) {
					return;
				}

				// If we received an ArgumentError
				if (error instanceof ArgumentError) {
					// Iterate through every error reported
					for (const [key, value] of error.validationErrors.entries()) {
						// Get the current errors set, if any
						const alreadyPresent = errors.get(key);

						// If they are present already, create a unique set with both current and new values
						if (alreadyPresent) {
							errors.set(key, [...new Set([...alreadyPresent, ...value])]);
						} else {
							// Add the errors found as is to the map
							errors.set(key, value);
						}
					}
				}
			}
		}

		// Generate the `error.message` property
		const message = generatePredicateMessage(errors);

		throw new ArgumentError(
			message,
			main,
			stack,
			errors
		);
	}
}
