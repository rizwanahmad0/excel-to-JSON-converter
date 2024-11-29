import React, { useState } from 'react';
import { Table, Button, Space } from 'antd';

interface TestComp{

}

interface Item {
    key: string;
    name: string;
  }


const TestComponent: React.FC<TestComp> = ({ }) => {
    const [dataSource, setDataSource] = useState<Item[]>([
        { key: '1', name: 'John' },
        { key: '2', name: 'Jane' },
        { key: '3', name: 'Jake' },
      ]);

    const handleDelete = (record: Item) => {
        const updatedDataSource = dataSource.filter(item => item.key !== record.key);
        setDataSource(updatedDataSource);
      };
    
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Action',
          dataIndex: 'Action',  // Add Action column correctly
          key: 'Action',
          width: '10%',
          render: (_: any, record: Item) => (
            <Space size="middle">
              <Button
                onClick={() => handleDelete(record)}  // Pass the record to handleDelete
                type="link"
                danger
              >
                Delete
              </Button>
            </Space>
          ),
        },
      ]

    return(
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey="key" />;

        </div>

    )


}

export default TestComponent