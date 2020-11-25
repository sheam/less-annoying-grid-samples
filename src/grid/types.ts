export interface IColumn<TModel extends object> {
    type: 'data';
    name: string;
    field?: string;
    hidden?: boolean;
    sortable?: boolean;
    editable?: ColumnEditorType;
    renderDisplay?: (model: TModel) => JSX.Element | string;
}

export interface IEditorText {
    type: 'text';
    maxLength?: number;
}

export interface IEditorNumber {
    type: 'number';
    min?: number;
    max?: number;
    step?: number;
}

export interface IEditorDate {
    type: 'date';
    startRange?: Date;
    endRange?: Date;
}

export interface IEditorValues {
    type: 'values';
    subType: 'text' | 'number';
    values: { text: string; value: any }[];
}

export type ColumnEditorType =
    | IEditorText
    | IEditorNumber
    | IEditorDate
    | IEditorValues;

export enum GridEditMode {
    inline = 'inline',
    row = 'row',
    external = 'external',
}

export interface IColumnGroup<TModel extends object> {
    type: 'group';
    name: string;
    hidden?: boolean;
    subColumns?: Array<IColumn<TModel>>;
}

export interface IActionColumn<TModel extends object> {
    type: 'action';
    name: string;
    hidden?: boolean;
    actions: Array<Action<TModel>>;
}

export interface IRowData {
    rowNumber: number;
    rowId: string;
    model: any;
    syncAction: SyncAction;
}

export enum SyncAction {
    unchanged = 'unchanged',
    added = 'added',
    updated = 'updated',
    deleted = 'deleted',
}

export interface IEditField {
    rowId: string;
    field: string;
}

export interface IActionEdit {
    type: 'edit';
    name?: string;
    buttonContent?: JSX.Element | string;
}

export interface IActionDelete<TModel extends object> {
    type: 'delete';
    name?: string;
    buttonContent?: JSX.Element | string;
    confirm?:
        | boolean
        | ((model: TModel, currentSyncAction: SyncAction) => Promise<boolean>);
}

export interface IActionCustom<TModel extends object> {
    type: 'custom';
    name?: string;
    buttonContent?: JSX.Element | string;
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

export type Column<TModel extends object> =
    | IColumn<TModel>
    | IColumnGroup<TModel>
    | IActionColumn<TModel>;

export interface IFieldFilter {
    field: string;
    value: string;
    operator: 'eq' | 'ne' | 'gt' | 'ge' | 'lt' | 'le' | 'contains';
}

export interface ISortColumn {
    field: string;
    direction: 'ASC' | 'DESC';
}

export interface IPagination {
    currentPage: number;
    pageSize: number;
}

export interface IDataResult<TModel extends object> {
    totalCount: number;
    data: TModel[];
}

export interface IDataState {
    totalCount: number;
    data: IRowData[];
}

export enum Direction {
    none = 'none',
    forward = 'forward',
    backward = 'backward',
}

export type Setter<TVal> = (v: TVal) => void;

export interface ISyncData<TModel extends object> {
    model: TModel | null;
    rowId: string;
    syncAction: SyncAction;
}

export interface ISyncDataResult<TModel extends object>
    extends ISyncData<TModel> {
    success: boolean;
    error?: string;
}

export interface IProgress {
    current: number;
    total: number;
    message?: string;
}

export interface IFooterProps {
    pageSizeOptions?: number[];
    initialPageSize?: number;
    numPageJumpButtons?: number;

    firstLabel?: string;
    lastLabel?: string;
    nextLabel?: string;
    prevLabel?: string;
    itemsName?: string;
}

export interface IGridProps<TModel extends object> {
    columns: Array<Column<TModel>>;
    footer?: IFooterProps;

    sortAscLabel?: JSX.Element | string;
    sortDescLabel?: JSX.Element | string;

    getDataAsync: (
        pagination: IPagination | null,
        sort: ISortColumn | null,
        filters: IFieldFilter[]
    ) => Promise<IDataResult<TModel>>;

    editable?: IGridEditConfig<TModel>;
}

export interface IGridEditConfig<TModel extends object> {
    editMode: GridEditMode;
    autoSave: boolean;
    addToBottom?: boolean;
    syncChanges: (
        changes: Array<ISyncData<TModel>>,
        updateProgress: (
            p: IProgress,
            interimResults?: Array<ISyncDataResult<TModel>>
        ) => void
    ) => Promise<Array<ISyncDataResult<TModel>>>;
}
