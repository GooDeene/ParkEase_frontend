import { useCallback, useState } from 'react';

/**
 * Кастомный хук, отслеживающий состояние выполняемой операции.
 * Дополнительно может отобразить сообщение в случае неудачи
 */
export const useLoading = () => {
	const [loading, setLoading] = useState(false);

	const runProcess = useCallback((promiseFn: Function) => {
		setLoading(true);

		// вызов функции, возвращающей промис
		return promiseFn()
			.then((result: unknown) => {
				setLoading(false);
				return result;
			})
			.catch((error: unknown) => {
				setLoading(false);
				throw error;
			});
	}, []);

	return { loading, runProcess };
};
