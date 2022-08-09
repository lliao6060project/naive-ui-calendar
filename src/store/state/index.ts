export interface TablePropsState {
  propsData: any,
  originTableData: any,
  originFormData: any,
  addDialogFormVisible: boolean
  detailDialogFormVisible: boolean
  editDialogFormVisible: boolean
  deleteDialogFormVisible: boolean
}

export interface State {
  tableProps: TablePropsState
}
