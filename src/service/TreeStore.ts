interface TreeItem {
	id: number | string
	parent: number | string | null
	label: string
}

class TreeStore {
	private items: TreeItem[]
	private itemsMap: Map<number | string, TreeItem>
	private childrenMap: Map<number | string, TreeItem[]>

	constructor(items: TreeItem[]) {
		this.items = items
		this.itemsMap = new Map()
		this.childrenMap = new Map()
		this.initializeMaps()
	}

	private initializeMaps(): void {
		this.items.forEach((item) => {
			this.itemsMap.set(item.id, item)

			if (item.parent !== null) {
				if (!this.childrenMap.has(item.parent)) {
					this.childrenMap.set(item.parent, [])
				}
				this.childrenMap.get(item.parent)!.push(item)
			}
		})
	}

	public getAll(): TreeItem[] {
		return [...this.items]
	}

	public getItem(id: number | string): TreeItem | undefined {
		return this.itemsMap.get(id)
	}

	public getChildren(id: number | string): TreeItem[] {
		return this.childrenMap.get(id) || []
	}

	public getAllChildren(id: number | string): TreeItem[] {
		const result: TreeItem[] = []
		const stack: TreeItem[] = [...this.getChildren(id)]

		while (stack.length > 0) {
			const current = stack.pop()!
			result.push(current)
			stack.push(...this.getChildren(current.id))
		}

		return result
	}

	public getAllParents(id: number | string): TreeItem[] {
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
		this.itemsMap.set(item.id, item)

		if (item.parent !== null) {
			if (!this.childrenMap.has(item.parent)) {
				this.childrenMap.set(item.parent, [])
			}
			this.childrenMap.get(item.parent)!.push(item)
		}
	}

	public removeItem(id: number | string): void {
		const item = this.itemsMap.get(id)
		if (!item) return

		const removeRecursively = (itemId: number | string) => {
			const children = this.getChildren(itemId)
			children.forEach((child) => removeRecursively(child.id))

			this.items = this.items.filter((it) => it.id !== itemId)
			this.itemsMap.delete(itemId)
			this.childrenMap.delete(itemId)
		}

		removeRecursively(id)

		if (item.parent !== null) {
			const siblings = this.childrenMap.get(item.parent)
			if (siblings) {
				this.childrenMap.set(
					item.parent,
					siblings.filter((child) => child.id !== id)
				)
			}
		}
	}

	public updateItem(updatedItem: TreeItem): void {
		const existingItem = this.itemsMap.get(updatedItem.id)
		if (!existingItem) return

		Object.assign(existingItem, updatedItem)
	}
}
