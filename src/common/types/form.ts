import type { FormInst, FormItemRule } from 'naive-ui'

export type FormRef = FormInst | null
export interface FormModel {
  [key: string]: string | number | boolean | null | Array<any> | FormModel
}[]

export type FormRules = {
  [itemValidatePath: string]: FormItemRule | Array<FormItemRule> | FormRules
}

export interface FormSchema {
  label: string,
  model: string,
  type?: string | number | symbol | any,
  value: string | boolean | number | number[] | FormRef,
  component: string,
  attrs?: Recordable
}

