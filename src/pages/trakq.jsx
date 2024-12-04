import { useLocation, useParams } from "react-router";
import { useEffect,useState} from "react";
import {  postkqclsApi} from "../util/api";
import { AutoComplete, Form, Input,Modal, Card, Result, notification } from 'antd';
import { useForm } from "antd/es/form/Form";
import { CheckCircleOutlined, CompassTwoTone, CrownOutlined, FieldTimeOutlined, FileProtectOutlined } from "@ant-design/icons";
import QRCode from 'react-qr-code';
export default function TrakqPage() {
    const [form] = Form.useForm();
    const { id } = useParams();
    const { url } = window.location.href;
    useEffect(() => {   
        fetchUser();        
    }, [])
    const [dataKH, setDataKH]= useState([]); 
    const [dataKB, setDataKB]= useState([]); 
    const [dataTH, setDataTH]= useState([]); 
    const [dataDV, setDataDV]= useState([]); 
    const idEncodeed= atob(id);
    const fetchUser = async () => {       
        const res = await postkqclsApi(id);                      
        if (!res?.message) {                    
            setDataKH(res.dataKH)          
            setDataKB(res.dataKB);              
            setDataTH(res.dataTH);    
            setDataDV(res.dataDV);  
            // setDataYC(res.dataYC);  
            // callSetOp(res.dataDV);                
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
    }
    const fullURL = window.location;

    return (    
      <>
       <Result               
                title={dataKH[0]?.value+":"+idEncodeed} 
            >       
       <Card title={dataKH[0]?.value+":"+idEncodeed} bordered={false} style={{ width: '100%',margin:10 ,backgroundColor:'#d4edd0', alignContent:"center"}}>    
       <li>
      
            <p>{dataKH[2]?.name}:  {dataKH[2]?.value}</p>
            <p>{dataKH[3]?.name}:  {dataKH[3]?.value} </p>  
            <p>{dataKH[7]?.name}:  {dataKH[7]?.value}</p>
                            {/* <span> Thời gian kết quả</span> */}
                 
                    <QRCode
                        id='qrcode'
                        value={fullURL.host+fullURL.pathname}
                        size={90}
                        level={'H'}         
                    />            
        
        </li>
            
           
       </Card>       
         {dataDV.map((item, i) => (           
            <Card key={i} title={item.name} bordered={false} style={{ width: '100%', backgroundColor: '#d4edda' ,margin:10 }}>    
                <li className="travelcompany-input" key={i}>
                    <span className="input-label"><b><FieldTimeOutlined />  Thời gian Chỉ định:{ item.tgyl } </b></span><br/>
                    <span className="input-label"><FieldTimeOutlined /><b>  Thời gian kết quả:{ item.tgkq }</b></span><br/>
                    <span className="input-label"><b><CheckCircleOutlined />    KQ:</b><br/>{ item.data_value }</span><br/>
                    <p><FileProtectOutlined />Xem chi tiết <a href={`http://103.237.144.134:3782/viewImgsH?ris_exam_id=${item.treatmentid}&service_id=${item.id}`} target="blank">Kết quả CLS</a>.</p>


                </li>
            </Card>
        ))}  
        </Result>
      </>
    );
  }