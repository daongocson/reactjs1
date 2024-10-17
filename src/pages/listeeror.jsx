import { Button, Input, Modal, notification, Table } from "antd";

import { useEffect, useState } from "react";
import { getLsErrorApi } from "../util/api";
import { UsergroupAddOutlined } from "@ant-design/icons";
const { Search } = Input;

const ListErorPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modaldata, setmodaldata] = useState([]);
    const keys  = ["TenBS","ndloi","MaKhoa","MaVP","TenDV"];    
    const [keyword, setKeyword] = useState('');
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
    useEffect(() => {   
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
              <Button type="primary" onClick={() => showModal(record)}>
                Xem
              </Button>
            ),
          },

    ];   
    const showModal = (record) => {
        console.log(record);
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
          
            />
              <Modal
                title="Chi tiết bệnh nhân"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>Mã VP: {modaldata.MaVP}</p>
                <p>Mã BN: {modaldata.MaBN}</p>
                <p>{modaldata.MaBS}</p>
                <p>{modaldata.TenBS}</p>
                <p>{modaldata.TenDV}</p>
                <p>{modaldata.ndloi}</p>
            </Modal>
            <>Total {dataSource.length} items</>
        </div>
    )
}

export default ListErorPage;