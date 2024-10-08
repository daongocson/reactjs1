import { Input, notification, Space, Table } from "antd";
import { AudioOutlined } from '@ant-design/icons';

import { useEffect, useState } from "react";
import { getLsErrorApi, getUserApi } from "../util/api";
const { Search } = Input;

const ListErorPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [dataSourceFilter, setDataSourceFilter] = useState([]);    
    const [keyword, setKeyword] = useState('');
    const fetchUser = async () => {
        const res = await getLsErrorApi();
        if (!res?.message) {              
            setDataSource(res);   
            setDataSourceFilter(res) ;     
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
            title: 'Mã BN',
            dataIndex: 'MaBN',
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
        }

    ];   
  
    const searchTable=(data)=>{
        console.log(">>>",data.length,keyword);
        return data.filter(
            (item)=>(
                item.TenBS.toLowerCase().includes(keyword.toLowerCase()) ||
                item.MaKhoa.toLowerCase().includes(keyword.toLowerCase()) ||
                item.ndloi.toLowerCase().includes(keyword.toLowerCase()) ||
                item.MaVP.toLowerCase().includes(keyword.toLowerCase()) 
            ));        
    }
    return (       
        <div style={{ padding: 30 }}>      
            <div className="ant-col ant-col-xs-24 ant-col-xl-8">             
                    <Search
                    placeholder="Khoa phòng"
                    allowClear
                    onChange={(event)=>setKeyword(event.target.value)}
                    style={{
                        width: 500,
                    }}
                    />
                 
            </div>           
            <Table
                bordered
                dataSource={searchTable(dataSource)} columns={columns}
                rowKey={"id"}
            />
        </div>
    )
}

export default ListErorPage;