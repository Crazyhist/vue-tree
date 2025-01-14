import { defineStore } from 'pinia'
import { mockTreeData } from '../mocks/mockTreeData'
import { Tree, type TreeItem } from '../service/Tree'

interface HistoryAction {
	type: 'add' | 'remove' | 'update'
	item: TreeItem
}
const defaultValue = () => {
	const treeStore = new Tree(mockTreeData)
	return {
		treeStore,
		history: [] as HistoryAction[],
		future: [] as HistoryAction[],
	}
}

export const useTreeStore = defineStore('treeStore', {
	state: defaultValue,
	actions: {
		initialize(items: TreeItem[]) {
			this.treeStore = new Tree(items)
		},

		addItem(item: TreeItem) {
			const newItem = { ...item }
			this.treeStore.addItem(newItem)
			this.history.push({ type: 'add', item: newItem })
			this.future = []
		},
		removeItem(id: number | string) {
			const item = this.treeStore.getItem(id)
			if (item) {
				const allChildren = this.treeStore.getAllChildren(id)
				allChildren.push(item)
				allChildren.forEach((child) =>
					this.history.push({ type: 'remove', item: structuredClone(child) })
				)
				this.treeStore.removeItem(id)
				this.future = []
			}
		},
		updateItem(updatedItem: TreeItem) {
			const existingItem = this.treeStore.getItem(updatedItem.id)
			if (existingItem) {
				const itemCopy = { ...existingItem }
				this.history.push({ type: 'update', item: itemCopy })
				this.treeStore.updateItem(updatedItem)
				this.future = []
			}
		},
		undo() {
			const action = this.history.pop()
			if (!action) return

			switch (action.type) {
				case 'add':
					this.treeStore.removeItem(action.item.id)
					break
				case 'remove':
					this.treeStore.addItem(action.item)
					break
				case 'update':
					this.treeStore.updateItem(action.item)
					break
			}

			this.future.push(action)
		},

		redo() {
			const action = this.future.pop()
			if (!action) return

			switch (action.type) {
				case 'add':
					this.treeStore.addItem(action.item)
					break
				case 'remove':
					this.treeStore.removeItem(action.item.id)
					break
				case 'update':
					this.treeStore.updateItem(action.item)
					break
			}

			this.history.push(action)
		},
		getAll(): TreeItem[] {
			return this.treeStore.getAll()
		},

		getItem(id: number | string): TreeItem | undefined {
			return this.treeStore.getItem(id)
		},

		getChildren(id: number | string): TreeItem[] {
			return this.treeStore.getChildren(id)
		},

		getAllChildren(id: number | string): TreeItem[] {
			return this.treeStore.getAllChildren(id)
		},

		getAllParents(id: number | string): TreeItem[] {
			return this.treeStore.getAllParents(id)
		},
	},
})
