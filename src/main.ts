import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

import {
	ClientSideRowModelModule,
	ColumnAutoSizeModule,
	ModuleRegistry,
} from 'ag-grid-community'
import { TreeDataModule } from 'ag-grid-enterprise'

ModuleRegistry.registerModules([
	ClientSideRowModelModule,
	ColumnAutoSizeModule,
	TreeDataModule,
])
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

app.mount('#app')
