<template>
	<ag-grid-vue
		class="ag-theme-alpine"
		:rowData="rows"
		:columnDefs="columns"
		:treeData="true"
		:getDataPath="getDataPath"
		:autoGroupColumnDef="autoGroupColumn"
		:defaultColDef="defaultColDef"
		style="width: 100%; height: 100%"
	/>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTreeStore } from '../store/useTreeStore'

const treeStore = useTreeStore()

const rows = computed(() => treeStore.getAll())
const columns = ref([
	{ field: 'label', headerName: 'Label' },
	{ field: 'category', headerName: 'Category' },
])

const defaultColDef = { sortable: true, filter: true }
const autoGroupColumn = {
	headerName: 'Tree',
	cellRenderer: 'agGroupCellRenderer',
}

const getDataPath = (data) => data.path
</script>

<style>
@import 'ag-grid-community/styles/ag-grid.css';
@import 'ag-grid-community/styles/ag-theme-alpine.css';
</style>
