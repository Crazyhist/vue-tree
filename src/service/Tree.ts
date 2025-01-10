export type TreeItemId = number | string

export interface TreeItem {
	id: TreeItemId
	parent: TreeItemId | null
	label: string
}

export default class Tree {
	private items: TreeItem[]

	constructor(items: TreeItem[]) {
		this.items = items
	}

	private get childrenMap(): Map<TreeItemId, TreeItem[]> {
		const map = new Map<TreeItemId, TreeItem[]>()

		this.items.forEach((item) => {
			if (item.parent !== null) {
				if (!map.has(item.parent)) {
					map.set(item.parent, [])
				}
				map.get(item.parent)?.push(item)
			}
		})
		return map
	}

	public getAll(): TreeItem[] {
		return [...this.items]
	}

	public getItem(id: TreeItemId): TreeItem | undefined {
		const stack: TreeItem[] = [...this.items]

		while (stack.length > 0) {
			const current = stack.pop()!
			if (current.id === id) return current
			stack.push(...this.getChildren(current.id))
		}
		return undefined
	}

	public getChildren(id: TreeItemId): TreeItem[] {
		return this.childrenMap.get(id) || []
	}

	public getAllChildren(id: TreeItemId): TreeItem[] {
		const result: TreeItem[] = []
		const stack: TreeItem[] = [...this.getChildren(id)]

		while (stack.length > 0) {
			const current = stack.pop()!
			result.push(current)
			stack.push(...this.getChildren(current.id))
		}
		return result
	}

	public getAllParents(id: TreeItemId): TreeItem[] {
		const result: TreeItem[] = []
		let current = this.getItem(id)

		while (current && current.parent !== null) {
			const parent = this.getItem(current.parent)
			if (parent) {
				result.push(parent)
			}
			current = parent
		}
		return result.reverse()
	}

	public addItem(item: TreeItem): void {
		this.items.push(item)
	}

	public removeItem(id: TreeItemId): void {
		const removeRecursively = (itemId: TreeItemId) => {
			const children = this.getChildren(itemId)
			children.forEach((child) => removeRecursively(child.id))
			this.items = this.items.filter((it) => it.id !== itemId)
		}

		removeRecursively(id)
	}

	public updateItem(updatedItem: TreeItem): void {
		const existingItem = this.getItem(updatedItem.id)
		if (!existingItem) return

		Object.assign(existingItem, updatedItem)
	}
}
