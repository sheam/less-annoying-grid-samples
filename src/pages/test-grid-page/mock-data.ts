import
{
    IDataResult,
    IFieldFilter,
    IPagination,
    ISortColumn,
} from 'less-annoying-grid';

export interface IData
{
    num: number;
    one: string;
    two: string;
    threeA: string;
    threeB: string;
    four: number;
    five: number;
    key: number;
}

export interface IDataEdit
{
    num: number;
    one: string;
    two: string;
    threeA: string;
    threeB: string;
    four: number;
    five: number;
    key: number;
    otherField: string;
}

export function getEditData(m: IData): IDataEdit
{
    const model = _data.find(x => x.key === m.key);
    if (!model)
    {
        throw new Error('could not find edit data');
    }
    return model;
}

export function getData(
    pagination: IPagination | null,
    sort: ISortColumn | null,
    filters: IFieldFilter[]
): IDataResult<IData>
{
    console.log('getting data');

    const compare = (a: IData, b: IData): number =>
    {
        if (!sort) return 0;

        const aVal = (a as any)[sort.field].toString();
        const bVal = (b as any)[sort.field].toString();
        let compareResult = 0;
        if (aVal < bVal)
        {
            compareResult = -1;
        }
        if (aVal > bVal)
        {
            compareResult = 1;
        }
        if (sort.direction === 'DESC')
        {
            compareResult *= -1;
        }
        return compareResult;
    };

    const cloned = cloneData(_data);
    let data = cloned.map(x =>
    {
        const model = x as any;
        delete model.otherField;
        return model;
    });

    data = sort ? data.sort(compare) : data;

    if (filters)
    {
        for (const f of filters)
        {
            if (f.field === 'four' && f.operator === 'contains')
            {
                // eslint-disable-next-line eqeqeq
                data = data.filter(x => x.four == parseInt(f.value));
            }
        }
    }

    if (pagination)
    {
        const skip = (pagination.currentPage - 1) * pagination.pageSize;
        return {
            data: data.slice(skip, skip + pagination.pageSize),
            totalCount: data.length,
        };
    }
    return {
        data,
        totalCount: data.length,
    };
}

export function updateData(model: IDataEdit): IData
{
    const index = _data.findIndex(x => x.key === model.key);
    if (index < 0)
    {
        throw new Error(`could not find data with key '${model.key}'`);
    }
    _data[index] = model;
    return model;
}

export function addData(model: IDataEdit): IData
{
    model.key = _data.length + 1;
    _data.push(model);
    return model;
}

export function deleteData(model: IData)
{
    const index = _data.findIndex(x => x.key === model.key);
    if (index < 0)
    {
        throw new Error(`could not find data with key '${model.key}'`);
    }
    _data.splice(index, 1);
}

const _data = generateData(1000);
function generateData(n: number)
{
    const result: IDataEdit[] = [];
    for (let i = 0; i < n; i++)
    {
        const rowNum = i + 1;
        result.push({
            num: 100 + i,
            one: `n-${rowNum}`,
            two: `${rowNum}-2`,
            threeA: `${rowNum}-3a`,
            threeB: `${rowNum}-3b`,
            four: (i % 4) + 1,
            five: (i % 4) + 1,
            key: i + 1,
            otherField: `edit=${rowNum}`
        });
    }
    return result;
}

function cloneData<TModel>(model: TModel): TModel
{
    return JSON.parse(JSON.stringify(model));
}
