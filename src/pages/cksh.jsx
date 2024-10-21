import { useEffect, useState } from "react";
import { Tabs, Table } from 'antd';
import { getLsCskhApi} from "../util/api";
import { Link } from "react-router-dom";
import { UsergroupAddOutlined } from "@ant-design/icons";
const CSKHPage = () => {       
    const [dataKh, setDataKh]= useState([]); 
    useEffect(() => {   
        fetchKhachhang();        
    }, [])
 
    const columns = [
        {
            title: 'Mã VP',
            dataIndex: 'patientrecordid',
        },
        {
            title: 'Nội dung',
            dataIndex: 'ghichu',
        },
        {
            title: 'Ngày Ra',
            dataIndex: 'ngayra',
        }
    ];  
    const fetchKhachhang = async () => {
        const res = await getLsCskhApi();
        if (!res?.message) {   
            setDataKh(res);              
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
    }   
    return (
        <div style={{ padding: 20 }}>       
           <Tabs
                defaultActiveKey="1"
                items={[
                {
                    label: 'BN không hài lòng',
                    key: '1',
                    children: [ 
                        <Table   
                        rowKey={"idcskh"}                    
                        bordered
                        dataSource={dataKh} columns={columns}                       
                        key="cskhkhl"
                        /> ,
                        'Số lượng: '+ dataKh.length                     
                    ],
                }
                ]}
            />                                
        </div>
    )
}

export default CSKHPage;

