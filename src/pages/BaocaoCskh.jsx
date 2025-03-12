import { AutoComplete, Button, Col, DatePicker, Input, Layout, notification, Row, Select, Space, Spin, Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import { getbnBynv, getLsCskhApi, postbaocaoIcdApi, postcskhPidApi, postDoctorApi, postIcdApi } from "../util/api";
import { AudioOutlined, SearchOutlined } from "@ant-design/icons";
import ModelNapCskh from "../components/module/ModelNapCskh";
import { Content } from "antd/es/layout/layout";
import ChartComponent from "../components/module/ChartComponent";
import BlogList from "../components/module/BlogList";

const BaocaoCskhPage = () => {   
    const { Search } = Input;
    const { RangePicker } = DatePicker;
    const [pending, setPending]= useState(false);  
    const [dataOp, setDataOp] = useState([]); 
    const [dateOp, setDateOp] = useState([]); 
    const [icd, setICD] = useState('');   
    const [keyword, setKeyword] = useState('');
    const [dataKhachhang, setDataKhachhang]= useState([]); 
    const [isModalNap, setIsModalNap] = useState(false);
    const [dataKh, setDataKh]= useState([]); 
    useEffect(() => {   
        fetchKhachhang();        
    }, [])
 
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
    const fetchKhachhang = async () => {
        const res = await getLsCskhApi();
        console.log("bacocao>>",res);
        if (!res?.message) {   
            setDataKh(res);              
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
    }  
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
  
    const posts = [
        { id: 1, title: "Học ReactJS cơ 1", excerpt: "React là thư viện mạnh mẽ cho UI..." },
        { id: 2, title: "Tìm hiểu về Ant 2", excerpt: "Ant Design giúp tạo UI chuyên nghiệp..." },
        { id: 3, title: "Tìm hiểu về Ant 3", excerpt: "Ant Design giúp tạo UI chuyên nghiệp..." },
        { id: 4, title: "Tìm hiểu về Ant 4", excerpt: "Ant Design giúp tạo UI chuyên nghiệp..." },
        { id: 5, title: "Tìm hiểu về Ant 5", excerpt: "Ant Design giúp tạo UI chuyên nghiệp..." },
        { id: 11, title: "Học ReactJS cơ bản", excerpt: "React là thư viện mạnh mẽ cho UI..." },
        { id: 12, title: "Tìm hiểu về Ant Design", excerpt: "Download the Chrome extension to switch your default search engine to ChatGPT, and get instant answers from trusted sources with every search...." },
        { id: 13, title: "Tìm hiểu về Ant Design", excerpt: "Ant Design giúp tạo UI chuyên nghiệp..." },
        { id: 14, title: "Tìm hiểu về Ant Design", excerpt: "Ant Design giúp tạo UI chuyên nghiệp..." },
        { id: 15, title: "Tìm hiểu về Ant Design", excerpt: "Download the Chrome extension to switch your default search engine to ChatGPT, and get instant answers from trusted sources with every search...." }
      ];
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
                        Báo cáo CSKH
                    </Button> 
            </Space.Compact>    
            <Layout style={{ padding: "20px" }}>
                <Content>
                    <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <BlogList posts={dataKh} />
                    </Col>
                    <Col xs={24} md={12}>
                        <ChartComponent />
                    </Col>
                    </Row>
                </Content>
            </Layout>  
        </div>                       
        </>
       
    )
}

export default BaocaoCskhPage;
