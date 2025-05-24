import React, {
	cloneElement,
	createRef,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
	type ForwardedRef,
	type ReactElement,
} from 'react';
import { type PropsWithChildren } from 'react';
import type { TValidationAPI } from '../_input/types/TValidationAPI';

const ValidationController = (props: PropsWithChildren, ref: ForwardedRef<TValidationAPI>) => {
	const [childs, setChilds] = useState<
		React.ReactElement<unknown, string | React.JSXElementConstructor<any>>[]
	>([]);
	const [refs, setRefs] = useState<React.RefObject<TValidationAPI | null>[]>([]);

	useEffect(() => {
		// Оборачиваем детей в массив
		const childrenArray = React.Children.toArray(props.children) as ReactElement[];

		// Создаем refs для каждого ребенка
		const childRefs = childrenArray.map(() => createRef<TValidationAPI>());

		// Обновляем детей, передавая им ref
		const childrenWithRef = childrenArray.map((child, index) =>
			cloneElement(child, { pupa: 'zalupa', ref: childRefs[index] } as any)
		);

		setChilds(() => childrenWithRef);
		setRefs(() => childRefs);
	}, []);

	useImperativeHandle(ref, () => {
		return {
			validate,
		};
	});

	/**
	 * Метод валиадции данных. Запускает валидацию у наследников, поддерживающих её.
	 */
	const validate = (): boolean => {
		const validataionResults = [];
		for (const child of refs) {
			if (child?.current?.validate) {
				validataionResults.push(child?.current?.validate());
			}
		}

		for (const res of validataionResults) {
			if (typeof res === 'string') {
				return false;
			}
		}

		return true;
	};

	return <div>{childs}</div>;
};

export default forwardRef(ValidationController);
