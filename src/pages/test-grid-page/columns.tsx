import * as React from 'react';
import { IData as IMockData } from './mock-data';
import { CustomEditorExample } from './custom-editor-example';
import { Column, validate } from 'less-annoying-grid';

export const cols: Array<Column<IMockData>> = [
    {
        name: 'Key',
        field: 'key',
        type: 'data',
    },
    {
        name: 'Col 0',
        field: 'num',
        type: 'data',
        editable: { type: 'number', min: 0, max: 100, step: 5 },
        defaultValue: 50,
        validator: validate.validator(
            validate.min(10),
            validate.max(90),
            validate.required()
        ),
    },
    {
        name: 'Col 1',
        field: 'one',
        type: 'data',
        defaultValue: () => `n-${Math.round(Math.random() * 1000)}`,
        editable: {
            type: 'custom',
            editor: <CustomEditorExample field={'one'} />,
        },
        validator: validate.validator(
            validate.minLen(3),
            validate.maxLen(6),
            validate.required()
        ),
    },
    {
        name: 'Group 1',
        type: 'group',
        subColumns: [
            {
                name: 'Col 2',
                field: 'two',
                type: 'data',
            },
            {
                name: 'Col 3A',
                field: 'threeA',
                hidden: false,
                type: 'data',
            },
            {
                name: 'Col 3B',
                field: 'threeB',
                renderDisplay: m => <u>{m.threeB}</u>,
                type: 'data',
            },
            {
                name: 'Col 3C',
                field: 'threeC',
                renderDisplay: m => <u>3c-{m.threeB}</u>,
                type: 'data',
            },
        ],
    },
    {
        name: 'Col 4',
        field: 'four',
        hidden: false,
        type: 'data',
        editable: {
            type: 'values',
            subType: 'number',
            values: [
                { text: 'one', value: 1 },
                { text: 'two', value: 2 },
                { text: 'three', value: 3 },
                { text: 'four', value: 4 },
            ],
        },
    },
    {
        name: 'Col 5',
        field: 'five',
        sortable: true,
        type: 'data',
        editable: {
            type: 'values',
            subType: 'number',
            values: [1, 2, 3, 4].map(n =>
            {
                return { text: n.toString(), value: n };
            }),
        },
    },
    {
        name: 'Display (3B)',
        type: 'display',
        renderDisplay: m => <u>{m.threeB}</u>,
    },
    {
        type: 'action',
        name: 'actions',
        actions: [
            {
                type: 'delete',
                buttonContent: 'DEL',
                confirm: (m, _) =>
                {
                    return new Promise<boolean>(resolve =>
                    {
                        resolve(
                            window.confirm(
                                `Are you sure you would like to delete the row with Key=${m.key}`
                            )
                        );
                    });
                },
            },
            {
                type: 'edit',
                buttonContent: 'Edit',
            },
        ],
    },
    // {
    //     type: 'field',
    //     name: 'Field',
    //     field: 'otherField',
    //     editable: { type: 'text' },
    //     validator: validate.validator(validate.maxLen(10))
    // }
];
