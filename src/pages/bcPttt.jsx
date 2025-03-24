import { Button, DatePicker, Modal, notification, Select, Space, Spin, Table, Tabs } from "antd";
import { useState } from "react";
import { postbaocaoptttApi, postbaocaoServiceApi } from "../util/api";
import { EyeOutlined, FileExcelOutlined, PhoneOutlined, SearchOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";

const BCPtttPage = () => {   
    const { RangePicker } = DatePicker;
    const [pending, setPending]= useState(false);  
    const [numpt, setNumPt]= useState(0); 
    const [numptKham, setNumPtKham]= useState(0);      
     
    const [numPhauthuat, setNumPhauthuat]= useState(0);  
    const [dateOp, setDateOp] = useState([]);   
    const [dataPttt, setdataPttt]= useState([]);  
    const [dataPttt_KB, setdataPttt_KB]= useState([]);  

    const [dataService, setDataService]= useState([]);    
    const [dataPtttnhom, setDataPtttnhom]= useState([]);    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [dataPhauthuat, setDataPhauthuat]= useState([]);    
    const [dataPhauthuatnhom, setDataPhauthuatnhom]= useState([]);    
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
        },
         {
            title: 'Xem',
            dataIndex: 'soluong',
            key: 'servicecode',
            render: (index, record) => (
                <Space size="middle">
                    <Button  icon={<EyeOutlined />} onClick={() => showModal(record)} />                
                </Space>
            )
        }
    ]; 
    const columns_vp = [
        {
            title: 'Mã DV',
            dataIndex: 'patientrecordid',
        }, {
            title: 'Tên dịch vụ',
            dataIndex: 'servicename',
        },
        {
            title: 'Ngày',
            dataIndex: 'ngayrv',
        },{
            title: 'Khoa CĐ',
            dataIndex: 'departmentid',
            render: (index, record) => (
                <div>{getNameKhoa(record.departmentid)}</div>
            )
        }            
    ]; 
    const getNameKhoa=(idkhoa)=>{         
        if(idkhoa===44)return "Khám bệnh";
        else if(idkhoa===45)return "Khoa YHCT-PHCN";
        else if(idkhoa===46)return "Khoa Ngoại";
        else if(idkhoa===54)return "Khoa LCK";
        else if(idkhoa===61)return "Khoa Sản";
        else if(idkhoa===67)return "Khoa Nội nhi";
        else return "Nội trú"    }
    const showModal=(record)=>{
        setIsModalOpen(true);
        console.log("abcd12321313>>",record.servicecode);
        OnViewHs(record.servicecode);
    }
    const handleOk=()=>{
        setIsModalOpen(false);
        setPending(false);               

    }
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
      const OnViewHs = async (serviceCode) => {      
        setPending(true);               
        let data = {...dateOp,serviceCode};    
        const res = await postbaocaoServiceApi(data); 
        console.log("khekhehekkheiehekke>>>",res);        

        if (!res?.message) { 
            setPending(false);
            if(res?.thongbao){
                notification.success({
                    message: "Thành công",
                    description: res.thongbao
                })
            }else{
                setDataService(res);  
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
        // console.log("checkdchanndkfege>>",dataPttt);    
        var sluong=0;
        setDataPtttnhom(dataPttt.filter(item=> {
            if(item.departmentid.toString()===a){
                sluong+=Number(item.soluong);             
                return true;    
            }            
        })); 
        setNumPt(sluong);
    }   
    const changeNhomPhauThuat=(a,b)=>{        
        var sluong=0;
        setDataPhauthuatnhom(dataPhauthuat.filter(item=> {
            if(item.departmentid.toString()===a){
                sluong+=Number(item.soluong);             
                return true;    
            }            
        })); 
        setNumPhauthuat(sluong);
    }   
    const setFilData=(items)=>{
        var arrayXn = [];
        var arrayPttt = [];
        var arrayPhauthuat = [];      
        var sluongphaut=0;
        for (const item of items) {
            
            if(item.dm_servicegroupid==3){                
                arrayXn.push(item);
            }           
            else{
                //(nhomcon == "403" || nhomcon == "40013" || nhomcon == "40014" || nhomcon == "40015") && !servicename.ToUpper().Contains("PHỤ THU")  
              
                if(item.dm_servicesubgroupid ==403||item.dm_servicesubgroupid==40013||item.dm_servicesubgroupid==40014){
                    if(!item.servicename.toUpperCase().includes("PHỤ THU"))
                        item.dm_servicesubgroupid="403403";   
                }                
                if(!item.servicename.toUpperCase().includes("PHỤ THU")){                    
                    // sluong+=Number(item.soluong);
                    arrayPttt.push(item);     
                    if(item.dm_pttt_loaiid==1||item.dm_pttt_loaiid==2||item.dm_pttt_loaiid==3||item.dm_pttt_loaiid==4){
                        sluongphaut+=Number(item.soluong);
                        arrayPhauthuat.push(item);
                    }
                        
                }
                                   
            }
        }
        setNumPhauthuat(sluongphaut);  
        luuPTTTNoitru(arrayPttt.filter(item=>item.departmentid!=44));
        luuPTTTKhambenh(arrayPttt.filter(item=>item.departmentid===44));                        
        setDataPhauthuat(arrayPhauthuat);
        setDataPhauthuatnhom(arrayPhauthuat);
    };     
    const luuPTTTNoitru = (dataNoitru) => {  
        var sluong=0;
        for (const item of dataNoitru) {
            sluong+=Number(item.soluong);
        }      
          setNumPt(sluong);  

        setdataPttt(dataNoitru);            
        setDataPtttnhom(dataNoitru);  
    };
    const luuPTTTKhambenh = (dataKham) => {  
        var sluong=0;
        for (const item of dataKham) {
            sluong+=Number(item.soluong);
        }      
        setNumPtKham(sluong);  
        setdataPttt_KB(dataKham);
        
    };
    const onChangeDate = (date, dateString) => {        
        // console.log("date", dateString);
        setDateOp(dateString);
    };     
    return (
        <>        
         <div style={{ padding: 20 }}>     
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
                        key: 'luotcdha12',
                        children: [ 
                            <Select
                            key={"slcdha"}
                            showSearch
                            style={{
                                width: '40%',
                                cursor: 'move',
                              }}
                            onChange={changeNhomPT}
                            placeholder="Chọn Khoa"
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
                                key={"cvsdf"}
                                        filename={"Tonghop-hosoyeucau.csv"}   
                                        icon={<FileExcelOutlined />}                        
                                        data={dataPtttnhom}><Button
                                        icon={<FileExcelOutlined />}
                                        type="default"/>
                            </CSVLink>,
                            <Table   
                                rowKey={"servicecode"}                    
                                bordered
                                dataSource={dataPtttnhom} columns={columns_nt}                       
                                key="tbluotcdha"
                                loading={{ indicator: <div><Spin /></div>, spinning:pending}}
                            /> ,
                            'Số lượng: '+ dataPtttnhom.length                     
                        ]
                    },
                    {
                        
                        label: `Lượt PTTT Khám bệnh (${numptKham})`,
                        key: 'luotptttngpaot',
                        children: [                                              
                         <div key={"divluotngtr"}>Download<CSVLink 
                                        key={"slptttngoaitru12"}
                                        filename={"Tonghop-hosoyeucau.csv"}   
                                        icon={<FileExcelOutlined />}                        
                                        data={dataPttt_KB}><Button
                                        icon={<FileExcelOutlined />}
                                        type="default"/>
                        </CSVLink></div>,
                            <Table   
                            rowKey={"servicecode"}                    
                            bordered
                            dataSource={dataPttt_KB} columns={columns_nt}                       
                            key="tbptttkb"
                            loading={{ indicator: <div><Spin /></div>, spinning:pending}}
                            /> ,
                            'Số lượng: '+ dataPttt_KB.length                     
                        ]
                    },      
                    {
                        
                        label: `Lượt Phẫu thuật(${numPhauthuat})`,
                        key: 'luotxn',
                        children: [ 
                            <Select
                            key={"slPhauthuat"}
                            showSearch
                            style={{
                                width: '40%',
                                cursor: 'move',
                              }}
                            onChange={changeNhomPhauThuat}
                            placeholder="Chọn khoa"
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
                         <CSVLink 
                                        key={"slPhauthuat12"}
                                        filename={"Tonghop-hosoyeucau.csv"}   
                                        icon={<FileExcelOutlined />}                        
                                        data={dataPhauthuatnhom}><Button
                                        icon={<FileExcelOutlined />}
                                        type="default"/>
                        </CSVLink>,
                            <Table   
                            rowKey={"servicecode"}                    
                            bordered
                            dataSource={dataPhauthuatnhom} columns={columns_nt}                       
                            key="tbluotxn"
                            loading={{ indicator: <div><Spin /></div>, spinning:pending}}
                            /> ,
                            'Số lượng: '+ dataPhauthuatnhom.length                     
                        ]
                    }                 
                   
                    ]}
                />, 
                <Modal width={800} title= {"Số lượng: "+ dataService.length}        open={isModalOpen} onOk={handleOk} onCancel={handleOk}>
                <Table   
                            rowKey={"patientrecordid"}                    
                            bordered
                            dataSource={dataService} columns={columns_vp}                       
                            key="tbluotxn"
                            loading={{ indicator: <div><Spin /></div>, spinning:pending}}
                            /> ,
              </Modal>   
            </div>    
        </>
    )
}

export default BCPtttPage;
