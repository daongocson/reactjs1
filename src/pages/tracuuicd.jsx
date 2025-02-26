import { AutoComplete, Button, DatePicker, Input, notification, Select, Space, Table, Tabs } from "antd";
import { useState } from "react";
import { postbaocaoIcdApi, postDoctorApi, postIcdApi } from "../util/api";
import { SearchOutlined } from "@ant-design/icons";

const TracuuICDPage = () => {   
    const { Search } = Input;
    const { RangePicker } = DatePicker;
    const [options, setOptions]= useState('');  
    const [dataOp, setDataOp] = useState([]); 
    const [dateOp, setDateOp] = useState([]); 
    const [dataBaocao, setDataBaocao] = useState([]); 
    const [icd, setICD] = useState(''); 
    const [dataCaptoa, setDataCaptoa]= useState([]); 
    const [dataNhapvien, setDataNhapvien]= useState([]); 
    const [keyword, setKeyword] = useState('');
    const [dataChuyentuyen, setDataChuyentuyen]= useState([]); 

    const columns = [
        {
            title: 'Mã VP',
            dataIndex: 'patientrecordid',
        },
        {
            title: 'Mã VP(ĐTNT)',
            dataIndex: 'patientrecordid_vp',
        },{
            title: 'Ngày RV',
            dataIndex: 'ngayrv',
        } ,{
            title: 'Xử trí',
            dataIndex: 'loairv',
        }      

    ];  
    const keys  = ["loairv","patientrecordid"]
    const handleOnSearch = async(values) => {   
        if(values.length==2)  {
            const res = await postIcdApi(values);
            if (!res?.message) {                    
                const Options = res.map(res => ({
                    key:res.id,
                    value: res.dm_icd10code,
                    label: res.dm_icd10code+"->"+res.dm_icd10name,                    
                    isLeaf: false    
                  }));                   
                setDataOp(Options);              
            } else {
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                })
            }
        }else {
            if(values.length>2&&dataOp.length<1){
                const res = await postIcdApi(values);
            }else{
                //filter(khi data có rồi thì filter)
            }            
        }      
      
      };
      const handleOnSelect = async(values,option) => {  
            console.log("Test>>abc",values,option);
            setICD(values);
            
       
      }
      const OnClickHs = async () => {           
            let data = {...dateOp,icd};            
            const res = await postbaocaoIcdApi(data);   
            if (!res?.message) { 
                if(res?.thongbao){
                    notification.success({
                        message: "Thành công",
                        description: res.thongbao
                    })
                }else
                setFilData(res);
            } else {
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                })
            }
        
        
      };    
    const setFilData=(data)=>{
        setDataBaocao(data);       
        setDataCaptoa(data.filter(item=> item.dm_hinhthucravienid===2));   
        setDataChuyentuyen(data.filter(item=> item.dm_hinhthucravienid===13));
        setDataNhapvien(data.filter(item=> item.dm_hinhthucravienid===4));        
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
    return (
        <>         
          <Space.Compact key={"spacehs"} block>
            <RangePicker onChange={onChangeDate}/>                          
            <AutoComplete
                        style={{   
                            width: "50%"            
                        }}                
                        placeholder="Nhập mã ICD"
                        options={dataOp}
                        filterOption={true}               
                        onSearch={(value)=>handleOnSearch(value)}
                        onSelect={(value,option)=>{
                            handleOnSelect(value,option);
                        }}
                        >                            
            </AutoComplete>  
            <Button type="primary" 
                 onClick={OnClickHs}
                ><SearchOutlined /></Button>
            </Space.Compact>     
           
            <Space wrap direction="horizontal" size={2}>                                       
                    {/* <Select
                            defaultValue="Chưa sử dụng"
                            style={{ width: 220 }}
                           onChange={handleChange}
                            options={[
                                { value: 'Khoa nội', label: 'Khoa nội' },
                                { value: 'Khoa khám bệnh', label: 'Khoa khám bệnh' },
                                { value: 'Khoa ngoại', label: 'Khoa ngoại' },
                                { value: 'Khoa YHCT', label: 'Khoa YHCT' },
                                { value: 'Khoa Sản', label: 'Khoa Sản' },
                            ]}
                    />   */}
                     {/* <Select
                            defaultValue="Hình thức ra viện"
                            style={{ width: 220 }}
                           onChange={handleChange}
                            options={[
                                { value: 'Nhập viện', label: 'Nhập viện' },
                                { value: 'Chuyển viện', label: 'chuyển viện' },
                                { value: 'Điều trị ngoại trú', label: 'Điều trị ngoại trú' }                                
                            ]}
                    />                                     */}
                </Space>                
                <Tabs
                    defaultActiveKey="1"
                    items={[
                    {
                        label: `BN Chuyển tuyến (${dataChuyentuyen.length})`,
                        key: 'chuyentuyen',
                        children: [                           
                            <Table   
                            rowKey={"medicalrecordid"}                    
                            bordered                       
                            dataSource={dataChuyentuyen} columns={columns}                 
                            key="cskhkhl"
                            /> ,
                            'Số lượng: '+ dataChuyentuyen.length                     
                        ],
                    },{
                        label: `Cấp toa cho về (${dataCaptoa.length})`,
                        key: 'captoa',
                        children: [ 
                            <Table   
                            rowKey={"medicalrecordid"}                    
                            bordered
                            dataSource={dataCaptoa} columns={columns}                       
                            key="cskhk1hl"
                            /> ,
                            'Số lượng: '+ dataCaptoa.length                     
                        ],
                    },{
                        label: `Nhập viện (${dataNhapvien.length})`,
                        key: 'nhapvien',
                        children: [ 
                            <Table   
                            rowKey={"medicalrecordid"}                    
                            bordered
                            dataSource={dataNhapvien} columns={columns}                       
                            key="cskhk3hl"
                            /> ,
                            'Số lượng: '+ dataNhapvien.length                     
                        ],
                    },{
                        label: `Tất cả BN(${dataBaocao.length})`,
                        key: 'allbn',
                        children: [ 
                            <Search
                            placeholder="Nhập nội dung"
                            key={"seachCxl"}
                            allowClear
                            onChange={(event)=>{
                                console.log("insert>>>",event.target.value);
                                setKeyword(event.target.value)
                            }}                      
                            style={{
                                width: "30%"                        
                            }}
                            /> ,
                            <Table
                                rowKey={"medicalrecordid"}
                                bordered
                                dataSource={searchTable(dataBaocao)} columns={columns}      
                                key="cskhk3hlxx"                                        
                            />  ,
                            'Số lượng: '+ dataBaocao.length                     
                        ],
                    }
                    ]}
                />                 
        </>
    )
}

export default TracuuICDPage;
