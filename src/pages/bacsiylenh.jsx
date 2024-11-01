import { useEffect, useState } from "react";
import { Tabs, AutoComplete, Input, Table, Button, Form, notification } from 'antd';
import { createnickbsApi, getLsDoctorApi, postbacsiApi } from "../util/api";
import { Link } from "react-router-dom";
import { UsergroupAddOutlined } from "@ant-design/icons";
import Duyeths from "../components/module/Duyeths";
import CreateEkip from "../components/module/CreateEkip";
const BacsiYlenhPage = () => {   
    const [options, setOptions]= useState([]);     
    const [dataBS, setDataBS]= useState([]); 
    const [dataYL, setDataYL]= useState([]); 
    const [dataTH, setDataTH]= useState([]); 
    const [dataKQ, setDataKQ]= useState([]); 
    const [dataEkip, setDataEkip]= useState(''); 
    const [phong, setPhong]= useState(''); 
    const [quyen, setQuyen]= useState(''); 
    const [isModalVisible, setIsModalVisible] = useState(false);
    useEffect(() => {   
        fetchUser();        
    }, [])
    const [form] = Form.useForm();
    const columns = [
        {
            title: 'Mã VP',
            dataIndex: 'patientrecordid',
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'dichvu',
        },
        {
            title: 'Thời gian',
            dataIndex: 'ngayyl',
        }      

    ];  
    const columnbs = [
        {
            title: 'Thông tin',
            dataIndex: 'name',
        },
        {
            title: 'Nội dung',
            dataIndex: 'value',
        }    

    ];  
    const fetchUser = async () => {
        const res = await getLsDoctorApi();
        if (!res?.message) {                    
            const firstOptions = res.map(res => ({
                value: res.name,
                label: res.name,
                isLeaf: false    
              }));   
            setOptions(firstOptions);              
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
    }
    const creatDoctors = async () => {
   
        form.setFieldsValue({mabhyt:dataBS[1].value+"(" +dataBS[3].value+")",tenbs:dataBS[1].value});       
        setIsModalVisible(true);
    }
    const onCreate = async (values) => {           
        const res = await createnickbsApi({nick:values.mabs,tenbsekip:values.tenbsekip,phonebsekip:values.phonebsekip,nickname:dataBS[1].value,tencchn:dataBS[2].value,
            cccd:dataBS[4].value,msdinhdanh:dataBS[5].value,tktracuu:dataBS[6].value,cchn: dataBS[3].value,phong,quyen});
        if (res?.message) {
            if (res && res.message=="sucess") {    
                notification.success({
                 message: "Duyệt YC thành công",
                 description: res.duyet
             })           
            } else {
                notification.error({
                    message: "Duyệt YC thất bại",
                    description: res.duyet
                })
            }                    
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
        
      }
    const setBsChinhEkip = (data) => {
        var subdata = data.substring(data.indexOf("-")+1);
        setDataEkip(subdata);         
    }
    const handleOnSearch=(query)=>{ 
        if(query.length==0){ 
            setPhong(''); 
            setQuyen(''); 
            setDataBS([]);   
            setDataYL([]);
            setDataTH([]);
            setDataKQ([]);            
        }else{
            return options.filter((el) => el.value.toLowerCase().includes(query.toLowerCase()));
        }
        
    }
    const handleOnSelect=async (query)=>{    
        const res = await postbacsiApi(query);
        if (!res?.message) {    
            setPhong(res.listphongchucnang)
            setQuyen(res.listphanquyen)
            setDataBS(res.dataBS);    
            setDataYL(res.dataYL);     
            setDataTH(res.dataTH);
            setDataKQ(res.dataKQ);   
            setBsChinhEkip(res.dataBS[0].value);      
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
    }
    return (
        <div style={{ padding: 20 }}>
             <div className="ant-col ant-col-xs-24 ant-col-xl-8">             
                <AutoComplete
                 style={{   
                    width: "100%"            
                }}
                 placeholder="Nhập bác sĩ"
                 options={options}
                 filterOption={true}
                 onSelect={(value)=>{
                    handleOnSelect(value);
                 }}
                 onSearch={(value)=>handleOnSearch(value)}
                 >
                    
                </AutoComplete>
                 
            </div> 
           <Tabs
                key={"tabbs"}
                defaultActiveKey="info"
                items={[
                 {
                    label: 'Bác sĩ',
                    key: 'info',
                    children: [ 
                        <Table   
                        rowKey={"keyid"}                    
                        bordered
                        dataSource={dataBS} columns={columnbs}                       
                        key="tbabs"
                        />   ,
                        <Button key={"btn-createbs"} type="primary" onClick={creatDoctors}>Tạo nick-ekip</Button>
                    ],
                },
                {
                    label: 'Giờ Y Lệnh',
                    key: '1',
                    children: [ 
                        <Table   
                        rowKey={"servicedataid"}                    
                        bordered
                        dataSource={dataYL} columns={columns}                      
                        key="tbkyls"
                        pagination={{
                            defaultPageSize:"10" , 
                            defaultCurrent:"1",                              
                            pageSizeOptions: ["10","50", "100", "150"],                                            
                            showSizeChanger: true, locale: {items_per_page: ""}     
                           }}       
                        /> ,
                        'Số lượng: '+ dataYL.length                     
                    ],
                },
                {
                    label: 'Giờ Thực Hiện',
                    key: '2',
                    children: [ 
                        <Table   
                        rowKey={"servicedataid"}                    
                        bordered
                        dataSource={dataTH} columns={columns}                      
                        key="tbkth"
                        pagination={{
                            defaultPageSize:"10" , 
                            defaultCurrent:"1",                              
                            pageSizeOptions: ["10","50", "100", "150"],                                            
                            showSizeChanger: true, locale: {items_per_page: ""}     
                           }}                                
                        />,
                        'Số lượng: '+ dataTH.length    ,      
                    ],  
                                   
                },
                {
                    label: 'Giờ Kết Quả',
                    key: '3',
                    children: [ 
                        <Table   
                        rowKey={"servicedataid"}                    
                        bordered
                        dataSource={dataKQ} columns={columns}                      
                        key="tbkqs"
                        pagination={{
                            defaultPageSize:"10" , 
                            defaultCurrent:"1",                              
                            pageSizeOptions: ["10","50", "100", "150"],                                            
                            showSizeChanger: true, locale: {items_per_page: ""}     
                           }}       
                        />   ,
                        'Số lượng: '+ dataKQ.length    ,                         
                    ],
                }               
                ]}
            />
                <CreateEkip              
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                form={form}
                dataEkip={dataEkip}
                dataBS={dataBS}
                onCreate ={onCreate}
             />       
                                      
        </div>
    )
}

export default BacsiYlenhPage;
