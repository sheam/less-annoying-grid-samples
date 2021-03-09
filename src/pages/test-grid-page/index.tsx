import * as React from 'react';
import
{
    Column,
    Grid,
    GridEditMode,
    IDataResult,
    IFieldFilter,
    IPagination,
    IProgress,
    ISortColumn,
    ISyncData,
    ISyncDataResult,
    SyncAction,
    useGridContext,
} from 'less-annoying-grid';
import
{
    addData,
    deleteData,
    getData as getMockData, getEditData,
    IData as IMockData,
    IDataEdit as IMockDataEdit,
    updateData,
} from './mock-data';
import './styles.css';
import { ToolBar } from './toolbar';
import { CustomEditorExample } from './custom-editor-example';
import { cols } from './columns';

const TestGrid: React.FunctionComponent = (): JSX.Element =>
{
    return (
        <div className="container">
            <Grid
                columns={cols}
                sortAscLabel="(ASC)"
                sortDescLabel="(DESC)"
                getDataAsync={getDataAsync}
                footer={{ initialPageSize: 20 }}
                renderRowDetail={detailTemplate}
                rowDetailButtonShowingContent="hide"
                rowDetailButtonHiddenContent="show"
                getLoadSingleState={(m: IMockData) => `loading ${m.key}`}
                getDetailModelAsync={getDetailDataAsync}
                editable={{
                    editMode: GridEditMode.external,
                    autoSave: true,
                    addToBottom: false,
                    getEditModelAsync: getEditDataAsync,
                    syncChanges: syncDataAsync,
                    modelTypeName: 'Product',
                }}
            >
                {{
                    toolbar: <ToolBar />,
                    emptyState: <i>no data</i>,
                    loadingState: <i>the data is loading</i>,
                    savingState: <SyncProgress />,
                }}
            </Grid>
        </div>
    );
};

export default TestGrid;

function detailTemplate(m: IMockDataEdit): JSX.Element
{
    return (
        <div>
            <div>
                <label>Num: </label>
                {m.num}
            </div>
            <div>
                <label>Key: </label>
                {m.key}
            </div>
            <div>
                <label>Detail Field: </label>
                {m.otherField}
            </div>
        </div>
    );
}



const SyncProgress: React.FunctionComponent = () =>
{
    const { editingContext } = useGridContext();
    const progress = editingContext?.syncProgress;
    if (!progress)
    {
        return null;
    }
    return (
        <div>
            <div>
                Syncing {progress.current} of {progress.total} (
                {Math.round((100 * progress.current) / progress.total)}%)
            </div>
            <small>{progress.message}</small>
        </div>
    );
};

function getDataAsync(
    pagination: IPagination | null,
    sort: ISortColumn | null,
    filters: IFieldFilter[]
): Promise<IDataResult<IMockData>>
{
    return new Promise<IDataResult<IMockData>>(resolve =>
    {
        const data = getMockData(pagination, sort, filters);
        setTimeout(() =>
        {
            resolve(data);
        }, 1000);
    });
}

function getDetailDataAsync(m: IMockData): Promise<IMockDataEdit>
{
    return new Promise<IMockDataEdit>(resolve =>
    {
        const result = getEditData(m);
        setTimeout(() =>
        {
            resolve(result);
        }, 2000);
    });
}

function getEditDataAsync(m: IMockData): Promise<IMockDataEdit>
{
    return new Promise<IMockDataEdit>(resolve =>
    {
        const result = getEditData(m);
        setTimeout(() =>
        {
            resolve(result);
        }, 2000);
    });
}

function syncDataAsync(
    changes: Array<ISyncData<IMockDataEdit>>,
    updateProgress: (
        p: IProgress,
        interimResults?: Array<ISyncDataResult<IMockData>>
    ) => void
): Promise<Array<ISyncDataResult<IMockData>>>
{
    return new Promise<Array<ISyncDataResult<IMockData>>>(resolve =>
    {
        const results: Array<ISyncDataResult<IMockData>> = [];
        let count = 0;
        for (let change of changes)
        {
            if (!change.model)
            {
                throw new Error('change should never be null');
            }

            let resultModel: IMockData | null;
            switch (change.syncAction)
            {
                case SyncAction.updated:
                    resultModel = updateData(change.model);
                    break;
                case SyncAction.added:
                    resultModel = addData(change.model);
                    break;
                case SyncAction.deleted:
                    deleteData(change.model);
                    resultModel = null;
                    break;
                default:
                    throw new Error(
                        `Syncing ${change.syncAction} not supported. Item key=${change.model.key}`
                    );
            }

            const syncResult: ISyncDataResult<IMockData> = {
                model: resultModel,
                syncAction: change.syncAction,
                rowId: change.rowId,
                success: true,
            };
            results.push(syncResult);

            count++;
            updateProgress(
                {
                    total: changes.length,
                    current: count,
                    message: `synced item with key ${change.model.key}`,
                },
                [syncResult]
            );
        }
        setTimeout(() => resolve(results), 1000);
    });
}
