import type { TValidationResult } from './TValidationResult';

export type TValidator<T> = (value: T) => TValidationResult;
