import { AutoComplete, Button, DatePicker, Input, Modal, notification, Select, Space, Spin, Table, Tabs } from "antd";
import { useState } from "react";
import { postbaocaodieutriApi, postbaocaoIcdApi, postDoctorApi, postIcdApi } from "../util/api";
import { SearchOutlined } from "@ant-design/icons";

const BCDieutriPage = () => {   
    const { Search } = Input;
    const { RangePicker } = DatePicker;
    const [pending, setPending]= useState(false);  
    const [dataOp, setDataOp] = useState([]); 
    const [dateOp, setDateOp] = useState([]); 
    const [dataBaocao, setDataBaocao] = useState([]); 
    const [dataKhoa, setDataKhoa] = useState([]); 

    const [icd, setICD] = useState(''); 
    const [dataYhct, setDataYhct]= useState([]); 
    const [dataThannt, setdataThannt]= useState([]); 
    const [keyword, setKeyword] = useState('');
    const [dataTbLuot, setDataTbLuot]= useState([]); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    class infoKhoa {        
        constructor(id, name,sobn,songay,trungbinh) {
          this.id = id;
          this.name = name;
          this.sobn = sobn;
          this.songay = songay;
          this.trungbinh=trungbinh;
        }      
        add(bn,sl) {
           this.sobn+=bn;
           this.songay+=sl;
        } 
        trungbinhcomp() {  
            if(this.sobn==0)this.trungbinh==0.00;
            else{
                this.trungbinh=(this.songay/this.sobn).toFixed(2);                                 
            }          
            
         }
      }
    const columns = [
        {
            title: 'Mã VP',
            dataIndex: 'patientrecordid',
        },
        {
            title: 'Khoa',
            dataIndex: 'departmentname',
        },{
            title: 'Ngày Vào',
            dataIndex: 'ngayvao',
        } ,{
            title: 'Ngày Ra',
            dataIndex: 'ngayrv',
        },{
            title: 'Ngày ĐT',
            dataIndex: 'songay',
        }        
    ];  
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
    const columns_th = [
        {
            title: 'Tên khoa',
            dataIndex: 'name',
        },
        {
            title: 'BN',
            dataIndex: 'sobn',
        },
        {
            title: 'Ngày ĐT',
            dataIndex: 'songay',
        },,
        {
            title: 'TBNĐT',
            dataIndex: 'trungbinh',
        }
    ]; 
    const keys  = ["loairv","patientrecordid","patientrecordid_vp"]   
    const showModal = () => {     
        setIsModalOpen(true);
      };
    
      const handleOk = () => {
        setIsModalOpen(false);
      };
      const OnClickHs = async () => {      
            setDataBaocao([]);    
            setPending(true);               
            let data = {...dateOp};            
            const res = await postbaocaodieutriApi(data);  
            if (!res?.message) { 
                setPending(false);
                if(res?.thongbao){
                    notification.success({
                        message: "Thành công",
                        description: res.thongbao
                    })
                }else{
                    setFilData(res.bnngoaitru);  
                    setFilDataNoitru(res.bnnoitru);                                    
                }
                
            } else {
                setPending(false);
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                })
            }
        
        
      };    
    const setFilData=(data)=>{
        // setDataBaocao(data);       
        setDataYhct(data.filter(item=> item.departmentid_next===45));   
        // setDataChuyentuyen(data.filter(item=> item.dm_hinhthucravienid===13));
        setdataThannt(data.filter(item=> item.departmentid_next===69));   
             
    };  
    const setFilDataNoitru=(data)=>{  
        const dataMatTMH = data.map(item => {
            if(item.khoaid==54){              
                if(item.roomid_in=="392"){                    
                    item.khoaid="5411"; 
                    item.departmentname="Khoa LCK-TMH";                    
                }else{
                    item.khoaid="5410";                    
                    item.departmentname="Khoa LCK-Mắt";    
                }
            } 
            if(item.khoaid==67){
                if(item.roomid_in =="497"){
                    item.khoaid="1149"; 
                    item.departmentname="Điều Trị Cc";   
                }
                    
            }
            if(item.khoaid==46){               
                if(item.roomid_in =="498"){
                    console.log('phongcc>',item);
                    item.khoaid="1149"; 
                    item.departmentname="Điều Trị Cc";   
                }
                    
            }            
            return item;
          });
          
        console.log("setFilDataNoitru>",dataMatTMH);     
        setDataBaocao(dataMatTMH);
        setDataKhoa(dataMatTMH);     
        computingBaocao(dataMatTMH);     
    };  
    const computingBaocao=(items)=>{
        var arrayKQ = [];
        const khoa1 = new infoKhoa('67','Khoa Nội Nhi',0,0,0);
        const khoa2 = new infoKhoa('5410','Khoa LCK-Mắt',0,0,0);
        const khoa3 = new infoKhoa('5411','Khoa LCK-TMH',0,0,0);
        const khoa4 = new infoKhoa('61','Khoa Sản',0,0,0);
        const khoa5 = new infoKhoa('45','Khoa YHCT-PHCN',0,0,0);
        const khoa6 = new infoKhoa('46','Khoa Ngoại',0,0,0);
        const khoa7 = new infoKhoa('1149','Điều Trị Cc',0,0,0);

        for (const item of items) {
            if(item.khoaid==khoa1.id)               
                khoa1.add(1,item.songay);
            if(item.khoaid==khoa2.id)               
                khoa2.add(1,item.songay);
            if(item.khoaid==khoa3.id)               
                khoa3.add(1,item.songay);
            if(item.khoaid==khoa4.id)               
                khoa4.add(1,item.songay);
            if(item.khoaid==khoa5.id)               
                khoa5.add(1,item.songay);
            if(item.khoaid==khoa6.id)               
                khoa6.add(1,item.songay);
            if(item.khoaid==khoa7.id)               
                khoa7.add(1,item.songay);
        }
        khoa1.trungbinhcomp();arrayKQ.push(khoa1);
        khoa2.trungbinhcomp();arrayKQ.push(khoa2);
        khoa3.trungbinhcomp();arrayKQ.push(khoa3);
        khoa4.trungbinhcomp();arrayKQ.push(khoa4);
        khoa5.trungbinhcomp();arrayKQ.push(khoa5);
        khoa6.trungbinhcomp();arrayKQ.push(khoa6);
        khoa7.trungbinhcomp();arrayKQ.push(khoa7);
        console.log("baocaotonghop>>",arrayKQ);
        setDataTbLuot(arrayKQ);
    }
    const onChangeDate = (date, dateString) => {        
        // console.log("date", dateString);
        setDateOp(dateString);
    };
      const searchTable=(data)=>{  
        if(keyword=="")
            return data;
        else
            return data.filter(
                (item)=>(
                    keys.some((key)=>item[key]!=null&&item[key].toString().toLowerCase().includes(keyword)
                )));      
    }
    const changeKhoa=(a,b)=>{
        console.log("dfadfadf>",a,b);
        setDataKhoa(dataBaocao.filter(item=> item.khoaid.toString()===a));        
    }
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
                        label: `Bệnh Nhân nội trú (${dataBaocao.length})`,
                        key: 'noitru',
                        children: [
                            <Select
                                key={"slkhoa"}
                                showSearch
                                style={{
                                    width: '40%',
                                    cursor: 'move',
                                  }}
                                onChange={changeKhoa}
                                placeholder="Chọn khoa điều trị"
                                filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={[
                                    {value: '67',label: 'Khoa Nội Nhi'},
                                    {value: '5410',label: 'Khoa LCK-Mắt'},
                                    {value: '5411',label: 'Khoa LCK-TMH'},
                                    {value: '61',label: 'Khoa Sản'},
                                     {value: '45',label: 'Khoa YHCT-PHCN'},
                                     {value: '46',label: 'Khoa Ngoại'},
                                     {value: '1149',label: 'Điều Trị Cc'}                                    
                                ]}
                            />, 
                            <Button key={"btnKhoa"} type="dashed" onClick={showModal}> Báo cáo tổng</Button>,                             
                            <Table   
                            rowKey={"patientrecordid"}                    
                            bordered                       
                            dataSource={dataKhoa} columns={columns}                 
                            key="tbnoitru"
                            loading={{ indicator: <div><Spin /></div>, spinning:pending}}
                            /> ,
                            'Số lượng: '+ dataKhoa.length                     
                        ]
                    },{
                        label: `ĐT ngoại trú YHCT (${dataYhct.length})`,
                        key: 'ntyhct',
                        children: [ 
                            <Table   
                            rowKey={"medicalrecordid"}                    
                            bordered
                            dataSource={dataYhct} columns={columns_nt}                       
                            key="tbyhct"
                            loading={{ indicator: <div><Spin /></div>, spinning:pending}}
                            /> ,
                            'Số lượng: '+ dataYhct.length                     
                        ]
                    },
                    {
                        label: `ĐT ngoại trú ThậnNT (${dataThannt.length})`,
                        key: 'ntthannt',
                        children: [ 
                            <Table   
                            rowKey={"medicalrecordid"}                    
                            bordered
                            dataSource={dataThannt} columns={columns_nt}                       
                            key="tbntthannt"
                            loading={{ indicator: <div><Spin /></div>, spinning:pending}}
                            /> ,
                            'Số lượng: '+ dataThannt.length                     
                        ]
                    }
                   
                    ]}
                />
                 <Modal key={"viewkhoa"} title="Thống kê khoa" open={isModalOpen} onOk={handleOk} onCancel={handleOk}>
                 <Table   
                            rowKey={"id"}                    
                            bordered
                            dataSource={dataTbLuot} columns={columns_th}                       
                            key="modeltbntthannt"                           
                            /> 
                </Modal>                 
        </>
    )
}

export default BCDieutriPage;
