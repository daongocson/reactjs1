import { useEffect, useState } from "react";
import { Tabs, AutoComplete, Input, Table, Button, Form } from 'antd';
import { getLsDoctorApi, postbacsiApi } from "../util/api";
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
   //   console.log("check creatdocteo",quyen,phong,dataBS);
        form.setFieldsValue({mabhyt:dataBS[3].value,tenbs:dataBS[1].value,mabs:dataBS[0].value});       
        setIsModalVisible(true);
    }
    const onCreate = async () => {
        console.log("onCreate>>>>");
       // form.setFieldsValue({mabs:"acd",idyc:record.idyc}); 
      //  setIsModalVisible(true);
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
                defaultActiveKey="1"
                items={[
                {
                    label: 'Giờ Y Lệnh',
                    key: '1',
                    children: [ 
                        <Table   
                        rowKey={"servicedataid"}                    
                        bordered
                        dataSource={dataYL} columns={columns}                      
                           key="tbkyls"
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
                        />   ,
                        'Số lượng: '+ dataKQ.length    ,                         
                    ],
                },
                {
                    label: 'Tạo ekip mới',
                    key: '4',
                    children: [ 
                        <Table   
                        rowKey={"keyid"}                    
                        bordered
                        dataSource={dataBS} columns={columnbs}                       
                        key="tbabs"
                        />   ,
                        <Button key={"btn-createbs"} type="primary" onClick={creatDoctors}>Sao chép BS</Button>
                    ],
                }
                ]}
            />
                <CreateEkip              
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                form={form}
                onCreate ={onCreate}
             />       
                                      
        </div>
    )
}

export default BacsiYlenhPage;
