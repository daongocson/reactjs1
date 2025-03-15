import { useEffect, useRef, useState } from "react";
import { Tabs, Table, Button, Space, DatePicker, Input, AutoComplete, notification, Modal } from 'antd';
import { getbnBynv, getTokenApi, postcskhPidApi} from "../util/api";
import { PauseCircleOutlined, PhoneOutlined, PlayCircleOutlined, QuestionOutlined } from "@ant-design/icons";
import ModelViewCskh from "../components/module/ModelViewCskh";
const CSKHListPage = () => {       
    const [dataKh, setDataKh]= useState([]); 
    const [dataKhCxl, setDataKhCxl]= useState([]); 
    const [dataKhNm, setDataKhNm]= useState([]); 
    const [dataKhHL, setDataKhHL]= useState([]); 
    const { RangePicker } = DatePicker;

    const [dataKhLast, setDataKhLast]= useState([]); 

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalOpenPlay, setIsModalOpenPlay] = useState(false);
    const [loadingPlay, setloadingPlay] = useState(false);
    const [dateOp, setDateOp] = useState([]); 
    const [loading, setLoading] = useState(true);
    const { Search } = Input;
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [autoKhoa, setAutoKhoa] = useState('');
    const [keyword, setKeyword] = useState('');
    const [pid, setPid] = useState('');
    const [phone, setPhone] = useState('');
    const [modaldata, setModaldata] = useState([]);
    const [uuid,setUuid]=useState('');
    const [tenbn,setTenbn]=useState('');
    const [audioSrc, setAudioSrc] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);


    const [startCall, setStartCall] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {   
        fetchKhachhang();        
    }, [])        
    const togglePlay = () => {
      if(audioSrc=='')return;
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    };

    const playCallCskh =async(record) => {          
        setIsModalOpenPlay(true);   
        setloadingPlay(true);   
        if(token==''){
            const res = await getTokenApi();      
            if(res.access_token){
                // console.log("access_token",res.access_token);
                setToken(res.access_token);
                const link = getLink(record.transaction_id,res.access_token);
                // setAudioSrc(link);
            }
            else{
                setloadingPlay(false); 
                console.log("Lấy token thất bại");
            }
        }else{
            const link = await getLink(record.transaction_id,token,record.tenbn);         
            console.log("Play>",link);
        }
        
    }
    const getLink =async(uuid,to_ken,tenbn)=>{
        // console.log("getlink",uuid,"to_ken>>",to_ken);
        setTenbn(tenbn);
        const url_mp3= "https://public-v1-stg.omicall.com/api/v2/callTransaction/getByTransactionId"; 
        const response  = await fetch(url_mp3,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization":to_ken
            },
            body: JSON.stringify({transactionId:uuid})
        }); 
        const {payload} = await response.json();  
        // https://public-v1-stg.omicrm.com/third_party/recording/uc?id=NTJkTkVjZXBCamRvODdCSjBJYlFZdEp3L2Z2V3JMOEdqdXJQWU53bDJ0VXRVSWdvNzlKZGJIQWpVcFd1WnNHTzl3b2hkbzBUSTJadDk1OHh6bUtaa2c9PQ==&code=21c2b76d-35e2-40c0-a88c-b643b5a1c596
        // console.log("access_token",payload.transaction_id,"phone",payload.destination_number,"urlmp3",payload.recording_file_url);
        if(payload.recording_file_url)setAudioSrc(payload.recording_file_url);
        // if(mp3link!=='')
        setloadingPlay(false);
        console.log("url",payload.recording_file_url);
        return payload.recording_file_url;

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
            title: 'Gọi',
            dataIndex: 'id',
            key: 'id',
            render: (index, record) => (
                <Space size="middle">
                    <Button  icon={<PhoneOutlined />} onClick={() => showModal(record)} />
                    {record ?.transaction_id?(<Button  icon={<PlayCircleOutlined />} onClick={() => playCallCskh(record)} />):(<QuestionOutlined />)} 
                </Space>
              
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
            title: 'Gọi',
            dataIndex: 'id',
            key: 'id',
            render: (index, record) => (
                <Space size="middle">
                <Button  icon={<PhoneOutlined />} onClick={() => showModal(record)} />
                {record ?.transaction_id?(<Button  icon={<PlayCircleOutlined />} onClick={() => playCallCskh(record)} />):(<QuestionOutlined />)} 
            </Space>
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
        setPid(record["idcskh"]);       
        if(record["patientrecordid"]!==''){
            const phoneNumber = record["phone"];
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
        setDataKhHL(data.filter(item=> item.trangthai.toLowerCase()==='4'));
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
                                console.log('sondnon1 save call info:', data);

                            },
                            inviteRejected: (data) => {  
                            },
                            ringing: (data) => {  
                                const {uuid}=data;   
                                setUuid(uuid);                    
                            },
                            accepted: (data) => {
                                console.log('sondnon2 save call info:', data);

                            },
                            incall: (data) => {                               
                                console.log('sondnon3 save call info:', data);

                            },
                            acceptedByOther: (data) => { 
                                console.log('sondnon4 save call info:', data);
                     
                            },
                            ended: (data) => {
                                console.log('sondnon5 save call info:', data);

                            },
                            holdChanged: (status) => {                                
                                console.log('sondnon6 save call info:', data);
                            },
                            saveCallInfo: (data) => {
                                console.log('sondnon7 save call info:', data);

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
    const setDateChange=()=>{
        console.log("dateop>>",dateOp?.length);      

    }    
    const keys  = ["pkham","tenbn"]
    const searchTable=(data)=>{   
        return data.filter(
            (item)=>(
                keys.some((key)=>item[key].toLowerCase().includes(keyword.toLowerCase())
            )));      
    } 
    const handleOk=()=>{
        setStartCall(false);
        setIsModalVisible(false);
    }
    const handleCancel=()=>{
        setStartCall(false);
        setIsModalVisible(false);
        setIsModalOpenPlay(false);
    }
    const onChangeDate = (date, dateString) => { 
        if(dateString.length==2){
            setFromDate(dateString[0]);
            setToDate(dateString[1]);
        }       
        
      };
    return (        
        <div style={{ padding: 20 }}>    
            <div className="ant-col ant-col-xs-24 ant-col-xl-8">
                
                <Space.Compact key={"spacehs"} block>   
                <RangePicker onChange={onChangeDate}/>                                         
                {/* <DatePicker   
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
                />   */}
                    {/* <AutoComplete
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
                        
                    </AutoComplete>    */}
                    <Button type="primary" onClick={handleOnSelect}>Lọc cuộc gọi</Button>             
                    &nbsp;<Button
                        type="dashed"
                        onClick={config}
                    >
                        Sử dụng phone
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
                    label: `BN không hài lòng (${dataKhHL.length})`,
                    key: 'bnkhl',
                    children: [ 
                        <Table   
                        rowKey={"patientrecordid"}                    
                        bordered
                        dataSource={dataKhHL} columns={columns}                       
                        key="cskhkhl1"
                        /> ,
                        'Số lượng: '+ dataKhHL.length                     
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
                startCall={startCall}
                setStartCall={setStartCall}
                uuid={uuid}
                modaldata={modaldata}
                handleOk={handleOk}
                handleCancel={handleCancel}
            />  
             <Modal title={"Nghe lại cuộc gọi(" +tenbn+")"} open={isModalOpenPlay} onOk={handleCancel} onCancel={handleCancel} loading={loadingPlay}>
                <audio ref={audioRef} src={audioSrc} />
                <p>Link:{audioSrc}</p>
                <Button 
                    type="primary" 
                    icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />} 
                    onClick={togglePlay}
                    style={{ marginTop: 10 }}
                >
                    {isPlaying ? "Dừng" : "Nghe lại cuộc gọi"}
                </Button>
            </Modal>                                             
        </div>
        
    )
}

export default CSKHListPage;

