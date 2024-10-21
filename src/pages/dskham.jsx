import { useEffect, useState } from "react";
import { Tabs, AutoComplete, Input, Table } from 'antd';
import { getLsDoctorApi, getLsphongkhamApi, postbacsiApi, postKhambenhApi } from "../util/api";
import { Link } from "react-router-dom";
import { UsergroupAddOutlined } from "@ant-design/icons";
const DSKhamPage = () => {   
    const [options, setOptions]= useState([]); 
    const [datapk, setDatapk]= useState([]); 
    useEffect(() => {   
        fetchPhongkham();        
    }, [])
 
    const columns = [
        {
            title: 'Mã VP',
            dataIndex: 'patientrecordid',
        },
        {
            title: 'Tên BN',
            dataIndex: 'patientname',
        }
    ];  
    const fetchPhongkham = async () => {
        const res = await getLsphongkhamApi();
        if (!res?.message) {   
                   
            const firstOptions = res.map(res => ({
                value: res.roomname,
                label: res.roomname,
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
          
        }else{
            return options.filter((el) => el.value.toLowerCase().includes(query.toLowerCase()));
        }
        
    }
    const handleOnSelect=async (query)=>{    
        if(query.length<2)return
        const res = await postKhambenhApi(query);
        if (!res?.message) {                    
            setDatapk(res);   
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
                 placeholder="Nhập phòng khám"
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
                        rowKey={"patientrecordid"}                    
                        bordered
                        dataSource={datapk} columns={columns}                       
                        key="tbylenh"
                        /> ,
                        'Số lượng: '+ datapk.length                     
                    ],
                }
                ]}
            />                                
        </div>
    )
}

export default DSKhamPage;

