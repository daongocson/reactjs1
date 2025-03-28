import { Button, DatePicker, Form, Input, notification, Space, Table } from "antd";

import { useEffect, useState } from "react";
import { fetchycbydateApi, getYcsuaApi, postduyetycApi } from "../util/api";
import { EyeOutlined, SignatureOutlined } from "@ant-design/icons";

import Duyeths from "../components/module/Duyeths";

const { Search } = Input;

const YCsuahosoPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [idyc, setIdyc] = useState('');
    const [ngayyc, setNgayyc] = useState('');
    const [form] = Form.useForm();
    const keys  = ["dichvu","yeucau","tenbn","nguoiyc","phongrv","phongth"];    
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
    const onSearch = async(value, _e, info) => {        
        if(ngayyc=="")
            fetchYC();
        else{
            const res = await fetchycbydateApi({ngayyc});
            if (!res?.message) {                   
                setDataSource(res);               
            } else {
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                })
            }

        }
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
            dataIndex: 'nrv',
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
                
                    <Space.Compact key={"spacehs"} block>                                   
                    <DatePicker   
                            placeholder="Ngày YC"
                            onChange={(date, dateString)=>{setNgayyc(dateString)}}                       
                            style={{
                                width: '150',
                            }}
                        />  
                        <Search
                        placeholder="Nhập nội dung"
                        allowClear
                        onChange={(event)=>setKeyword(event.target.value)}
                        onSearch={onSearch} enterButton 
                        style={{
                            width: "100%"                        
                        }}
                        />                       
                 </Space.Compact>
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