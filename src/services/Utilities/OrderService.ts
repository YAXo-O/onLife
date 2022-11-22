import { WithOrder } from '@app/objects/utility/WithOrder';

/* We can only reorder array - so isReordable makes sense only for Arrays */
function isOrderable(item: unknown | Array<unknown>): item is Array<WithOrder> {
	if (typeof item !== 'object') return false;
	if (!Array.isArray(item)) return false;

	return item.reduce((acc: boolean, cur: unknown) => acc && isOrderable(cur) || (cur as WithOrder).order !== undefined, true);
}

export class OrderService {
	public static sortAscend(a: WithOrder, b: WithOrder): number {
		return a.order - b.order;
	}

	public static sortDescend(a: WithOrder, b: WithOrder): number {
		return b.order - a.order;
	}

	public static sort<TEntity extends WithOrder>(list: Array<TEntity>, maxDepth: number = 5): Array<TEntity> {
		return this._sort(list, maxDepth, 0);
	}

	public static reorder<TEntity extends WithOrder>(list: Array<TEntity>): Array<TEntity> {
		list.forEach((item: TEntity, order: number) => { item.order = order; });

		return list;
	}

	public static deepReorder<TEntity extends WithOrder>(list: Array<TEntity>, maxDepth: number = 5): Array<TEntity> {
		return this._deepReorder(list, maxDepth, 0);
	}

	/* Private section */
	private static _sort<TEntity extends WithOrder>(list: Array<TEntity>, maxDepth: number = 5, curDepth: number): Array<TEntity> {
		const sorted = list.sort(this.sortAscend);
		if (curDepth >= maxDepth) return sorted;

		sorted.forEach((item: WithOrder) => {
			Object.keys(item)
				.filter((key: string) => isOrderable(item[key as keyof (typeof item)]))
				.forEach((raw: string) => {
					const key = raw as keyof (typeof item);
					const value = item[key] as unknown as Array<WithOrder>;
					// eslint-disable-next-line
					// @ts-ignore
					item[key] = this._sort(value, maxDepth, curDepth + 1);
				});
		})

		return sorted;
	}


	private static _deepReorder<TEntity extends WithOrder>(list: Array<TEntity>, maxDepth: number, curDepth: number): Array<TEntity> {
		if (curDepth >= maxDepth) return this.reorder(list);

		const reordered = this.reorder(list);
		reordered.forEach((item: WithOrder) => {
			Object.keys(item).filter((key) => isOrderable(item[key as keyof (typeof item)])).forEach((key) => {
				// We've checked this prop on previous step
				const value = item[key as keyof (typeof item)] as unknown as Array<WithOrder>;
				// eslint-disable-next-line
				// @ts-ignore
				item[key as keyof (typeof item)] = this._deepReorder(value, maxDepth, curDepth + 1);
			});
		});

		return reordered;
	}
}
