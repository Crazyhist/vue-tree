<template>
	<div class="tree-table">
		<ag-grid-vue
			:rowData="rowData"
			:columnDefs="columnDefs"
			:defaultColDef="defaultColDef"
			:treeData="true"
			:getDataPath="getDataPath"
			:groupUseEntireRow="true"
			:autoGroupColumnDef="gridOptions.autoGroupColumnDef"
			rowSelection="single"
			style="width: 100%; height: 500px"
		></ag-grid-vue>
	</div>
</template>

<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import { computed } from 'vue'
import type { TreeItem } from '../service/Tree'
import { useTreeStore } from '../store/useTreeStore'

const treeStore = useTreeStore()

const gridOptions = {
	autoGroupColumnDef: {
		headerName: 'Group',
		cellRendererParams: { suppressCount: true },
	},
}
const columnDefs = [
	{ field: 'id', headerName: 'ID', width: 100 },
	{
		field: 'label',
		headerName: 'Категория',
		flex: 1,
		cellRenderer: (params: any) => {
			const depth = params.node.level
			let categoryName = ''

			if (depth === 0) {
				categoryName = 'Группа'
			} else if (depth === 1) {
				categoryName = 'Элемент'
			} else {
				categoryName = 'Подэлемент'
			}

			return `${categoryName}: ${params.value}`
		},
	},
	{ field: 'label', headerName: 'Наименование', flex: 1 },
]

const defaultColDef = {
	resizable: true,
	sortable: true,
}

const getDataPath = (data: TreeItem): string[] => {
	if (!data || !data.id || !data.label) {
		console.warn('Invalid data item:', data)
		return []
	}

	const path = treeStore
		.getAllParents(data.id)
		.map((item) => item.label)
		.concat(data.label)

	console.log(`Path for ID ${data.id}:`, path)
	return path
}

const rowData = computed(() => {
	const allData = treeStore.getAll()
	console.log('Row Data before rendering:', allData)
	return allData
})
</script>

<style scoped>
.tree-table {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
</style>
