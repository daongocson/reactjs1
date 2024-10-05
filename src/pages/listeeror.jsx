import { notification, Table } from "antd";
import { useEffect, useState } from "react";
import { getLsErrorApi, getUserApi } from "../util/api";

const ListErorPage = () => {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await getLsErrorApi();
            if (!res?.message) {              
                setDataSource(res);
            } else {
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                })
            }
        }
        fetchUser();
    }, [])


    const columns = [
        {
            title: 'Mã VP',
            dataIndex: 'MaVP',
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
            title: 'Tên bác sĩ',
            dataIndex: 'TenBS',
        }

    ];


    return (
        <div style={{ padding: 30 }}>
            <Table
                bordered
                dataSource={dataSource} columns={columns}
                rowKey={"_id"}
            />
        </div>
    )
}

export default ListErorPage;