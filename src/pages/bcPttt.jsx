import { Button, DatePicker, notification, Select, Space, Spin, Table, Tabs } from "antd";
import { useState } from "react";
import { postbaocaoptttApi } from "../util/api";
import { FileExcelOutlined, SearchOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";

const BCPtttPage = () => {   
    const { RangePicker } = DatePicker;
    const [pending, setPending]= useState(false);  
    const [numpt, setNumPt]= useState(0);  
    const [numxn, setNumxn]= useState(0);  
    const [dateOp, setDateOp] = useState([]);   
    const [dataxn, setDataxn]= useState([]); 
    const [dataPttt, setdataPttt]= useState([]);    
    const [dataPtttnhom, setDataPtttnhom]= useState([]);    
    const columns_nt = [
        {
            title: 'Mã DV',
            dataIndex: 'servicecode',
        }, {
            title: 'Tên dịch vụ',
            dataIndex: 'servicename',
        },
        {
            title: 'SL',
            dataIndex: 'soluong',
        }
    ]; 
    const OnClickHs = async () => {      
            // setDataBaocao([]);    
            setPending(true);               
            let data = {...dateOp};            
            const res = await postbaocaoptttApi(data); 
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
    const changeNhomPT=(a,b)=>{        
        var sluong=0;
        setDataPtttnhom(dataPttt.filter(item=> {
            if(item.departmentid.toString()===a){
                sluong+=Number(item.soluong);             
                return true;    
            }            
        })); 
        setNumPt(sluong);
    }   
    const setFilData=(items)=>{
        var arrayXn = [];
        var arrayHinhanh = [];
        var sluong=0;
        var sluongxn=0;
        for (const item of items) {
            if(item.dm_servicegroupid==3){
                sluongxn+=Number(item.soluong);
                arrayXn.push(item);
            }           
            else{
                //(nhomcon == "403" || nhomcon == "40013" || nhomcon == "40014" || nhomcon == "40015") && !servicename.ToUpper().Contains("PHỤ THU")  
              
                if(item.dm_servicesubgroupid ==403||item.dm_servicesubgroupid==40013||item.dm_servicesubgroupid==40014){
                    if(!item.servicename.toUpperCase().includes("PHỤ THU"))
                        item.dm_servicesubgroupid="403403";   
                }                
                if(!item.servicename.toUpperCase().includes("PHỤ THU")){                    
                    sluong+=Number(item.soluong);
                    arrayHinhanh.push(item);     
                }
                                   
            }
        }
        setNumPt(sluong);  
        setNumxn(sluongxn);        
        setDataxn(arrayXn);      
        setdataPttt(arrayHinhanh);    
        setDataPtttnhom(arrayHinhanh);    
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
                        label: `Lượt PTTT Nội trú (${numpt})`,
                        key: 'luotcdha',
                        children: [ 
                            <Select
                            key={"slcdha"}
                            showSearch
                            style={{
                                width: '40%',
                                cursor: 'move',
                              }}
                            onChange={changeNhomPT}
                            placeholder="Chọn loại CLS"
                            filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={[
                                {value: '54',label: 'Khoa Liên chuyên khoa'},
                                {value: '46',label: 'Khoa Ngoại'},
                                {value: '61',label: 'Khoa Sản'},
                                {value: '45',label: 'Khoa YHCT-PHCN'},
                                {value: '67',label: 'Khoa Nội Nhi'}                      
                            ]}
                        />,  <CSVLink 
                                        filename={"Tonghop-hosoyeucau.csv"}   
                                        icon={<FileExcelOutlined />}                        
                                        data={dataPtttnhom}><Button
                                        icon={<FileExcelOutlined />}
                                        type="default"/>
                        </CSVLink>,
                            <Table   
                            rowKey={"serviceid"}                    
                            bordered
                            dataSource={dataPtttnhom} columns={columns_nt}                       
                            key="tbluotcdha"
                            loading={{ indicator: <div><Spin /></div>, spinning:pending}}
                            /> ,
                            'Số lượng: '+ dataPtttnhom.length                     
                        ]
                    },{
                        label: `Lượt PTTT Phòng Khám(${numxn})`,
                        key: 'luotxn',
                        children: [ 
                            <Table   
                            rowKey={"serviceid"}                    
                            bordered
                            dataSource={dataxn} columns={columns_nt}                       
                            key="tbluotxn"
                            loading={{ indicator: <div><Spin /></div>, spinning:pending}}
                            /> ,
                            'Số lượng: '+ dataxn.length                     
                        ]
                    }                 
                   
                    ]}
                />        
        </>
    )
}

export default BCPtttPage;
