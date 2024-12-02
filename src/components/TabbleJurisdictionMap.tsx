import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Checkbox, Form, Input, Select, Table, Tag, Button, Dropdown, Space, Menu } from 'antd';
import { excelToJson } from '../utils/excelToJson';
import { DownOutlined } from "@ant-design/icons";
import { usejurisdictionStore } from '../store/store';
import { ColumnType } from "antd/es/table";


type FormInstance<T> = GetRef<typeof Form<T>>;
const EditableContext = React.createContext<FormInstance<any> | null>(null);
type ColumnTypes = Exclude<TableProps<Item>['columns'], undefined>;

interface JurisdictionData {

}

<style>
    {`
        .frozen-row {
            position: sticky;
            top: 0; /* Fix the first row at the top */
            z-index: 1; /* Ensure it stays above other rows */
            background: #f5f5f5; /* Optional: Add a background color for visibility */
        }
    `}
</style>

interface Column {
    title?: React.ReactNode,
    dataIndex?: string,
    width?: string,
    editable?: boolean,
    fixed?: string,
    render?: (value: any, record: Item, index: number) => React.ReactNode;
    key?: string,
    children?: Column[]
}

interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[{ required: true, message: `${title} is required.` }]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingInlineEnd: 24 }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};



export interface Item {
    [key: string]: any;
    key?: number;
    "Jurisdiction"?: string;
    Authority?: string


    'Jurisdiction types'?: string;
    Country?: string;
    Series?: string;
    'Effective From'?: string;
    'Through to'?: string;
    MCL_age?: string;
    'Caution Note'?: string;
    'MCL_exhc'?: string;
    'MCL_exhctype'?: string;
    'MCL_exhcage'?: string
    'MCL_exhcminage'?: string;
    MCL_exstd?: string;
    MCL_exstdtype?: string;
    MCL_exstdage?: string;
    MCL_exstdminage?: string;
    MCL_extest?: string;
    MCL_extestage?: string;
    MCL_extestminage?: string;
    MCL_extreat?: string;
    MCL_extreatage?: string;
    MCL_extreatminage?: string;
    MCL_expro?: string;
    MCL_exproage?: string;
    MCL_exprominage?: string;
    MCL_text?: string
}

interface CheckListOption {
    //[key: string]: string[] | undefined;
    options?: { name: string, key: string }[];
    checkOption?: string
}

interface MappingOption {
    [key: string]: CheckListOption | undefined;
    //  [key: string]: string[] | undefined;
    Jurisdiction: CheckListOption
    'Jurisdiction types'?: CheckListOption
}

const expectedHeaderNames =
{
    "Jurisdiction": {
        options: [
            { name: "Jurisdiction", key: "Jurisdiction" },
            { name: "Authority", key: "Authority" },
            { name: "Control", key: "Control" },
            { name: "Power", key: "Power" },
            { name: "Administration", key: "Administration" }
        ],
        checkOption: "Jurisdiction"
    },
    "Jurisdiction types": {
        options: [
            { name: "Jurisdiction t1", key: "Jurisdiction t1" },
            { name: "Jurisdiction t2", key: "Jurisdiction t2" },
            { name: "Jurisdiction t3", key: "Jurisdiction t3" },
            { name: "Jurisdiction t4", key: "Jurisdiction t4" },
            { name: "Jurisdiction t5", key: "Jurisdiction t5" }
        ],
        checkOption: "Jurisdiction t1"
    },
    "Country": {
        options: [
            { name: "Country -1", key: "Country -1" },
            { name: "Country -2", key: "Country -2" },
            { name: "Country -3", key: "Country -3" },
            { name: "Country -4", key: "Country -4" },
            { name: "Country -5", key: "Country -5" }
        ],
        checkOption: "Country -1"
    },
    "Series": {
        options: [
            { name: "Series-1", key: "Series-1" },
            { name: "Series-2", key: "Series-2" }
        ],
        checkOption: "Series-1"
    }
}




const Jurisdiction: React.FC<JurisdictionData> = ({ }) => {

    const [fileData, setFileData] = useState<unknown[]>([])
    const [columns, setColumns] = useState<Column[]>([])
    const [dataSource, setDataSource] = useState<Item[]>([])
    const [filteredData, setFilteredData] = useState<Item[]>([]);
    const [dropdownVisible, setDropdownVisible] = useState<Record<number, boolean>>({});
    const [mappingOptions, setColumnMappings] = useState<MappingOption>(expectedHeaderNames);
    const [currentHeaderDataIndex, setCurrentHeaderDataIndex] = useState<string>('')


    useEffect(() => {
        setFileColumn()

    }, [mappingOptions])

    const setFileColumn = () => {
        if (!fileData.length) return;

        const result: Item[] = [];
        let TempCol: Column[] = [];

        fileData.forEach((row, index) => {
            if (index === 4 && Array.isArray(row)) {
                TempCol = generateColumns(row);

                TempCol.push(
                    {
                        title: 'Action',
                        dataIndex: 'Action',
                        key: 'Action',
                        width: '10%',

                    })
                setColumns(TempCol);
            }

            if (index > 4 && Array.isArray(row)) {
                const rowData = processRowData(row, TempCol, index);
                result.push(rowData);
            }
        });

        setDataSource(result);
        setFilteredData(result);
    };

    /**
     * Generate columns with nested headers from the row data.
     * @param {any[]} row - The row containing column identifiers.
     * @returns {Column[]} - Array of column definitions.
     */
    const generateColumns = (row: any[]): Column[] => {
        const filteredRow = row.filter((item) => item !== "")
        return filteredRow.map((item, index) => {
            const title = Array.isArray(fileData[2]) ? fileData[2][index + 2] : "";
            const category = Array.isArray(fileData[3]) ? fileData[3][index + 2] : "";
            let childrenC = []
            if (title) {

                childrenC.push(createColumn(item))
                childrenC.push(createColumn(filteredRow[index + 1]))

            }


            if (title) {
                return {
                    title,
                    children: [

                        //   ...childrenC
                        {
                            title: category,
                            children: [

                                ...childrenC,
                            ],
                        },
                    ],
                };
            }

            //if(item.)
            if (item !== 'Caution Note') {
                return createColumn(item);
            }
            return {}
        });
    };

    const mapFilterDataAsOption = (dataIndex: string, value: string) => {
        setFilteredData((prev) =>
            prev.map((item) => {
                if (item.hasOwnProperty(dataIndex)) {
                    const newItem = { ...item }; // Clone the object to avoid direct mutation
                    (newItem as any)[value] = (item as any)[dataIndex]; // Assign new property
                    delete (newItem as any)[dataIndex]; // Remove old property
                    return newItem;
                }
                return item; // Return unchanged item if condition is not met
            })
        );
    };


    const handleColumnMapping = (dataIndex: string, value: string) => {
        setColumnMappings((prev) => ({
            ...prev,
            [dataIndex]: {
                ...prev[dataIndex],
                checkOption: value,
            },
        }));
        mapFilterDataAsOption(dataIndex, value)
        // setCurrentHeaderDataIndex(dataIndex)
    };


    const setHeaderTitle = (dataIndex: string) => {

        // const mappingOptions = dataSource.length > 0 ? Object.keys(dataSource[0]) : [];
        const options = mappingOptions[dataIndex]?.options;
        const checkedOption = mappingOptions[dataIndex]?.checkOption
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Select
                    style={{ width: '100%' }}
                    placeholder="Map column"
                    value={dataIndex} // Replace 'exampleColumn' with your column key
                    onChange={(value) => handleColumnMapping(dataIndex, value)} // Update column key accordingly

                    dropdownRender={(menu) => (

                        <div>
                            {options?.map((option) => (
                                <div key={option.key} style={{ padding: '8px 12px' }}>
                                    <Checkbox
                                        checked={mappingOptions[dataIndex]?.checkOption === option.key} // Update column key
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                handleColumnMapping(dataIndex, option.key); // Update column key
                                            }
                                        }}
                                    >
                                        {option.name}
                                    </Checkbox>
                                </div>
                            ))}
                        </div>
                    )
                    }
                />
            </div>
        );

    }

    /**
     * Creates a single column definition.
     * @param {string} dataIndex - The data index for the column.
     * @returns {Column} - The column definition.
     */
    const createColumn = (dataIndex: string): Column => ({
        dataIndex: dataIndex || "",
        width: "10%",
        editable: true,
        title: setHeaderTitle(dataIndex)
    });

    /**
     * Processes row data to map it to the appropriate columns.
     * @param {any[]} row - The row data.
     * @param {Column[]} TempCol - The column definitions.
     * @param {number} index - The current row index.
     * @returns {Record<string, any>} - The processed row data object.
     */
    const processRowData = (row: any[], TempCol: Column[], index: number): Record<string, any> => {
        const rowData: Record<string, any> = {};

        row.filter((_, i) => i > 1).forEach((rowCell, i) => {
            const dataIndex =
                TempCol[i]?.dataIndex ||
                TempCol[i]?.children?.[0]?.children?.[0]?.dataIndex;

            if (dataIndex) {
                rowData[dataIndex as string] =
                    typeof rowCell === "number"
                        ? convertExcelDateToJSDate(rowCell)
                        : rowCell;
            }
        });

        rowData.key = index;
        return rowData;
    };


    useEffect(() => {
        setFileColumn()
    }, [fileData])



    const handleDelete = (rec: Item) => {
        const deletedRowData = filteredData.filter((data) => data.key !== rec.key)
        setFilteredData(deletedRowData)
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const data = await excelToJson(file);
                const sheetData = data[Object.keys(data)[4]];
                setFileData(sheetData)
            } catch (error) {
                console.error('Error reading file:', error);
            }
        }
    };



    const convertExcelDateToJSDate = (excelDate: number): string => {
        const excelEpoch = new Date(1899, 11, 30);
        const jsDate = new Date(excelEpoch.getTime() + excelDate * 24 * 60 * 60 * 1000);
        const month = (jsDate.getMonth() + 1).toString().padStart(2, '0');
        const day = jsDate.getDate().toString().padStart(2, '0');
        const year = jsDate.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const handleSave = (row: Item) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
        setFilteredData(newData);
    };

    const handleValidateAndProceed = () => {
        console.log('Table Data:', dataSource);
        console.log('Column Mappings:');
    };


    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    interface CustomColumnType<T> extends ColumnType<T> {
        editable?: boolean;
        children?: CustomColumnType<T>[]; // Ensure children is typed as an array
    }
    type CustomColumnsType<T> = Array<CustomColumnType<T>>;

    const enhancedColumns = columns.map((col, index) => ({
        ...col,
        children: col.children
            ? col.children.map((child) => ({
                ...child,
                children: child.children
                    ? child.children.map((grandChild) => ({
                        ...grandChild,
                        onCell: (record: Item) => {
                            const cellValue = record[grandChild.dataIndex as keyof Item];
                            const isPipeValue = typeof cellValue === "string" && cellValue.includes("|");
                            return {
                                record,
                                editable: !isPipeValue && grandChild.editable,
                                dataIndex: grandChild.dataIndex,
                                title: grandChild.title,
                                handleSave

                            }
                        },
                        render: (text: string) => {
                            if (typeof text === "string" && text.includes("|")) {
                                const options = text.split("|");
                                return (
                                    <Select
                                        style={{ width: "100%" }}
                                        placeholder="Select an option"
                                        defaultValue={options[0]}
                                    >
                                        {options.map((option, i) => (
                                            <Select.Option key={i} value={option}>
                                                {option}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                );
                            }
                            return text;
                        },
                    }))
                    : undefined,
                onCell: (record: Item) => {
                    const cellValue = record[col.dataIndex as keyof Item];
                    const isPipeValue = typeof cellValue === "string" && cellValue.includes("|");
                    return {
                        record,
                        editable: !isPipeValue && child.editable,
                        dataIndex: child.dataIndex,
                        title: child.title,
                        handleSave,
                    }

                },
                render: (text: string) => {
                    if (typeof text === "string" && text.includes("|")) {
                        const options = text.split("|");
                        return (
                            <Select
                                style={{ width: "100%" }}
                                placeholder="Select an option"
                                defaultValue={options[0]}
                            >
                                {options.map((option, i) => (
                                    <Select.Option key={i} value={option}>
                                        {option}
                                    </Select.Option>
                                ))}
                            </Select>
                        );
                    }
                    return text;
                },
            }))
            : undefined,

        onCell: (record: Item) => {
            const { dataIndex, editable } = col; // Destructure column properties
            // if (dataIndex) {
            //     col.title = setHeaderTitle(dataIndex);
            // }

            const cellValue = record[col.dataIndex as keyof Item];
            const isPipeValue = typeof cellValue === "string" && cellValue.includes("|");

            return {
                record,
                editable: !isPipeValue && col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }

        },

        render: (text: string, record: Item,) => {

            if (col.dataIndex == "Action") {
                return (
                    <Space size="middle">
                        <Button
                            onClick={() => handleDelete(record)} // pass the record to handleDelete
                            type="link"
                            danger
                        >
                            Delete
                        </Button>
                    </Space>

                )

            }

            if (typeof text === "string" && text.includes("|")) {
                const options = text.split("|");
                return (
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Select an option"
                        defaultValue={options[0]}
                    >
                        {options.map((option, i) => (
                            <Select.Option key={i} value={option}>
                                {option}
                            </Select.Option>
                        ))}
                    </Select>
                );
            }
            return text;
        },

        // Fixed positioning for specific columns
        fixed:
            index === 0
                ? "left" // Freeze first column
                : col.dataIndex === "Action"
                    ? "right"
                    : undefined,
    }));

    // const enhanceColumn = (
    //     col: CustomColumnType<Item>,
    //     index: number
    // ): CustomColumnType<Item> => ({
    //     ...col,
    //     title: col.children ? undefined : setHeaderTitle(col.dataIndex as string),
    //     // Recursively process child columns
    //     children: col.children?.map((child, childIndex) =>
    //         enhanceColumn(child, childIndex)
    //     ),
    //     onCell: (record: Item) => {
    //         const { dataIndex, editable } = col;
    //         const cellValue = record[dataIndex as keyof Item];
    //         const isPipeValue =
    //             typeof cellValue === "string" && cellValue.includes("|");

    //         return {
    //             "data-record": JSON.stringify(record),
    //             "data-editable": !isPipeValue && editable ? "true" : "false",
    //             title: typeof col.title === "string" ? col.title : undefined,
    //         };
    //     },
    //     render: (text: string, record: Item) => {
    //         if (col.dataIndex === "Action") {
    //             return (
    //                 <Space size="middle">
    //                     <Button
    //                         onClick={() => handleDelete(record)}
    //                         type="link"
    //                         danger
    //                     >
    //                         Delete
    //                     </Button>
    //                 </Space>
    //             );
    //         }

    //         if (typeof text === "string" && text.includes("|")) {
    //             const options = text.split("|");
    //             return (
    //                 <Select
    //                     style={{ width: "100%" }}
    //                     placeholder="Select an option"
    //                     defaultValue={options[0]}
    //                 >
    //                     {options.map((option, i) => (
    //                         <Select.Option key={i} value={option}>
    //                             {option}
    //                         </Select.Option>
    //                     ))}
    //                 </Select>
    //             );
    //         }
    //         return text;
    //     },
    //     fixed:
    //         index === 38238
    //             ? "left"
    //             : col.dataIndex === "Action"
    //             ? "right"
    //             : undefined,
    // });

    // // Enhance all columns, including nested ones
    // const enhancedColumns: CustomColumnsType<Item> = columns.map((col, index) =>
    //     enhanceColumn(col as CustomColumnType<Item>, index)
    // );

    return (
        <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            <div><input type="file" accept=".xlsx, .xls, .xlsm" onChange={handleFileUpload} style={{ marginBottom: 16 }} /></div>
            <Table

                components={components}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={filteredData}
                columns={enhancedColumns as ColumnTypes}
                pagination={false}
                scroll={{ y: 'calc(100vh - 250px)', x: 150 * 60 }}  // ,x: 150 * 60 
                //sticky={{ offsetHeader: 0, offsetScroll: 0 }}
                sticky
                footer={() => (
                    <div style={{ textAlign: 'right', position: 'sticky', bottom: 0, background: '#fff', padding: '10px 0' }}>
                        <Button type="primary" onClick={handleValidateAndProceed}>
                            Validate and Proceed
                        </Button>
                    </div>
                )}
            />
        </div>
    )



}

export default Jurisdiction

