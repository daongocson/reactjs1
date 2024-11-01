import { CrownOutlined, DeleteOutlined, FileExcelOutlined, GithubOutlined, SearchOutlined, SignatureOutlined } from "@ant-design/icons";
import { AutoComplete, Button, DatePicker, Form, message, notification, Result, Space, Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import { getuserduyetApi, postmaquyenApi, postycbydateApi } from "../util/api";
import { CSVLink } from "react-csv";
import Duyeths from "../components/module/Duyeths";
import DuyetNick from "../components/module/DuyetNick";
import DuyetBasic from "../components/module/DuyetBasic";
import DuyetBasicData from "../components/module/DuyetBasicData";
const QuantriPage = () => {   
      const [datebc, setDatebc]= useState(''); 
      const [optionNgay, setoptionNgay]= useState(''); 
      const [datayc, setDatayc]= useState([]); 
      const [duyetUser, setDuyetUser]= useState([]); 
      const [dataUser, setDataUser]= useState([]); 
      const [isModalVisible, setIsModalVisible] = useState(false); 
      const [isbasicVisible, setIsbasicVisible] = useState(false);  
      const [isbasicVisibleData, setIsbasicVisibleData] = useState(false);                
      const [form] = Form.useForm();
      const handleOnSelect  = (value) => {
        console.log("onSelect", value);
      };
      const columns = [
        {
            title: 'Tên bệnh nhân',
            dataIndex: 'tenbn',
        },
        {
            title: 'Yêu cầu',
            dataIndex: 'yeucau',
        }, {
            title: 'Dịch vụ YC',
            dataIndex: 'dichvu',
        }, 
        {
            title: 'Ngày Ra',
            dataIndex: 'nrv',
        },{
            title: 'Ngày YC',
            dataIndex: 'nyc',
        },{
            title: 'Ngày Duyệt',
            dataIndex: 'nduyet',
        }
    ];  
    const showModal = (record) => {           
        setDataUser(record);
        form.setFieldsValue({tenbn:record.nhanviencode,idyc:record.idnv}); 
        setIsModalVisible(true);
      };  
      const showModalInfo = (record) => {           
        setDataUser(record);       
        setInfoVisible(true);
      }
      const onCreateBasic = async (data) =>{      
                
        const res = await postmaquyenApi(data);
        if (res?.message) {          
            if(res.message=="sucess"){
                notification.success({
                    message: "Duyệt YC thành công",
                    description: res.duyet
                })
            }
            else {
                notification.error({
                    message: "Duyệt YC thất bại",
                    description: res.duyet
                })
            }
            
         } else {
             notification.error({
                 message: "Duyệt YC thất bại",
                 description: res.message
             })
         }  
       
      }  
      const onCreate = async (data) =>{       
       dataUser.action = data.maquyen;           
       const res = await getuserduyetApi(dataUser);
       if (!res?.message) {
            if(res.recordset)                    
                setDuyetUser(res.recordset);           
            if(res.duyet){
                notification.success({
                message: "Duyệt Thành công",
                description: res.duyet
            })
            }    
        } else {
            notification.error({
                message: "Duyệt YC thất bại",
                description: res.message
            })
        }  
      
     }    
     const onCreateData = async (data) =>{    
        const res = await getuserduyetApi(data);
        if (res?.message) {
            if(res.message=='fail'){
                notification.error({
                    message: "Duyệt YC thất bại",
                    description: res.duyet
                })
            }            
            else {
                notification.success({
                    message: "Phân quyền thành công",
                    description: res.duyet
                })
            } 
         }else{
            notification.success({
                message: "Phân quyền thành công",
                description: res.duyet
            })
         }  
       
      }      
    const columnsduyet = [
        {
            title: 'Account đăng nhập',
            dataIndex: 'nhanviencode',
        },
        {
            title: 'CCHN',
            dataIndex: 'nhanviencode_byt',
        }, {
            title: 'Trạng thái',
            dataIndex: 'duyet'
        }, {
            title: 'Ngày YC',
            dataIndex: 'ntao',
        },{
            title: 'Duyệt',
            dataIndex: 'idnv',
            key: 'idnv',
            render: (index, record) => (                
                <Button  icon={<SignatureOutlined />} onClick={() => showModal(record)} />                 
            )
          }
    ];  
    useEffect(() => {  
        const fetchUser= async()=>{
            const res = await getuserduyetApi({data:"aa",action:"view"});
            if (!res?.message) {                
                setDuyetUser(res);              
            } else {
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                })
            }
        } 
        fetchUser();        
    }, [])
      const OnClickHs = async () => {
        if(datebc&&optionNgay){
            var option =0;
            if(optionNgay=="Đúng ngày")
                option=1;
            else if(optionNgay=="Trái ngày")
                option=2;
            else if(optionNgay=="Tất cả")
                option=3;
            else{
                option =4;
            }
            const res = await postycbydateApi({datebc:datebc,option:option});
            if (!res?.message) { 
                if(res?.thongbao){
                    notification.success({
                        message: "Thành công",
                        description: res.thongbao
                    })
                }else
                    setDatayc(res);   
            } else {
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                })
            }
        }
      };
      const OnClickPhanquyen = async () => {
        setIsbasicVisibleData(true);       
      }
    return (
        <div >           
            <Tabs
                defaultActiveKey="1"
                items={[
                {
                    label: 'Trang admin EHC',
                    key: '1',
                    children: [ 
                        <Result
                            key={"adfdf"}
                            icon={<CrownOutlined />}
                            title="Trang quản trị dành cho IT"
                        >
                        </Result>
                    ],
                },{
                    label: 'Duyệt nick bác sĩ',
                    key: '2dd',
                    children: [    
                        <Table  
                            key={"tbduyetuser"}
                            rowKey={"idnv"}                    
                            bordered
                            dataSource={duyetUser} 
                            columns={columnsduyet}   
                            defaultPageSize={10}                                  
                            pagination={{
                                defaultPageSize:"10" , 
                                defaultCurrent:"1",
                                total: datayc.length, 
                                pageSizeOptions: ["10","50", "100", "150"],                   
                                showSizeChanger: true, locale: {items_per_page: ""} 
                               }}           
                        
                                               
                        /> ,
                        <Button key='btnphanquyen' type="primary" onClick={OnClickPhanquyen}><GithubOutlined />Phân quyền</Button>                   
                                   
                    ],
                },{
                    label: 'Tổng hợp Hồ sơ',
                    key: '3',
                    children: [ 
                        <Space.Compact key={"spacehs"} block>
                        <DatePicker   
                            placeholder="Ngày Duyệt YC"
                            onChange={(date, dateString)=>{setDatebc(dateString)}}                       
                            style={{
                                width: '40%',
                            }}
                        />
                         <AutoComplete                        
                                style={{   
                                width: "40%"            
                            }}                                     
                            onSelect={(value)=>{setoptionNgay(value)}}
                            options={[
                                {key: '1a', label: 'Đúng ngày', value: 'Đúng ngày'},
                                {key: '2a', label: 'Trái ngày', value: 'Trái ngày'} ,
                                {key: '3a', label: 'Tất cả', value: 'Tất cả'} ,
                                {key: '4a', label: 'Cập nhật Ngày RV', value: 'Cập nhật'}                           
                            ]}
                            filterOption={true}                               
                            >   
                        </AutoComplete>
                        <Button type="default" onClick={OnClickHs}><SearchOutlined /></Button>
                        <CSVLink 
                            filename={"Tonghop-hosoyeucau.csv"}   
                            icon={<FileExcelOutlined />}                        
                            data={datayc}><Button
                              icon={<FileExcelOutlined />}
                            type="default"/>
                        </CSVLink>
                        <Button type="primary" onClick={
                            ()=>{                               
                                setIsbasicVisible(true);
                                }}><DeleteOutlined /></Button>
                      </Space.Compact>,
                        <Table  
                            key={"tbsdsd"}
                            rowKey={"idyc"}                    
                            bordered
                            dataSource={datayc} 
                            columns={columns}   
                            defaultPageSize={10}                                  
                            pagination={{
                                defaultPageSize:"10" , 
                                defaultCurrent:"1",                              
                                pageSizeOptions: ["10","50", "100", "150"],                                            
                                showSizeChanger: true, locale: {items_per_page: ""}     
                               }}           
                        
                                               
                        /> ,                        
                        'Số lượng: '+ datayc.length                        
                    ]
                },
                ]}
                />  
                  <DuyetNick              
                        isModalVisible={isModalVisible}
                        setIsModalVisible={setIsModalVisible}
                        form={form}
                        onCreate ={onCreate}
                        modaldata={dataUser}
                    />
                    <DuyetBasic
                        isbasicVisible={isbasicVisible}
                        setIsbasicVisible={setIsbasicVisible}
                        onCreate ={onCreateBasic}
                        form={form}
                    />    
                     <DuyetBasicData
                        isbasicVisible={isbasicVisibleData}
                        setIsbasicVisible={setIsbasicVisibleData}
                        onCreate ={onCreateData}
                        form={form}
                    />  
        </div>         
      
    )
}
export default QuantriPage;