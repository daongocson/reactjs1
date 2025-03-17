import { useEffect, useState } from "react";
import { Tabs, Table, Button } from 'antd';
import { getLsCskhApi} from "../util/api";
import { Link } from "react-router-dom";
import { UsergroupAddOutlined } from "@ant-design/icons";
import BlogCard from "../components/module/BlogCard";
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
        }, {
            title: 'Phone',
            dataIndex: 'phone',
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
        <BlogCard key={"blogkhl"} posts={dataKh}/>   
           {/* <Tabs
                defaultActiveKey="1"
                items={[
                {
                    label: 'BN không hài lòn111g',
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
            <Button
                type="primary"
                
            >
                Báo sửa HS
            </Button>      */}

        </div>
    )
}

export default CSKHPage;

