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
