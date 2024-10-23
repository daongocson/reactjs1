import { Button, Form, Input, Modal, notification, Table } from "antd";

import { useEffect, useState } from "react";
import { getYcsuaApi, postduyetycApi } from "../util/api";
import { EyeOutlined, SignatureOutlined } from "@ant-design/icons";
import ModelView from "../components/module/ModelView";
import { CollectionsPage2 } from "../components/module/CreateFormModal";
import Duyeths from "../components/module/Duyeths";

const { Search } = Input;

const YCsuahosoPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [idyc, setIdyc] = useState('');
    const [form] = Form.useForm();
    const keys  = ["dichvu","yeucau","tenbn","nguoiyc"];    
    const [keyword, setKeyword] = useState('');
    const fetchYC = async () => {
        const res = await getYcsuaApi();
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
        fetchYC();        
    }, [])
    const onSearch = (value, _e, info) => {
        fetchYC();
        //console.log(info?.source, value);
    }
  
    const columns = [
        {
            title: 'Tên bệnh nhân',
            dataIndex: 'tenbn',
        },              
        {
            title: 'Dịch vụ',
            dataIndex: 'dichvu',
        },
        {
            title: 'Yêu cầu',
            dataIndex: 'yeucau',
        },
        {
            title: 'Ngày ra viện',
            dataIndex: 'ngayrv',
        },{
            title: 'Ngày Yc',
            dataIndex: 'nyc',
        },{
            title: 'Người Yc',
            dataIndex: 'nguoiyc',
        },{
            title: 'Phòng',
            dataIndex: 'phongrv',
        },{
            title: 'Xử lý',
            dataIndex: 'phongth',
        },{
            title: 'Duyệt',
            dataIndex: 'id',
            key: 'id',
            render: (index, record) => (
              <Button  icon={<SignatureOutlined />} onClick={() => showModal(record)} />
            )
          },
          
    ]; 
    const onCreate = async (data) =>{
        const res = await postduyetycApi(data);  
        if (res && res.message=="sucess") {      
            fetchYC();         
            notification.success({
             message: "Duyệt YC thành công",
             description: res.message
         })           
        } else {
            notification.error({
                message: "Duyệt YC thất bại",
                description: res.message
            })
        }     
      
     }
    const showModal = (record) => {       
        form.setFieldsValue({tenbn:record.tenbn,idyc:record.idyc}); 
        setIsModalVisible(true);
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
                rowKey={"idyc"}
                pagination={{
                    defaultPageSize:"10" , 
                    defaultCurrent:"1",
                    total: dataSource.length, 
                    pageSizeOptions: ["10","50", "100", "150"],                   
                    showSizeChanger: true, locale: {items_per_page: ""} 
                   }}           
          
            />            
             <Duyeths              
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                form={form}
                onCreate ={onCreate}
             />    
            <>Total {dataSource.length} items</>
        </div>
    )
}
export default YCsuahosoPage;