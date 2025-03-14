import {  Button, Col, DatePicker, Layout, notification, Row, Space } from "antd";
import { useEffect, useState } from "react";
import { getLsCskhApi, postbaocaocskhApi, postbaocaongoaitruChitietApi, postcskhPidApi } from "../util/api";
import { SearchOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import ChartComponent from "../components/module/ChartComponent";
import BlogList from "../components/module/BlogList";
import ModelbcCskhchitiet from "../components/module/ModelbcCskhchitiet";

const BaocaoCskhPage = () => {   
    const { RangePicker } = DatePicker;  
    const [dateOp, setDateOp] = useState([]); 
    const [dataKh, setDataKh]= useState([]); 
    const [dataKhS4, setDataKhS4]= useState([]); 
    const [loadingPost, setLoadingPost] = useState(false);
    const [dataChart, setDataChart]= useState([]);     
    const [isModalChitiet, setIsModalChitiet] = useState(false);
    const [pendingChitiet, setPendingChitiet]= useState(true);  
    const [dataChitiet, setDataChitiet]= useState([]);   

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
    const ShowChitiet = async() => {        
        setIsModalChitiet(true);       
        setPendingChitiet(true);
        const res = await postbaocaocskhApi(dateOp); 
        setFilData(res)
        setFildataChitiet(res);      
        setPendingChitiet(false);        
    };
    const setFildataChitiet = (items) => {          
        const arrPdt_Noi = []; 
        const arrPdt_Ngoai = []; 
        const arrPdt_Nhi = []; 
        const arrPdt_Mat = []; 
        const arrPdt_Tmh = []; 
        const arrPdt_San = []; 
        // const arrPdt_LCK = [];    
        const arrPdt_YHCT = [];    
        const arr_PhongKham = [];    
        for (let item of items) {
            if(item.roomid_out===500)
                arrPdt_Noi.push(item);
            else if(item.roomid_out===341)
                arrPdt_Ngoai.push(item);
            else if(item.roomid_out===672)
                arrPdt_Nhi.push(item);
            else if(item.roomid_out===674)
                arrPdt_Mat.push(item);
            else if(item.roomid_out===392)
                arrPdt_Tmh.push(item);
            else if(item.roomid_out===393)
                arrPdt_San.push(item);
            else if(item.roomid_out===396)
                arrPdt_YHCT.push(item);
            else
                arr_PhongKham.push(item);

        }       
        const arrBaocao=[];
        //const arrS1 = data.filter(item=> item.trangthai.toLowerCase()==='1'); 
//        arrchart.push({name:"Không có SĐT",value:arrS1.length});

        arrBaocao.push({
            name:"PĐT Nội",
            roomid:500,
            ksdt:arrPdt_Noi.filter(item=> item.trangthai.toLowerCase()==='1').length,
            knm:arrPdt_Noi.filter(item=> item.trangthai.toLowerCase()==='2').length,
            hl:arrPdt_Noi.filter(item=> item.trangthai.toLowerCase()==='3').length,
            khl:arrPdt_Noi.filter(item=> item.trangthai.toLowerCase()==='4').length,
            ss:arrPdt_Noi.filter(item=> item.trangthai.toLowerCase()==='5').length,
            tong:arrPdt_Noi.filter(item=> item.trangthai.toLowerCase()!=='0').length
        })
        arrBaocao.push({
            name:"PĐT Ngoại",
            roomid:341,
            ksdt:arrPdt_Ngoai.filter(item=> item.trangthai.toLowerCase()==='1').length,
            knm:arrPdt_Ngoai.filter(item=> item.trangthai.toLowerCase()==='2').length,
            hl:arrPdt_Ngoai.filter(item=> item.trangthai.toLowerCase()==='3').length,
            khl:arrPdt_Ngoai.filter(item=> item.trangthai.toLowerCase()==='4').length,
            ss:arrPdt_Ngoai.filter(item=> item.trangthai.toLowerCase()==='5').length,
            tong:arrPdt_Ngoai.filter(item=> item.trangthai.toLowerCase()!=='0').length
        })
        arrBaocao.push({
            name:"PĐT Nhi",
            roomid:672,
            ksdt:arrPdt_Nhi.filter(item=> item.trangthai.toLowerCase()==='1').length,
            knm:arrPdt_Nhi.filter(item=> item.trangthai.toLowerCase()==='2').length,
            hl:arrPdt_Nhi.filter(item=> item.trangthai.toLowerCase()==='3').length,
            khl:arrPdt_Nhi.filter(item=> item.trangthai.toLowerCase()==='4').length,
            ss:arrPdt_Nhi.filter(item=> item.trangthai.toLowerCase()==='5').length,
            tong:arrPdt_Nhi.filter(item=> item.trangthai.toLowerCase()!=='0').length
        })
        arrBaocao.push({
            name:"PĐT Mắt",
            roomid:674,
            ksdt:arrPdt_Mat.filter(item=> item.trangthai.toLowerCase()==='1').length,
            knm:arrPdt_Mat.filter(item=> item.trangthai.toLowerCase()==='2').length,
            hl:arrPdt_Mat.filter(item=> item.trangthai.toLowerCase()==='3').length,
            khl:arrPdt_Mat.filter(item=> item.trangthai.toLowerCase()==='4').length,
            ss:arrPdt_Mat.filter(item=> item.trangthai.toLowerCase()==='5').length,
            tong:arrPdt_Mat.filter(item=> item.trangthai.toLowerCase()!=='0').length
        })
        arrBaocao.push({
            name:"PĐT TMH",
            roomid:392,
            ksdt:arrPdt_Tmh.filter(item=> item.trangthai.toLowerCase()==='1').length,
            knm:arrPdt_Tmh.filter(item=> item.trangthai.toLowerCase()==='2').length,
            hl:arrPdt_Tmh.filter(item=> item.trangthai.toLowerCase()==='3').length,
            khl:arrPdt_Tmh.filter(item=> item.trangthai.toLowerCase()==='4').length,
            ss:arrPdt_Tmh.filter(item=> item.trangthai.toLowerCase()==='5').length,
            tong:arrPdt_Tmh.filter(item=> item.trangthai.toLowerCase()!=='0').length
        })
        arrBaocao.push({
            name:"PĐT Sản",
            roomid:393,
            ksdt:arrPdt_San.filter(item=> item.trangthai.toLowerCase()==='1').length,
            knm:arrPdt_San.filter(item=> item.trangthai.toLowerCase()==='2').length,
            hl:arrPdt_San.filter(item=> item.trangthai.toLowerCase()==='3').length,
            khl:arrPdt_San.filter(item=> item.trangthai.toLowerCase()==='4').length,
            ss:arrPdt_San.filter(item=> item.trangthai.toLowerCase()==='5').length,
            tong:arrPdt_San.filter(item=> item.trangthai.toLowerCase()!=='0').length
        })
        arrBaocao.push({
            name:"PĐT YHCT",
            roomid:396,
            ksdt:arrPdt_YHCT.filter(item=> item.trangthai.toLowerCase()==='1').length,
            knm:arrPdt_YHCT.filter(item=> item.trangthai.toLowerCase()==='2').length,
            hl:arrPdt_YHCT.filter(item=> item.trangthai.toLowerCase()==='3').length,
            khl:arrPdt_YHCT.filter(item=> item.trangthai.toLowerCase()==='4').length,
            ss:arrPdt_YHCT.filter(item=> item.trangthai.toLowerCase()==='5').length,
            tong:arrPdt_YHCT.filter(item=> item.trangthai.toLowerCase()!=='0').length
        })
        arrBaocao.push({
            name:"Phòng Khám",
            roomid:1001,
            ksdt:arr_PhongKham.filter(item=> item.trangthai.toLowerCase()==='1').length,
            knm:arr_PhongKham.filter(item=> item.trangthai.toLowerCase()==='2').length,
            hl:arr_PhongKham.filter(item=> item.trangthai.toLowerCase()==='3').length,
            khl:arr_PhongKham.filter(item=> item.trangthai.toLowerCase()==='4').length,
            ss:arr_PhongKham.filter(item=> item.trangthai.toLowerCase()==='5').length,
            tong:arr_PhongKham.filter(item=> item.trangthai.toLowerCase()!=='0').length
        })
        setDataChitiet(arrBaocao);             
    }
    const OnClickBaocao = async () => { 
            setLoadingPost(true);  
            const res = await postbaocaocskhApi(dateOp);  
            // console.log(res); 
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
                        onClick={ShowChitiet}
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
        </div>,
        <ModelbcCskhchitiet
                open={isModalChitiet}
                setOpen={setIsModalChitiet}
                loading={pendingChitiet}
                data={dataChitiet}               
            />                         
        </>
       
    )
}

export default BaocaoCskhPage;
