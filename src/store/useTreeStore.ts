import { defineStore } from 'pinia'
import TreeStore, { type TreeItem } from '../service/TreeStore'
interface HistoryAction {
	type: 'add' | 'remove' | 'update'
	item: TreeItem
}
const defaultValue = () => ({
	treeStore: new TreeStore([] as TreeItem[]),
	history: [] as HistoryAction[],
	future: [] as HistoryAction[],
})

export const useTreeStore = defineStore('treeStore', {
	state: defaultValue,
	actions: {
		initialize(items: TreeItem[]) {
			this.treeStore = new TreeStore(items)
		},

		addItem(item: TreeItem) {
			this.treeStore.addItem(item)
			this.history.push({ type: 'add', item })
			this.future = []
		},
		removeItem(id: number | string) {
			const item = this.treeStore.getItem(id)
			if (item) {
				const allChildren = this.treeStore.getAllChildren(id)
				allChildren.push(item)
				allChildren.forEach((child) =>
					this.history.push({ type: 'remove', item: child })
				)
				this.treeStore.removeItem(id)
				this.future = []
			}
		},
		updateItem(updatedItem: TreeItem) {
			const existingItem = this.treeStore.getItem(updatedItem.id)
			if (existingItem) {
				this.history.push({ type: 'update', item: { ...existingItem } })
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
	},
	getters: {
		getAll: (state) => state.treeStore.getAll(),
		getItem: (state) => (id: number | string) => state.treeStore.getItem(id),
		getChildren: (state) => (id: number | string) =>
			state.treeStore.getChildren(id),
		getAllChildren: (state) => (id: number | string) =>
			state.treeStore.getAllChildren(id),
		getAllParents: (state) => (id: number | string) =>
			state.treeStore.getAllParents(id),
	},
})
