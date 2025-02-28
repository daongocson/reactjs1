import { AutoComplete, Button, DatePicker, Input, notification, Select, Space, Spin, Table, Tabs } from "antd";
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
    const [dataChuyentuyen, setDataChuyentuyen]= useState([]); 

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
    const keys  = ["loairv","patientrecordid","patientrecordid_vp"]
    // const handleOnSearch = async(values) => {   
    //     if(values.length==2)  {
    //         const res = await postIcdApi(values);
    //         if (!res?.message) {                    
    //             const Options = res.map(res => ({
    //                 key:res.id,
    //                 value: res.dm_icd10code,
    //                 label: res.dm_icd10code+"->"+res.dm_icd10name,                    
    //                 isLeaf: false    
    //               }));                   
    //             setDataOp(Options);              
    //         } else {
    //             notification.error({
    //                 message: "Unauthorized",
    //                 description: res.message
    //             })
    //         }
    //     }else {
    //         if(values.length>2&&dataOp.length<1){
    //             const res = await postIcdApi(values);
    //         }else{
    //             //filter(khi data có rồi thì filter)
    //         }            
    //     }      
      
    //   };
    //   const handleOnSelect = async(values,option) => {             
    //         setICD(values);       
    //   }
      const OnClickHs = async () => {      
            setDataBaocao([]);    
            setPending(true);               
            let data = {...dateOp};            
            const res = await postbaocaodieutriApi(data);  
            console.log("dieutri>>",res); 
            if (!res?.message) { 
                setPending(false);
                if(res?.thongbao){
                    notification.success({
                        message: "Thành công",
                        description: res.thongbao
                    })
                }else{
                    setFilData(res.bnngoaitru);                
                    setDataBaocao(res.bnnoitru);
                    setDataKhoa(res.bnnoitru);
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
                                    {value: '54',label: 'Khoa Liên chuyên khoa'},
                                    {value: '61',label: 'Khoa Sản'},
                                     {value: '45',label: 'Khoa YHCT-PHCN'},
                                     {value: '46',label: 'Khoa Ngoại'},
                                ]}
                            />,                              
                            <Table   
                            rowKey={"patientrecordid"}                    
                            bordered                       
                            dataSource={dataKhoa} columns={columns}                 
                            key="tbnoitru"
                            loading={{ indicator: <div><Spin /></div>, spinning:pending}}
                            /> ,
                            'Số lượng: '+ dataKhoa.length                     
                        ],
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
                        ],
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
                        ],
                    }
                   
                    ]}
                />                 
        </>
    )
}

export default BCDieutriPage;
