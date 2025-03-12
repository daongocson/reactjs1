import { AutoComplete, Button, Col, DatePicker, Input, Layout, notification, Row, Select, Space, Spin, Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import { getbnBynv, getLsCskhApi, postbaocaocskhApi, postbaocaoIcdApi, postcskhPidApi, postDoctorApi, postIcdApi } from "../util/api";
import { AudioOutlined, SearchOutlined } from "@ant-design/icons";
import ModelNapCskh from "../components/module/ModelNapCskh";
import { Content } from "antd/es/layout/layout";
import ChartComponent from "../components/module/ChartComponent";
import BlogList from "../components/module/BlogList";

const BaocaoCskhPage = () => {   
    const { RangePicker } = DatePicker;  
    const [dateOp, setDateOp] = useState([]); 
    const [dataKh, setDataKh]= useState([]); 
    const [dataKhS4, setDataKhS4]= useState([]); 
    const [loadingPost, setLoadingPost] = useState(false);
    const [dataChart, setDataChart]= useState([]);     
    useEffect(() => {   
        fetchKhachhang();        
    }, [])    
    const fetchKhachhang = async () => {
        const res = await getLsCskhApi();
        if (!res?.message) {   
            setDataKhS4(res);              
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
      const OnClickBaocao = async () => { 
            setLoadingPost(true);  
            const res = await postbaocaocskhApi(dateOp);   
            if (!res?.message) { 
                setLoadingPost(false);
                if(res?.thongbao){
                    notification.success({
                        message: "Thành công",
                        description: res.thongbao
                    })
                }else
                setFilData(res);                
            } else {
                setLoadingPost(false);
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                })
            }
        
        
      };    
      const setFilData=(data)=>{       
        // { value: '0', label: 'Chưa xử lý' },
        // { value: '1', label: 'Không có SĐT' },
        // { value: '2', label: 'Không nghe máy' },
        // { value: '3', label: 'Hài lòng' },
        // { value: '4', label: 'Không hài lòng' },
        // { value: '5', label: 'Sai số' }       
        let arrchart =[];        
        // const arrS0 = data.filter(item=> item.trangthai.toLowerCase()==='0'); 
        // arrchart.push({name:"Chưa xử lý",value:arrS0.length});
        const arrS1 = data.filter(item=> item.trangthai.toLowerCase()==='1'); 
        arrchart.push({name:"Không có SĐT",value:arrS1.length});

        const arrS2 = data.filter(item=> item.trangthai.toLowerCase()==='2'); 
        arrchart.push({name:"Không nghe máy",value:arrS2.length});

        const arrS3 = data.filter(item=> item.trangthai.toLowerCase()==='3'); 
        arrchart.push({name:"Hài lòng",value:arrS3.length});

        const arrS4 = data.filter(item=> item.trangthai.toLowerCase()==='4'); 
        arrchart.push({name:"Không hài lòng",value:arrS4.length});
        const arrS5 = data.filter(item=> item.trangthai.toLowerCase()==='5'); 
        arrchart.push({name:"Sai số",value:arrS5.length});
        setDataChart(arrchart);   
        setDataKhS4(arrS4);  
    };  
    const onChangeDate = (date, dateString) => {        
       // console.log("date", dateString);
       setDateOp(dateString);
    };  
    const showNap = () => {  
        setIsModalNap(true);
    };  
    
    return (
        <> 
         <div style={{ padding: 20 }}>
          <Space.Compact key={"spacehs"} block>
            <RangePicker onChange={onChangeDate}/>    
            <Button type="primary" 
                 onClick={OnClickBaocao}
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
                        <BlogList posts={dataKhS4} loadingPost={loadingPost} />
                    </Col>
                    <Col xs={24} md={12}>
                        <ChartComponent data={dataChart}/>
                    </Col>
                    </Row>
                </Content>
            </Layout>  
        </div>                       
        </>
       
    )
}

export default BaocaoCskhPage;
