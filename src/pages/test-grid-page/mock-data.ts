import
{
    IDataResult,
    IFieldFilter,
    IPagination,
    ISortColumn,
} from '../../grid';
import { cloneData } from '../../grid/grid/util';

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

export function update(model: IData): IData
{
    const index = _data.findIndex(m => m.key === model.key);
    if (index < 0)
    {
        throw new Error(`Could not find data with key=${model.key}`);
    }

    const result = cloneData(model);
    _data[index] = result;
    return result;
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

    let data = cloneData(_data);
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

export function updateData(model: IData): IData
{
    const index = _data.findIndex(x => x.key === model.key);
    if (index < 0)
    {
        throw new Error(`could not find data with key '${model.key}'`);
    }
    _data[index] = model;
    return model;
}

export function addData(model: IData): IData
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
    const result: IData[] = [];
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
        });
    }
    return result;
}
