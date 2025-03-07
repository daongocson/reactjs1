import { AutoComplete, Button, DatePicker, Input, Modal, notification, Select, Space, Spin, Table, Tabs } from "antd";
import { useState } from "react";
import { postbaocaodieutriApi, postbaocaoIcdApi, postbaocaoLuotTNTdieutriApi, postbaocaongoaitruApi, postbaocaongoaitruChitietApi, postDoctorApi, postIcdApi } from "../util/api";
import { MehOutlined, SearchOutlined } from "@ant-design/icons";
import ModelbcNgoaitruchitiet from "../components/module/ModelbcNgoaitruchitiet";

const BCNgoaitruPage = () => {   
    const { RangePicker } = DatePicker;
    const [pending, setPending]= useState(false);  
    const [pendingChitiet, setPendingChitiet]= useState(true);  

    const [dateOp, setDateOp] = useState([]);   
    const [datacc, setDatacc]= useState([]); 
    const [dataKham, setdataKham]= useState([]);    
    const [dataKhamxtri, setdataKhamxtri]= useState([]);    
    const [dataKhamkkb, setdataKhamkkb]= useState([]);    
    const [dataChuyentuyen, setdataChuyentuyen]= useState([]);   
    const [dataChuyentuyencc, setdataChuyentuyencc]= useState([]);   
    const [isModalChitiet, setIsModalChitiet] = useState(false);
    const [dataChitiet, setDataChitiet]= useState([]);   

    const columns_nt = [
        {
            title: 'Mã VP',
            dataIndex: 'patientrecordid',
        },
        {
            title: 'Thời gian',
            dataIndex: 'tgkham',
        }
    ]; 
    const fetchKhachhang=async()=>{       
        console.log("test")
    }
    const OnClickHs = async () => {      
            // setDataBaocao([]);    
            setPending(true);               
            let data = {...dateOp};            
            const res = await postbaocaongoaitruApi(data); 
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
    const changeKhoaKB=(a,b)=>{
        setdataKhamkkb (dataKhamxtri.filter(item=> item.roomid.toString()===a));        
    }   
    const setFilData=(items)=>{
        var arrayCC = [];
        var arrayKham = [];
        for (const item of items) {
            if(item.roomid==464){
                arrayCC.push(item);
            }
            else{
                if(item.roomid!=666&&item.roomid!=548&&item.roomid!=541){
                    arrayKham.push(item);
                }
            }
        }
        setDatacc(arrayCC);            
        setdataChuyentuyen(items.filter(item=> item.dm_hinhthucravienid.toString()==='13'));  
        setdataKhamxtri(arrayKham.filter(item=> item.ngayrv.toString()!=='01/01 00:00'));    
        setdataKhamkkb(arrayKham.filter(item=> item.ngayrv.toString()!=='01/01 00:00'));    
        setdataKham(items);    
        setdataChuyentuyencc(items.filter(item=>item.roomid==464 && item.dm_hinhthucravienid.toString()==='13'));  
    };     
    const onChangeDate = (date, dateString) => {        
        // console.log("date", dateString);
        setDateOp(dateString);
    };     
    const setFildataChitiet = (items) => {     
        console.log("setFildataChitiet",items);
        if(items?.length){
            var arrayCC = [];
            var arrayKham = [];
            for (const item of items) {
                if(item.roomid==464){
                    arrayCC.push(item);
                }
                else{
                    if(item.roomid!=666&&item.roomid!=548&&item.roomid!=541){
                        arrayKham.push(item);
                    }
                }
            }
            let vdata={
                datacc:arrayCC,
                dataChuyentuyencc:arrayCC.filter(item=>item.dm_hinhthucravienid.toString()==='13'),
                dataChuyentuyen:arrayKham.filter(item=>item.dm_hinhthucravienid.toString()==='13'),
                dataKham:arrayKham.filter(item=>item.ngayrv.toString()!=='01/01 00:00'),
            }
            setDataChitiet(vdata);
        }else{
            let vdata={
                datacc:[],
                dataChuyentuyencc:[],
                dataChuyentuyen:[],
                dataKham:[]
            }
            setDataChitiet(vdata);
        }

    }; 
    const ShowChitiet = async() => {        
        setIsModalChitiet(true);       
        setPendingChitiet(true);
        const res = await postbaocaongoaitruChitietApi(dateOp); 
        setFildataChitiet(res);      
        setPendingChitiet(false);        
    };
    return (
        <>  
        <div style={{ padding: 20 }}>
          <Space.Compact key={"spacehs"} block>
            <RangePicker onChange={onChangeDate}/> 
            <Button type="primary" 
                 onClick={OnClickHs}
                ><SearchOutlined /></Button>
              <Button type="dashed" 
                 onClick={ShowChitiet}
                ><MehOutlined />Chi tiết BHYT</Button>
            </Space.Compact>    
                <Tabs
                    defaultActiveKey="1"
                    items={[
                    {
                        label: `BN Khám Cấp cứu (${datacc.length})`,
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
                        label: `CT Cấp cứu (${dataChuyentuyencc.length})`,
                        key: 'bnchuyentuyencc',
                        children: [ 
                            <Table   
                            rowKey={"patientrecordid"}                    
                            bordered
                            dataSource={dataChuyentuyencc} columns={columns_nt}                       
                            key="tbchuyentuyen"
                            loading={{ indicator: <div><Spin /></div>, spinning:pending}}
                            /> ,
                            'Số lượng: '+ dataChuyentuyencc.length                     
                        ]
                    },
                    {
                        label: `BN chuyển tuyến (${dataChuyentuyen.length})`,
                        key: 'bnchuyentuyen',
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
                    },{
                        label: `BN Phòng Khám (${dataKhamxtri.length})`,
                        key: 'tbnngoaitruxtri',
                        children: [ 
                            <Select
                            key={"slkhoa"}
                            showSearch
                            style={{
                                width: '40%',
                                cursor: 'move',
                              }}
                            onChange={changeKhoaKB}
                            placeholder="Chọn khoa Khám bệnh"
                            filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={[
                                {value: '434',label: 'Phòng khám số 01'},
                                {value: '436',label: 'Phòng khám số 07'},
                                {value: '437',label: 'Phòng khám số 04'},
                                {value: '438',label: 'Phòng khám số 05'},
                                {value: '439',label: 'Phòng khám số 06'},
                                {value: '440',label: 'Phòng khám số 03'},
                                {value: '441',label: 'Phòng khám số 08'},
                                {value: '442',label: 'Phòng khám số 09'},                                    
                                {value: '443',label: 'Phòng khám số 10'},
                                {value: '444',label: 'Phòng khám số 11'},
                                {value: '447',label: 'Phòng khám số 13 (PK RHM)'},
                                {value: '448',label: 'Phòng khám số 12 (PK MẮT)'},
                                {value: '501',label: 'Phòng Tiêm chủng'},
                                {value: '509',label: 'Phòng sao bệnh án'},
                                {value: '594',label: 'Phòng khám Y Học Cổ Truyền'},
                                {value: '605',label: 'Phòng khám 16'}                                          
                            ]}
                        />, 
                            <Table   
                            rowKey={"patientrecordid"}                    
                            bordered
                            dataSource={dataKhamkkb} columns={columns_nt}                       
                            key="tbnngoaitruxtritb"
                            loading={{ indicator: <div><Spin /></div>, spinning:pending}}
                            /> ,
                            'Số lượng: '+ dataKhamkkb.length                     
                        ]
                    },
                    {
                        label: `BN Khám Cả viện (${dataKham.length})`,
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
            </div> 
            <ModelbcNgoaitruchitiet
                open={isModalChitiet}
                setOpen={setIsModalChitiet}
                loading={pendingChitiet}
                data={dataChitiet}               
            />    
        </>
    )
}

export default BCNgoaitruPage;
