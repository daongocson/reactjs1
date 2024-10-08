import { Input, notification, Space, Table } from "antd";
import { AudioOutlined } from '@ant-design/icons';

import { useEffect, useState } from "react";
import { getLsErrorApi, getUserApi } from "../util/api";
const { Search } = Input;

const ListErorPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [dataSourceFilter, setDataSourceFilter] = useState([]);
    const [keyword, setKeyword] = useState([]);
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
            title: 'Mã VP',
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
    const handleSearchKhoa=(event)=>{      
        let tearm =event.target.value;
        if(tearm){
            let cloneData= dataSourceFilter.filter(item=>item.MaKhoa.toLowerCase().includes(tearm.toLowerCase()));
            console.log("cloneTEAM",dataSourceFilter.length);
            setDataSource(cloneData);
        }else{
            console.log(event.target.value,"NOT TEAM");
            fetchUser();
        }
    };
    const handleSearchBs=(event)=>{      
        let tearm =event.target.value;
        if(tearm){
            let cloneData= dataSourceFilter.filter(item=>item.TenBS.toLowerCase().includes(tearm.toLowerCase()));          
            setDataSource(cloneData);
        }else{
            console.log(event.target.value,"NOT TEAM");
            fetchUser();
        }
    }

    return (       
        <div style={{ padding: 30 }}>      
            <div className="ant-col ant-col-xs-24 ant-col-xl-8">
                <Space direction="horizontal">
                    <Search
                    placeholder="Khoa phòng"
                    allowClear
                    onChange={(event)=>handleSearchKhoa(event)}
                    style={{
                        width: 300,
                    }}
                    />
                    <Search
                    placeholder="bác sĩ"
                    allowClear
                    onChange={(event)=>handleSearchBs(event)}
                    style={{
                        width: 300,
                    }}
                    />
                    </Space>
            </div>           
            <Table
                bordered
                dataSource={dataSource} columns={columns}
                rowKey={"id"}
            />
        </div>
    )
}

export default ListErorPage;