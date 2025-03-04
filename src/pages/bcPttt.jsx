import { Button, DatePicker, notification, Select, Space, Spin, Table, Tabs } from "antd";
import { useState } from "react";
import { postbaocaoptttApi } from "../util/api";
import { SearchOutlined } from "@ant-design/icons";

const BCPtttPage = () => {   
    const { RangePicker } = DatePicker;
    const [pending, setPending]= useState(false);  
    const [numha, setNumha]= useState(0);  
    const [numxn, setNumxn]= useState(0);  
    const [dateOp, setDateOp] = useState([]);   
    const [dataxn, setDataxn]= useState([]); 
    const [dataHinhanh, setdataHinhanh]= useState([]);    
    const [dataHinhanhnhom, setDataHinhanhnhom]= useState([]);    
    const columns_nt = [
        {
            title: 'Mã DV',
            dataIndex: 'serviceid',
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
            console.log("cls>>",res);
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
    const changeNhomHA=(a,b)=>{        
        var sluong=0;
        setDataHinhanhnhom(dataHinhanh.filter(item=> {
            if(item.departmentid.toString()===a){
                sluong+=Number(item.soluong);             
                return true;    
            }            
        })); 
        setNumha(sluong);
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
               
                console.log(sluong);
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
        setNumha(sluong);  
        setNumxn(sluongxn);        
        setDataxn(arrayXn);      
        setdataHinhanh(arrayHinhanh);    
        setDataHinhanhnhom(arrayHinhanh);    
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
                        label: `Lượt PTTT Nội trú (${numha})`,
                        key: 'luotcdha',
                        children: [ 
                            <Select
                            key={"slcdha"}
                            showSearch
                            style={{
                                width: '40%',
                                cursor: 'move',
                              }}
                            onChange={changeNhomHA}
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
                        />, 
                            <Table   
                            rowKey={"serviceid"}                    
                            bordered
                            dataSource={dataHinhanhnhom} columns={columns_nt}                       
                            key="tbluotcdha"
                            loading={{ indicator: <div><Spin /></div>, spinning:pending}}
                            /> ,
                            'Số lượng: '+ dataHinhanhnhom.length                     
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
