import { Button, Input, Modal, notification, Table } from "antd";

import { useEffect, useState } from "react";
import { getLsErrorApi } from "../util/api";
import { EyeOutlined } from "@ant-design/icons";
import ModelView from "../components/module/ModelView";

const { Search } = Input;

const ListErorPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modaldata, setmodaldata] = useState([]);
    const keys  = ["TenBS","ndloi","MaKhoa","MaVP","TenDV"];    
    const [keyword, setKeyword] = useState('');    
    useEffect(() => {   
        const fetchUser = async () => {
            const res = await getLsErrorApi();
            if (!res?.message) {              
                setDataSource(res);               
            } else {
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                })
            }
        }
        fetchUser();        
    }, [])
    const onSearch = (value, _e, info) => console.log(info?.source, value);
  
    const columns = [
        {
            title: 'Mã VP',
            dataIndex: 'MaVP',
        },       
        {
            title: 'Nội dung lỗi',
            dataIndex: 'ndloi',
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'TenDV',
        },
        {
            title: 'Phòng',
            dataIndex: 'MaKhoa',
        },
        {
            title: 'Tên bác sĩ',
            dataIndex: 'TenBS',
        }, {
            title: 'Action',
            dataIndex: 'id',
            key: 'id',
            render: (index, record) => (
              <Button  icon={<EyeOutlined />} onClick={() => showModal(record)} />
            ),
          },

    ];   
    const showModal = (record) => {       
        setmodaldata(record);
        setIsModalVisible(true);
      };
      const handleOk = () => {
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {        
        setIsModalVisible(false);
      };
    const searchTable=(data)=>{      
        return data.filter(
            (item)=>(
                keys.some((key)=>item[key].toLowerCase().includes(keyword.toLowerCase())
            )));        
    }    
    return (       
        <div style={{ padding: 30 }}>      
            <div className="ant-col ant-col-xs-24 ant-col-xl-8">             
                    <Search
                    placeholder="Nhập nội dung"
                    allowClear
                    onChange={(event)=>setKeyword(event.target.value)}
                    onSearch={onSearch} enterButton 
                    style={{
                        width: "100%"                        
                    }}
                    />
                 
            </div>           
            <Table
                bordered
                dataSource={searchTable(dataSource)} columns={columns}
                defaultPageSize={30}         
                rowKey={"id"}
                pagination={{
                    defaultPageSize:"10" , 
                    defaultCurrent:"1",
                    total: dataSource.length, 
                    pageSizeOptions: ["10","50", "100", "150"],                   
                    showSizeChanger: true, locale: {items_per_page: ""} 
                   }}           
          
            />,
            <ModelView 
                open={isModalVisible}
                modaldata={modaldata}
                handleOk={handleOk}
                handleCancel={handleCancel}
            />
                 
            <>Total {dataSource.length} items</>
        </div>
    )
}
export default ListErorPage;