import { CrownOutlined } from "@ant-design/icons";
import { Result, Table, Tabs } from "antd";

const QuantriPage = () => {   
    return (
        <div >           
            <Tabs
                defaultActiveKey="1"
                items={[
                {
                    label: 'Trang admin EHC',
                    key: '1',
                    children: [ 
                        <Result
                            icon={<CrownOutlined />}
                            title="Trang quản trị dành cho IT"
                        >
                        </Result>
                    ],
                },{
                    label: 'Tạo nick bác sĩ',
                    key: '3',
                    children: [ 
                        <Table   
                                   
                        key="admin2"
                        />                       
                    ],
                },
                ]}
                />
        </div>
      
    )
}
export default QuantriPage;