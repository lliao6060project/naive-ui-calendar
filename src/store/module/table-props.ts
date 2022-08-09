import { defineStore } from 'pinia'
import { TablePropsState } from '../state'

const useTablePropsStore = defineStore('TableProps', {
  state: (): TablePropsState => ({
    propsData: [],
    originTableData: [],
    originFormData: {},
    addDialogFormVisible: false,
    detailDialogFormVisible: false,
    editDialogFormVisible: false,
    deleteDialogFormVisible: false,
  }),
  getters: {},
  actions: {
    updatePropsData(rowData: any) {
      this.propsData = rowData
    },
    updateOriginTableData(rowData: any) {
      this.originTableData = rowData
    },
    updateOriginFormData(rowData: any) {
      this.originFormData = rowData
    },
    //dialog
    toggleAddDialogFormVisible(bool: boolean) {
      this.addDialogFormVisible = bool
    },
    toggleDetailDialogFormVisible(bool: boolean) {
      this.detailDialogFormVisible = bool
    },
    toggleEditDialogFormVisible(bool: boolean) {
      this.editDialogFormVisible = bool
    },
    toggleDeleteDialogFormVisible(bool: boolean) {
      this.deleteDialogFormVisible = bool
    },
  },
})

export default useTablePropsStore
