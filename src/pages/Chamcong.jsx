import { useEffect, useState } from "react";
import { Tabs, AutoComplete, Table, Input } from 'antd';
import { getLsChamcongApi, getLsDoctorApi, postbacsiApi, postChamcongIdApi, postpatientApi } from "../util/api";
import { Link } from "react-router-dom";
import { UsergroupAddOutlined } from "@ant-design/icons";
const ChamcongPage = () => {   
    const { Search } = Input;
    const [options, setOptions]= useState([]);  
    const [dataChamcong, setDataChamcong]= useState([]); 
    const [dataKB, setDataKB]= useState([]); 
    const [dataTH, setDataTH]= useState([]); 
    const [dataDV, setDataDV]= useState([]);   
    const columns = [
        {
            title: 'Mã NV',
            dataIndex: 'UserEnrollNumber',
        },
        {
            title: 'Họ tên',
            dataIndex: 'UserFullName',
        },
        {
            title: 'Ngày giờ',
            dataIndex: 'ngaycham',
        }
    ]; 
    useEffect(() => {   
        fetchChamcong();        
    }, [])
    const fetchChamcong = async () => {       
        const res = await getLsChamcongApi();                     
        if (!res?.message) {    
            setDataChamcong(res);               
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
    }    
    const fetchChamcongID = async (query) => {
        const res = await postChamcongIdApi(query);                     
        if (!res?.message) {                    
            setDataChamcong(res);           
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
    }    
    const onSearch = (value, _e, info) =>{
        console.log("abc>>>",value);
    } 
    const handleChange=(value)=>{       
        if(value==""){
            console.log(">>>ahi",value);
            return;
        }
        if (isNaN(value)) 
            {
              alert("Must input numbers");
              return false;
            }else{
                fetchChamcongID(value);              
            }
    }
    return (
        <div style={{ padding: 20 }}>
             <div className="ant-col ant-col-xs-24 ant-col-xl-8">                          
                    <Search
                    placeholder="Nhập mã nhân viên"
                    allowClear                   
                    onSearch={onSearch}  
                    onChange={(event)=>handleChange(event.target.value)}
                    style={{
                        width: "100%"                        
                    }}
                    
                    />
            </div> 
           <Tabs
                defaultActiveKey="1"
                items={[
                {
                    label: 'Thông tin Chấm công',
                    key: '1',
                    children: [ 
                        <Table   
                        rowKey={"RowID"}                    
                        bordered
                        dataSource={dataChamcong} columns={columns}                       
                        key="tbylenh"
                        />                
                    ],
                },
                ]}
            />                                
        </div>
    )
}
export default ChamcongPage;


