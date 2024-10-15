import { useEffect, useState } from "react";
import { Tabs, AutoComplete, Input, Table } from 'antd';
import { getLsDoctorApi, postbacsiApi } from "../util/api";
import { Link } from "react-router-dom";
import { UsergroupAddOutlined } from "@ant-design/icons";
const BacsiYlenhPage = () => {   
    const [options, setOptions]= useState([]); 
    const [dataYL, setDataYL]= useState([]); 
    const [dataTH, setDataTH]= useState([]); 
    const [dataKQ, setDataKQ]= useState([]); 
    useEffect(() => {   
        fetchUser();        
    }, [])
 
    const columns = [
        {
            title: 'Mã VP',
            dataIndex: 'patientrecordid',
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'dichvu',
        },
        {
            title: 'Thời gian',
            dataIndex: 'ngayyl',
        }      

    ];  
    const fetchUser = async () => {
        const res = await getLsDoctorApi();
        if (!res?.message) {                    
            const firstOptions = res.map(res => ({
                value: res.name,
                label: res.name,
                isLeaf: false    
              }));   
            setOptions(firstOptions);              
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
    }
    const handleOnSearch=(query)=>{ 
        if(query.length==0){     
            setDataYL([]);
            setDataTH([]);
            setDataKQ([]);
        }else{
            return options.filter((el) => el.value.toLowerCase().includes(query.toLowerCase()));
        }
        
    }
    const handleOnSelect=async (query)=>{    
        const res = await postbacsiApi(query);
        if (!res?.message) {                    
            console.log(res.dataYL);
            setDataYL(res.dataYL);     
            setDataTH(res.dataTH);
            setDataKQ(res.dataKQ);         
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
    }
    return (
        <div style={{ padding: 20 }}>
             <div className="ant-col ant-col-xs-24 ant-col-xl-8">             
                <AutoComplete
                 style={{   
                    width: "100%"            
                }}
                 placeholder="Nhập bác sĩ"
                 options={options}
                 filterOption={true}
                 onSelect={(value)=>{
                    handleOnSelect(value);
                 }}
                 onSearch={(value)=>handleOnSearch(value)}
                 >
                    
                </AutoComplete>
                 
            </div> 
           <Tabs
                defaultActiveKey="1"
                items={[
                {
                    label: 'Giờ Y Lệnh',
                    key: '1',
                    children: [ 
                        <Table   
                        rowKey={"servicedataid"}                    
                        bordered
                        dataSource={dataYL} columns={columns}                       
                        key="tbylenh"
                        /> ,
                        'Số lượng: '+ dataYL.length                     
                    ],
                },
                {
                    label: 'Giờ Thực Hiện',
                    key: '2',
                    children: [ 
                        <Table   
                        rowKey={"servicedataid"}                    
                        bordered
                        dataSource={dataTH} columns={columns}                       
                        key="tbylenh"
                        />,
                        'Số lượng: '+ dataTH.length    ,      
                    ],  
                                   
                },
                {
                    label: 'Giờ Kết Quả',
                    key: '3',
                    children: [ 
                        <Table   
                        rowKey={"servicedataid"}                    
                        bordered
                        dataSource={dataKQ} columns={columns}                       
                        key="tbylenh"
                        />   ,
                        'Số lượng: '+ dataKQ.length    ,                         
                    ],
                },
                ]}
            />                                
        </div>
    )
}

export default BacsiYlenhPage;
