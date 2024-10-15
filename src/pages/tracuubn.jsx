import { useEffect, useState } from "react";
import { Tabs, AutoComplete, Table, Input } from 'antd';
import { getLsDoctorApi, postbacsiApi, postpatientApi } from "../util/api";
import { Link } from "react-router-dom";
import { UsergroupAddOutlined } from "@ant-design/icons";
const TracuubnPage = () => {   
    const { Search } = Input;
    const [options, setOptions]= useState([]);  
    const [dataKH, setDataKH]= useState([]); 
    const [dataKB, setDataKB]= useState([]); 
    const [dataTH, setDataTH]= useState([]); 
    const [dataDV, setDataDV]= useState([]);   
    const columns = [
        {
            title: 'Nội dung',
            dataIndex: 'name',
        },
        {
            title: 'Ngày YL',
            dataIndex: 'value',
        }
    ];  
    const fetchPatientByID = async (query) => {
        console.log(">cccc>>>",query);
        const res = await postpatientApi(query);                     
        if (!res?.message) {                    
            console.log(res.dataDV);  
            setDataKH(res.dataKH)          
            setDataKB(res.dataKB);              
            setDataTH(res.dataTH);    
            setDataDV(res.dataDV);              
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
    }    
    const onSearch = (value, _e, info) =>{
        if (isNaN(value)) 
            {
              alert("Must input numbers");
              return false;
            }else{
                if(value.length==6)
                    fetchPatientByID(value);
                else
                    setOptions([]);
            }
        
    } 
    return (
        <div style={{ padding: 20 }}>
             <div className="ant-col ant-col-xs-24 ant-col-xl-8">                          
                    <Search
                    placeholder="Nhập mã viện phí"
                    allowClear                   
                    onSearch={onSearch} enterButton 
                    style={{
                        width: "100%"                        
                    }}
                    
                    />
            </div> 
           <Tabs
                defaultActiveKey="1"
                items={[
                {
                    label: 'Thông tin Khách hàng',
                    key: '1',
                    children: [ 
                        <Table   
                        rowKey={"id"}                    
                        bordered
                        dataSource={dataKH} columns={columns}                       
                        key="tbylenh"
                        />                
                    ],
                }, {
                    label: 'Công Khám',
                    key: '2',
                    children: [ 
                        <Table   
                        rowKey={"servicedataid"}                    
                        bordered
                        dataSource={dataKB} columns={columns}                       
                        key="tbylenh"
                        />                      
                    ],  
                                   
                },
                {
                    label: 'Thuốc',
                    key: '3',
                    children: [ 
                        <Table   
                        rowKey={"servicedataid"}                    
                        bordered
                        dataSource={dataTH} columns={columns}                       
                        key="tbylenh"
                        />                               
                    ],  
                                   
                },
                {
                    label: 'Dịch vụ',
                    key: '4',
                    children: [ 
                        <Table   
                        rowKey={"servicedataid"}                    
                        bordered
                        dataSource={dataDV} columns={columns}                       
                        key="tbylenh"
                        />   ,
                        'Số lượng: '+ dataDV.length    ,                         
                    ],
                },
                ]}
            />                                
        </div>
    )
}

export default TracuubnPage;
