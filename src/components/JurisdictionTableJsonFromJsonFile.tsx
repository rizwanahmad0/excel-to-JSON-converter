import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Checkbox, Form, Input, Select, Table, Tag, Button, Dropdown, Space, Menu, Card } from 'antd';
import { excelToJson } from '../utils/excelToJson';
import { DownOutlined } from "@ant-design/icons";
import { usejurisdictionStore } from '../store/store';
import { ColumnType } from "antd/es/table";
import jsonData from '../Files/jurisdiction.json'


type FormInstance<T> = GetRef<typeof Form<T>>;
const EditableContext = React.createContext<FormInstance<any> | null>(null);


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
    render?: (value: any, record: data, index: number) => React.ReactNode;
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
    dataIndex: keyof data;
    record: data;
    handleSave: (record: data) => void;
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





export interface data {
    [key: string]: any;
    key?: number;

    jurisdiction: string | null;
    jurisdiction_types: string | null;
    country: string | null;
    series: string | null;
    effective_from: string | null;
    through_to: string | null;
    mcl_age: string | null;
    options_mcl_age: string[] | null;
    caution_note_mcl_age: string | null;
    mcl_exhc: string | null;
    options_mcl_exhc: string[] | null;
    caution_note_mcl_exhc: string | null;
    mcl_exhctype: string[] | null;
    options_mcl_exhctype: string[] | null;
    caution_note_mcl_exhctype: string | null;
    mcl_exhcage: string | null;
    options_mcl_exhcage: string[] | null;
    caution_note_mcl_exhcage: string | null;
    mcl_exhcminage: string | null;
    options_mcl_exhcminage: string[] | null;
    caution_note_mcl_exhcminage: string | null;
    mcl_exstd: string | null;
    options_mcl_exstd: string[] | null;
    caution_note_mcl_exstd: string | null;
    mcl_exstdtype: string[] | null;
    options_mcl_exstdtype: string[] | null;
    caution_note_mcl_exstdtype: string | null;
    mcl_exstdage: string | null;
    options_mcl_exstdage: string[] | null;
    caution_note_mcl_exstdage: string | null;
    mcl_exstdminage: string | null;
    options_mcl_exstdminage: string[] | null;
    caution_note_mcl_exstdminage: string | null;
    mcl_extest: string | null;
    options_mcl_extest: string[] | null;
    caution_note_mcl_extest: string | null;
    mcl_extestage: string | null;
    options_mcl_extestage: string[] | null;
    caution_note_mcl_extestage: string | null;
    mcl_extestminage: string | null;
    options_mcl_extestminage: string[] | null;
    caution_note_mcl_extestminage: string | null;
    mcl_extreat: string | null;
    options_mcl_extreat: string[] | null;
    caution_note_mcl_extreat: string | null;
    mcl_extreatage: string | null;
    options_mcl_extreatage: string[] | null;
    caution_note_mcl_extreatage: string | null;
    mcl_extreatminage: string | null;
    caution_note_mcl_extreatminage: string | null;
    mcl_expro: string | null;
    options_mcl_expro: string[] | null;
    caution_note_mcl_expro: string | null;
    mcl_exproage: string | null;
    options_mcl_exproage: string[] | null;
    caution_note_mcl_exproage: string | null;
    mcl_exprominage: string | null;
    caution_note_mcl_exprominage: string | null;
    mcl_text: string | null;
    caution_note_mcl_text: string | null;

}




interface header {
    title: string;
    children?: Column[]

}



interface SourceData {
    header?: header[];
    data?: data[];
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




const JurisdictionTableFromJson: React.FC<JurisdictionData> = ({ }) => {

    const [fileData, setFileData] = useState<unknown[]>([])
    const [columns, setColumns] = useState<Column[]>([])
    // const [dataSource, setDataSource] = useState<Item[]>([])
    // const [filteredData, setFilteredData] = useState<Item[]>([]);
    const [dropdownVisible, setDropdownVisible] = useState<Record<number, boolean>>({});
    const [mappingOptions, setColumnMappings] = useState<MappingOption>(expectedHeaderNames);
    const [currentHeaderDataIndex, setCurrentHeaderDataIndex] = useState<string>('')
    const [jsonDataSource, setJsonDataSource] = useState<SourceData>()
    const [headers, setHeaders] = useState<header[]>()
    const [data, setData] = useState<data[]>([])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const actionColumn = {
        title: '',
        children: [
            {
                title: 'Action',
                dataIndex: 'Action',
                key: 'Action',
                // width: '10%',
            }
        ]
    }


    useEffect(() => {
        // const updatedJsonData: SourceData = {
        //     ...jsonData,
        //     header: [
        //         ...(jsonData.header || []).map((column) => ({
        //             ...column,
        //             children: column.children
        //                 ? column.children.map((childrenColumn) => ({
        //                     ...childrenColumn,
        //                     title: setHeaderTitle(childrenColumn.title),
        //                 }))
        //                 : undefined,
        //         })),
        //         actionColumn,
        //     ],
        //     data: (jsonData.data || []).map((item, index) => ({
        //         ...item,
        //         key: index,
        //     })),
        // };

        // setJsonDataSource(updatedJsonData);


        const extractedHeaders = [
            ...(jsonData.header || []).map((column) => ({
                ...column,
                children: column.children
                    ? column.children.map((childrenColumn) => ({
                        ...childrenColumn,
                        title: setHeaderTitle(childrenColumn.title),
                    }))
                    : undefined,
            })),
            actionColumn,
        ]

        const extractedData = (jsonData.data || []).map((item, index) => ({
            ...item,
            key: index,
        }))

        setHeaders(extractedHeaders);
        setData(extractedData)

    }, []);



    const handleColumnMapping = (dataIndex: string, value: string) => {
        setColumnMappings((prev) => ({
            ...prev,
            [dataIndex]: {
                ...prev[dataIndex],
                checkOption: value,
            },
        }));

    };
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    const setHeaderTitle = (dataIndex: string | React.ReactNode) => {
        const stringIndex = typeof dataIndex === 'string' ? dataIndex : '';

        const options = mappingOptions[stringIndex]?.options;


        // <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        //     <Select
        //         style={{ width: '100%' }}
        //         placeholder="Map column"
        //         value={stringIndex}
        //         // onChange={(value) => handleColumnMapping(stringIndex, value)} // Update column key accordingly
        //         dropdownRender={(menu) => (
        //             <div>
        //                 {options?.map((option) => (
        //                     <div key={option.key} style={{ padding: '8px 12px' }}>
        //                         <Checkbox
        //                             checked={mappingOptions[stringIndex]?.checkOption === option.key} // Update column key
        //                             onChange={(e) => {
        //                                 if (e.target.checked) {
        //                                     handleColumnMapping(stringIndex, option.key); // Update column key
        //                                 }
        //                             }}
        //                         >
        //                             {option.name}
        //                         </Checkbox>
        //                     </div>
        //                 ))}
        //             </div>
        //         )}
        //     />
        // </div>

        const menu = (
            <Card style={{ padding: '10px', minWidth: '200px' }}>
                {options?.map((option) => (
                    <div key={option.key} style={{ padding: '4px 0' }}>
                        <Checkbox
                            onChange={(e) => {
                                if (e.target.checked) {
                                    handleColumnMapping('stringIndex', option.key); // Replace 'stringIndex' with your actual index
                                }
                            }}
                        >
                            {option.name}
                        </Checkbox>
                    </div>
                ))}
            </Card>
        );
    
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div>{stringIndex}</div>
                <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
                    <Button>
                        <DownOutlined />
                    </Button>
                </Dropdown>
            </div>
        );



    };



const handleDelete = (rec: data) => {

    const deletedRowData = data?.filter((data) => data.key !== rec.key);
    setData(deletedRowData)
};



const handleSave = (row: data) => {

    const newData = data.map((item) =>
        item.key === row.key ? { ...item, ...row } : item
    );

    setData(newData);

};


const handleValidateAndProceed = () => {
    console.log('Table Data:', data);
    console.log('Column Mappings:');
};


const components = {
    body: {
        row: EditableRow,
        cell: EditableCell,
    },
};


const isValidDate = (dateString: string): boolean => {
    const regex = /^([1-9]|0[1-9]|[12][0-9]|3[01])\/([1-9]|0[1-9]|1[0-2])\/\d{2}$/;
    return regex.test(dateString);
};

const formatDate = (dateString: string): string => {
    const dateParts = dateString.split('/');
    const day = dateParts[0].padStart(2, '0');
    const month = dateParts[1].padStart(2, '0');
    const year = `20${dateParts[2]}`;

    return `${day}/${month}/${year}`;
}

function setCellAsDeleteButton(record: data) {

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

function handleSelectChange(value: string, record: data, dataIndex: string, isCheckBox?: boolean) {

    if (isCheckBox) {
        record[dataIndex] = [...(record[dataIndex] || []), value];
    } else {
        record[dataIndex] = value
    }
    handleSave(record)
}


function setCellAsDropDown(text: string[], record: data, dataIndex: string) {
    return (
        <Select
            style={{ width: "100%" }}
            placeholder="Select an option"
            defaultValue={text[0]}
            onChange={(value) => handleSelectChange(value, record, dataIndex)}
        >
            {text.map((option, i) => (
                <Select.Option key={i} value={option}>
                    {option}
                </Select.Option>
            ))}
        </Select>
    )
}

function removeFromCheckBox(value: string, record: data, dataIndex: string, isCheckBox?: boolean) {
    if (!isCheckBox) {
        return
    }

    record[dataIndex] = (record[dataIndex] || []).filter((item: string) => item !== value);
    handleSave(record)
}


function setCellAsCheckBox(text: string[], record: data, dataIndex: string) {
    return (
        <Select
            style={{ width: "100%" }}
            placeholder="Select an option"
            defaultValue={text[0]}
            onChange={(value) => handleSelectChange(value, record, dataIndex, true)}
            dropdownRender={(menu) => (
                <div>
                    {text?.map((option, index) => (
                        <div key={index} style={{ padding: '8px 12px' }}>
                            <Checkbox
                                checked={(record[dataIndex] || []).includes(option)} // Update column key
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        handleSelectChange(option, record, dataIndex, true)
                                    }
                                    else {
                                        removeFromCheckBox(option, record, dataIndex, true)
                                    }
                                }}
                            >
                                {option}
                            </Checkbox>
                        </div>
                    ))}
                </div>
            )}
        >
        </Select>
    )
}




function setCellAsBin(text: string[], record: data, dataIndex: string) {

    const options = text
    return (
        <Select
            style={{ width: "100%" }}
            placeholder="Select an option"
            defaultValue={text[0]}
            onChange={(value) => handleSelectChange(value, record, dataIndex)}
        >
            {options.map((option, i) => (
                <Select.Option key={i} value={option}>
                    {option}
                </Select.Option>
            ))}
        </Select>

    )
}


function enhancedHeaders() {

    return headers?.map((col, index) => ({
        ...col,
        children: col.children ? col.children.map((child, childInd) => ({
            ...child,
            onCell: (record: data) => {
                const options = `options_${child.dataIndex}`
                const cellValue = record[child.dataIndex as keyof data];
                const isArray = Array.isArray(cellValue)
                const isHasOPtion = Array.isArray(record[options])
                const action = child.dataIndex === 'Action'
                return {
                    record,
                    editable: !isArray && !action && !isHasOPtion,
                    dataIndex: child.dataIndex,
                    title: child.title,
                    handleSave
                }
            },

            render: (text: string, record: data) => {
                const dataType = `type_${child.dataIndex}`
                const options = `options_${child.dataIndex}`

                if (child.dataIndex == "Action") {
                    return setCellAsDeleteButton(record)
                }

                if (Array.isArray(record[options]) && child.dataIndex) {
                    if (record[dataType] === 'BIN') {
                        return setCellAsBin(record[options], record, child.dataIndex)
                    }
                    if (record[dataType] === 'CAT-ME') {
                        return setCellAsDropDown(record[options], record, child.dataIndex)
                    }
                    if (record[dataType] === 'CAT-CA') {
                        return setCellAsCheckBox(record[options], record, child.dataIndex)
                    }

                }

                if (isValidDate(text)) {
                    return formatDate(text)
                }

                return text;
            },

            fixed: !index && !childInd ? 'left' : child.dataIndex === 'Action' ? 'right' : undefined

        }))
            : undefined,
    }));

}



return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
        <Table

            components={components}
            rowClassName={() => "editable-row"}
            bordered
            dataSource={data}
            columns={enhancedHeaders()}
            pagination={false}
            //virtual={true}
            scroll={{ y: 'calc(100vh - 250px)', x: 150 * 60 }}  // ,x: 150 * 60 
            // virtual
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

export default JurisdictionTableFromJson

