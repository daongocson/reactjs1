import { Button, Input, Modal, notification, Table } from "antd";

import { useEffect, useState } from "react";
import { getLsErrorApi, getYcsuaApi } from "../util/api";
import { EyeOutlined } from "@ant-design/icons";
import ModelView from "../components/module/ModelView";

const { Search } = Input;

const YCsuahosoPage = () => {
    const [dataSource, setDataSource] = useState([]);
  
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
    const onSearch = (value, _e, info) => console.log(info?.source, value);
  
    const columns = [
        {
            title: 'Dịch vụ',
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
            title: 'ngayyc',
            dataIndex: 'nyc',
        }
    ];      
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
                 
            <>Total {dataSource.length} items</>
        </div>
    )
}
export default YCsuahosoPage;