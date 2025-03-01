import { AutoComplete, Button, DatePicker, Input, Modal, notification, Select, Space, Spin, Table, Tabs } from "antd";
import { useState } from "react";
import { postbaocaodieutriApi, postbaocaoIcdApi, postbaocaoLuotTNTdieutriApi, postbaocaongoaitruApi, postDoctorApi, postIcdApi } from "../util/api";
import { SearchOutlined } from "@ant-design/icons";

const BCNgoaitruPage = () => {   
    const { RangePicker } = DatePicker;
    const [pending, setPending]= useState(false);  
    const [dateOp, setDateOp] = useState([]);   
    const [datacc, setDatacc]= useState([]); 
    const [dataKham, setdataKham]= useState([]);    
    const [dataChuyentuyen, setdataChuyentuyen]= useState([]);   
    const columns_nt = [
        {
            title: 'Mã VP',
            dataIndex: 'patientrecordid',
        },
        {
            title: 'Thời gian',
            dataIndex: 'ngayrv',
        }
    ]; 
    const OnClickHs = async () => {      
            // setDataBaocao([]);    
            setPending(true);               
            let data = {...dateOp};            
            const res = await postbaocaongoaitruApi(data); 
            console.log("postbaocaongoaitruApi>>>",res); 
            if (!res?.message) { 
                setPending(false);
                if(res?.thongbao){
                    notification.success({
                        message: "Thành công",
                        description: res.thongbao
                    })
                }else{
                    setFilData(res);  
                }
                
            } else {
                setPending(false);
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                })
            }
        
        
      };    
    const setFilData=(items)=>{
        var arrayCC = [];
        var arrayKham = [];
        for (const item of items) {
            if(item.roomid_kb==464){
                arrayCC.push(item);
            }
            else{
                arrayKham.push(item);
            }
        }
        setDatacc(arrayCC);    
        setdataChuyentuyen(arrayKham.filter(item=> item.dm_hinhthucravienid.toString()==='13'));   
        setdataKham(arrayKham);    
    };     
    const onChangeDate = (date, dateString) => {        
        // console.log("date", dateString);
        setDateOp(dateString);
    };     
    return (
        <>         
          <Space.Compact key={"spacehs"} block>
            <RangePicker onChange={onChangeDate}/> 
            <Button type="primary" 
                 onClick={OnClickHs}
                ><SearchOutlined /></Button>
            </Space.Compact>    
                <Tabs
                    defaultActiveKey="1"
                    items={[
                    {
                        label: `BN ngoại CC (${datacc.length})`,
                        key: 'bncapcuu',
                        children: [ 
                            <Table   
                            rowKey={"patientrecordid"}                    
                            bordered
                            dataSource={datacc} columns={columns_nt}                       
                            key="tbyhct"
                            loading={{ indicator: <div><Spin /></div>, spinning:pending}}
                            /> ,
                            'Số lượng: '+ datacc.length                     
                        ]
                    },
                    {
                        label: `BN chuyển viện (${dataChuyentuyen.length})`,
                        key: 'nttha22nnt',
                        children: [ 
                            <Table   
                            rowKey={"patientrecordid"}                    
                            bordered
                            dataSource={dataChuyentuyen} columns={columns_nt}                       
                            key="tbchuyentuyen"
                            loading={{ indicator: <div><Spin /></div>, spinning:pending}}
                            /> ,
                            'Số lượng: '+ dataChuyentuyen.length                     
                        ]
                    },
                    {
                        label: `BN ngoại trú (${dataKham.length})`,
                        key: 'ntthan3nt',
                        children: [ 
                            <Table   
                            rowKey={"patientrecordid"}                    
                            bordered
                            dataSource={dataKham} columns={columns_nt}                       
                            key="tbnngoaitru"
                            loading={{ indicator: <div><Spin /></div>, spinning:pending}}
                            /> ,
                            'Số lượng: '+ dataKham.length                     
                        ]
                    }
                   
                    ]}
                />        
        </>
    )
}

export default BCNgoaitruPage;
