import { ElementOrString } from '../types-grid';
import { ISyncData, SyncAction } from '../types-sync';
import { AggregateValidator } from './validation';

export interface IDataColumn<TModel extends object> {
    type: 'data';
    name: string;
    field?: string;
    hidden?: boolean;
    sortable?: boolean;
    editable?: ColumnEditorType;
    renderDisplay?: (model: TModel) => ElementOrString;
    validator?: AggregateValidator;
}

interface IDisplayColumn<TModel extends object> {
    type: 'display';
    name: string;
    renderDisplay: (model: TModel) => ElementOrString;
}

interface IColumnGroup<TModel extends object> {
    type: 'group';
    name: string;
    hidden?: boolean;
    subColumns?: Array<IDataColumn<TModel>>;
}

export interface IActionColumn<TModel extends object> {
    type: 'action';
    name: string;
    hidden?: boolean;
    actions: Array<Action<TModel>>;
}

export type Column<TModel extends object> =
    | IDataColumn<TModel>
    | IColumnGroup<TModel>
    | IDisplayColumn<TModel>
    | IActionColumn<TModel>;

export type ActionOrDataCol<TModel extends object> =
    | IDataColumn<TModel>
    | IActionColumn<TModel>;

export interface IActionEdit {
    type: 'edit';
    name?: string;
    buttonContent?: ElementOrString;
}

export interface IActionDelete<TModel extends object> {
    type: 'delete';
    name?: string;
    buttonContent?: ElementOrString;
    confirm?:
        | boolean
        | ((model: TModel, currentSyncAction: SyncAction) => Promise<boolean>);
}

interface IActionCustom<TModel extends object> {
    type: 'custom';
    name?: string;
    buttonContent?: ElementOrString;
    handler: (
        data: TModel,
        rowId: string,
        currentSyncAction: SyncAction
    ) => Array<ISyncData<TModel>> | null;
}

export type Action<TModel extends object> =
    | IActionEdit
    | IActionDelete<TModel>
    | IActionCustom<TModel>;

interface IEditorText {
    type: 'text';
    maxLength?: number;
}

interface IEditorNumber {
    type: 'number';
    min?: number;
    max?: number;
    step?: number;
}

interface IEditorDate {
    type: 'date';
    startRange?: Date;
    endRange?: Date;
}

interface IEditorValues {
    type: 'values';
    subType: 'text' | 'number';
    values: { text: string; value: any }[];
}

export type ColumnEditorType =
    | IEditorText
    | IEditorNumber
    | IEditorDate
    | IEditorValues;