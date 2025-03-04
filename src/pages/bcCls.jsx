import { AutoComplete, Button, DatePicker, Input, Modal, notification, Select, Space, Spin, Table, Tabs } from "antd";
import { useState } from "react";
import { postbaocaoclsApi, postbaocaodieutriApi, postbaocaoIcdApi, postbaocaoLuotTNTdieutriApi, postbaocaongoaitruApi, postDoctorApi, postIcdApi } from "../util/api";
import { SearchOutlined } from "@ant-design/icons";

const BCClsPage = () => {   
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
            const res = await postbaocaoclsApi(data); 
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
            if(item.dm_servicesubgroupid.toString()===a){
                sluong+=Number(item.soluong);             
                return true;    
            }            
        })); 
        setNumha(sluong);
    }   
    const setFilData=(items)=>{
        var arrayXn = [];
        var arrayHinhanh = [];
        var arrayPttt = [];
        var sluong=0;
        var sluongxn=0;
        for (const item of items) {
            if(item.dm_servicegroupid==3){
                sluongxn+=Number(item.soluong);
                arrayXn.push(item);
            }           
            else if(item.dm_servicegroupid==5){
                if(!item.servicename.toUpperCase().includes("PHỤ THU"))
                    arrayPttt.push(item);
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
        setNumha(sluong);  
        setNumxn(sluongxn);        
        setDataxn(arrayXn);    
        // setdataChuyentuyen(items.filter(item=> item.dm_hinhthucravienid.toString()==='13'));  
        // setdataKhamxtri(arrayKham.filter(item=> item.ngayrv.toString()!=='01/01 00:00'));    
        // setdataKhamkkb(arrayKham.filter(item=> item.ngayrv.toString()!=='01/01 00:00'));    
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
                        label: `Lượt Xét Nghiệm (${numxn})`,
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
                    ,{
                        label: `Lượt CĐ Hình ảnh (${numha})`,
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
                                {value: '401',label: 'Xquang'},
                                {value: '406',label: 'CT'},
                                {value: '402',label: 'Siêu Âm'},
                                {value: '403403',label: 'Nội Soi'},
                                {value: '407',label: 'MRI'},
                                {value: '404',label: 'Điện tim'},
                                {value: '40015',label: 'Soi cổ tử cung'}
                                                                                         
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
                    }                 
                   
                    ]}
                />        
        </>
    )
}

export default BCClsPage;
