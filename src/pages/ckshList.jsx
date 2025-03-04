import { useEffect, useState } from "react";
import { Tabs, Table, Button, Space, DatePicker, Input, AutoComplete, notification } from 'antd';
import { getbnBynv, getLsCskhApi, postbacsiApi, postcskhPidApi, postpatientApi} from "../util/api";
import { AudioOutlined, SignatureOutlined } from "@ant-design/icons";
import ModelView from "../components/module/ModelView";
import ModelViewCskh from "../components/module/ModelViewCskh";
const CSKHListPage = () => {       
    const [dataKh, setDataKh]= useState([]); 
    const [dataKhCxl, setDataKhCxl]= useState([]); 
    const [dataKhNm, setDataKhNm]= useState([]); 
    const [dataKhLast, setDataKhLast]= useState([]); 

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const { Search } = Input;
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [autoKhoa, setAutoKhoa] = useState('');
    const [keyword, setKeyword] = useState('');
    const [pid, setPid] = useState('');
    const [phone, setPhone] = useState('');
    const [modaldata, setModaldata] = useState([]);


    useEffect(() => {   
        fetchKhachhang();        
    }, [])
    const onSearch = async(value, _e, info) => {  
    }
    const columns = [
        {
            title: 'Mã BN',
            dataIndex: 'idcskh',
        },              
        {
            title: 'Họ và tên',
            dataIndex: 'tenbn',
        },
        {
            title: 'Phòng khám',
            dataIndex: 'pkham',
        },
        {
            title: 'Bác sĩ',
            dataIndex: 'bacsi',
        },{
            title: 'Phone',
            dataIndex: 'phone',
        },{
            title: 'Ngày RV',
            dataIndex: 'ngayravien',
        },{
            title: 'Ghi chú',
            dataIndex: 'ghichu',
        },{
            title: 'Duyệt',
            dataIndex: 'id',
            key: 'id',
            render: (index, record) => (
              <Button  icon={<AudioOutlined />} onClick={() => showModal(record)} />
            )
          },
          
    ]; 
    const columnlast = [
        {
            title: 'Mã BN',
            dataIndex: 'idcskh',
        },              
        {
            title: 'Họ và tên',
            dataIndex: 'tenbn',
        },        
        {
            title: 'Bác sĩ',
            dataIndex: 'bacsi',
        },{
            title: 'Phone',
            dataIndex: 'phone',
        },{
            title: 'Ngày goi',
            dataIndex: 'ngaycapnhat',
        },{
            title: 'Duyệt',
            dataIndex: 'id',
            key: 'id',
            render: (index, record) => (
              <Button  icon={<AudioOutlined />} onClick={() => showModal(record)} />
            )
          },
          
    ]; 
    const loadDataModel=async(pid)=>{    
        setLoading(true);             
        // const res = await postpatientApi(pid);  
        const res = await postcskhPidApi(pid);      
        // console.log("viewcskh>>",res);                 
        if (!res?.message) {                    
            setLoading(false);
            setModaldata(res);
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
    }
    const showModal = (record) => {  
        if(record["patientrecordid"]!==''){
            const phoneNumber = record["phone"];
            setPid(record["idcskh"]);
            setPhone(phoneNumber);
            loadDataModel(record["patientrecordid"]);
        }        
        // Initiate the call
        // omiSDK.makeCall(phoneNumber);  
        
        setIsModalVisible(true);
      };
    const fetchKhachhang = async () => {
        const res = await getbnBynv(fromDate,toDate,"Phòng khám mới");
        if (!res?.message) {   
            setFilData(res.khgoi); 
            setDataKhLast(res.khvuagoi)                     
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
    }
    const setFilData=(data)=>{
        setDataKh(data);
        setDataKhCxl(data.filter(item=> item.trangthai.toLowerCase()==='0'));
        setDataKhNm(data.filter(item=> item.trangthai.toLowerCase()==='2'));
    };  
    const config=()=>{      
                let config = {
                        theme: 'default', // sử dụng UI mặc định của sdk
                        debug: true, // cho phép console.log các event call và trạng thái trong sdk
                        busy: false, // nếu true, sẽ auto reject các cuộc gọi đến, nhưng vẫn có thể thực hiện cuộc gọi ra
                        language: 'vi', // Ngôn ngữ giao diện dialog,
                        ringtoneVolume: 0.5,
                         options: {                      
                             hideCallButton: false, // ẩn hiển thị nút toggle dialog nhập số để gọi ra mặc định                      
                         },
                       
                        callbacks: {
                            register: (data) => {                                
                            },
                            connecting: (data) => {                                
                            },
                            invite: (data) => {                                
                                 console.log('invite:', data);
                            },
                            inviteRejected: (data) => {                                
                            },
                            ringing: (data) => {                                
                            },
                            accepted: (data) => {
                                
                            },
                            incall: (data) => {                                
                            },
                            acceptedByOther: (data) => {                                
                            },
                            ended: (data) => {
                                
                            },
                            holdChanged: (status) => {                                
                            },
                            saveCallInfo: (data) => {
                                
                            },
                        }                        
                    };
                    // flow dùng cơ bản: Init SDK với config, sau đó register tới tổng đài trong callback của fucntion init
                    omiSDK.init(config, () => {                       
                        let extension = {
                            domain: 'cnttminhan',
                            username: '100',
                            password: 'Cg7xcBf9ur',
                        };
                        omiSDK.register(extension);
                        console.log("click config me!!");                      
        });	
        
    } 
    const handleOnSelect=async ()=>{
        const res = await getbnBynv(fromDate,toDate,autoKhoa);
        if (!res?.message) {   
            setFilData(res.khgoi);    
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
    }
    const keys  = ["pkham","tenbn"]
    const searchTable=(data)=>{   
        return data.filter(
            (item)=>(
                keys.some((key)=>item[key].toLowerCase().includes(keyword.toLowerCase())
            )));      
    } 
    const handleOk=()=>{
        setIsModalVisible(false);
    }
    const handleCancel=()=>{
        setIsModalVisible(false);
    }
    return (
        <div style={{ padding: 20 }}>    
        <div className="ant-col ant-col-xs-24 ant-col-xl-8">
                
                <Space.Compact key={"spacehs"} block>                                   
                <DatePicker   
                        label="Từ ngày"
                        placeholder="Từ ngày"
                        onChange={(date, dateString)=>{setFromDate(dateString)}}                       
                        style={{
                            width: '160',
                        }}
                    />  <DatePicker                       
                    placeholder="Tới ngày"
                    onChange={(date, dateString)=>{setToDate(dateString)}}                       
                    style={{
                        width: '160',
                    }}
                />  
                    <AutoComplete
                    style={{   
                        width: "100%"            
                    }}
                    placeholder="Chọn khoa"
                    options={[
                        {key: '1k', label: 'Khoa khám bệnh', value: 'Khoa khám bệnh'},
                        {key: '2n', label: 'Khoa Nội', value: 'Khoa Nội'} ,
                        {key: '3ng', label: 'Khoa Ngoại', value: 'Khoa Ngoại'} ,
                        {key: '3yh', label: 'Khoa YHCT', value: 'Khoa YHCT'} ,
                        {key: '4s', label: 'Khoa Sản', value: 'Khoa sản'}     
                                          
                    ]}
                    filterOption={true}
                    onSelect={(value)=>{setAutoKhoa(value)}}
                    >
                        
                    </AutoComplete>   
                    <Button type="dashed" onClick={handleOnSelect}>Lọc cuộc gọi</Button>             
                     <Button
                        type="primary"
                        onClick={config}
                    >
                        Cài đặt
                    </Button> 
             </Space.Compact>
        </div>     
                
           <Tabs
                defaultActiveKey="1"
                items={[
                {
                    label: `BN chưa gọi (${dataKhCxl.length})`,
                    key: 'b1',
                    children: [ 
                        <Search
                        placeholder="Nhập nội dung"
                        key={"seachCxl"}
                        allowClear
                        onChange={(event)=>setKeyword(event.target.value)}                      
                        style={{
                            width: "30%"                        
                        }}
                        /> ,
                        <Table   
                        rowKey={"patientrecordid"}                    
                        bordered                       
                        dataSource={searchTable(dataKhCxl)} columns={columns}                 
                        key="cskhkhl"
                        /> ,
                        'Số lượng: '+ dataKh.length                     
                    ],
                },{
                    label: `BN Vừa gọi (${dataKhLast.length})`,
                    key: 'bnvuagoi',
                    children: [ 
                        <Table   
                        rowKey={"patientrecordid"}                    
                        bordered
                        dataSource={dataKhLast} columns={columnlast}                       
                        key="cskhk1hl"
                        /> ,
                        'Số lượng: '+ dataKhLast.length                     
                    ]
                },{
                    label: `BN không nghe máy (${dataKhNm.length})`,
                    key: 'bn2',
                    children: [ 
                        <Table   
                        rowKey={"patientrecordid"}                    
                        bordered
                        dataSource={dataKhNm} columns={columns}                       
                        key="cskhk1hl"
                        /> ,
                        'Số lượng: '+ dataKhNm.length                     
                    ],
                },{
                    label: `Tất cả BN(${dataKh.length})`,
                    key: 'bn3',
                    children: [ 
                        <Table   
                        rowKey={"patientrecordid"}                    
                        bordered
                        dataSource={dataKh} columns={columns}                       
                        key="cskhk11hl"
                        /> ,
                        'Số lượng: '+ dataKh.length                     
                    ],
                }
                ]}
            />  
            <ModelViewCskh 
                open={isModalVisible}
                setOpen={setIsModalVisible}
                refetch={fetchKhachhang}
                phone={phone}
                loading={loading}
                pid={pid}
                modaldata={modaldata}
                handleOk={handleOk}
                handleCancel={handleCancel}
            />                                   
        </div>
    )
}

export default CSKHListPage;

