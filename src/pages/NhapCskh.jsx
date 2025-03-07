import { AutoComplete, Button, DatePicker, Input, notification, Select, Space, Spin, Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import { getbnBynv, postbaocaoIcdApi, postDoctorApi, postIcdApi } from "../util/api";
import { AudioOutlined, SearchOutlined } from "@ant-design/icons";
import ModelNapCskh from "../components/module/ModelNapCskh";

const NhapCskhPage = () => {   
    const { Search } = Input;
    const { RangePicker } = DatePicker;
    const [pending, setPending]= useState(false);  
    const [dataOp, setDataOp] = useState([]); 
    const [dateOp, setDateOp] = useState([]); 
    const [icd, setICD] = useState('');   
    const [keyword, setKeyword] = useState('');
    const [dataKhachhang, setDataKhachhang]= useState([]); 
    const [isModalNap, setIsModalNap] = useState(false);
    useEffect(() => {   
        fetchKhachhang();        
    }, []);
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
    const keys  = ["loairv","patientrecordid","patientrecordid_vp"] 
      const OnClickHs = async () => {      
            setDataBaocao([]);    
            setPending(true);               
            let data = {...dateOp,icd};            
            const res = await postbaocaoIcdApi(data);   
            if (!res?.message) { 
                setPending(false);
                if(res?.thongbao){
                    notification.success({
                        message: "Thành công",
                        description: res.thongbao
                    })
                }else
                setFilData(res);                
            } else {
                setPending(false);
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                })
            }
        
        
      };    
    const setFilData=(data)=>{
        setDataKhachhang(data.filter(item=> item.trangthai.toLowerCase()==='0'));  
    };  
    const onChangeDate = (date, dateString) => {        
       // console.log("date", dateString);
       setDateOp(dateString);
    };  
    const showNap = () => {  
        setIsModalNap(true);
    };
    const fetchKhachhang = async () => {
        const res = await getbnBynv("","","Phòng khám mới");
        if (!res?.message) {   
               setFilData(res.khgoi); 
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
    }
    return (
        <> 
         <div style={{ padding: 20 }}>
          <Space.Compact key={"spacehs"} block>
            <RangePicker onChange={onChangeDate}/>    
            <Button type="primary" 
                 onClick={OnClickHs}
                ><SearchOutlined /></Button>
              <Button 
                        type="dashed"
                        onClick={showNap}
                    >
                        Nạp Khách Hàng
                    </Button> 
            </Space.Compact>    
                <Tabs
                    defaultActiveKey="1"
                    items={[
                    {
                        label: `Danh sách chưa gọi (${dataKhachhang.length})`,
                        key: 'chuyentuyen',
                        children: [                           
                            <Table   
                            rowKey={"patientrecordid"}                    
                            bordered                       
                            dataSource={dataKhachhang} columns={columns}                 
                            key="cskhkhl"
                            loading={{ indicator: <div><Spin /></div>, spinning:pending}}
                            /> ,
                            'Số lượng: '+ dataKhachhang.length                     
                        ],
                    }
                    ]}
                />  
                  <ModelNapCskh
                    open={isModalNap}
                    setOpen={setIsModalNap}
                    refetch={fetchKhachhang}               
                   />    
        </div>                       
        </>
       
    )
}

export default NhapCskhPage;
