import { useLocation, useParams } from "react-router";
import { React, useEffect,useState} from "react";
import {  postkqclsApi} from "../util/api";
import { Card, notification, Button } from 'antd';
import { CheckCircleOutlined, CompassTwoTone, CrownOutlined, FieldTimeOutlined, FileProtectOutlined } from "@ant-design/icons";
import QRCode from 'react-qr-code';
import { QRCodeCanvas } from "qrcode.react"

export default function TrakqPage() {
    const { id } = useParams();
    const location = useLocation()

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
    const urlDomain ="https://traketqua.benhvienminhan.com/";
    const downloadQRCode = () => {
      const canvas = document.querySelector("#qrcode-canvas") 
      if (!canvas) throw new Error("<canvas> not found in the DOM")
  
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream")
      const downloadLink = document.createElement("a")
      downloadLink.href = pngUrl
      downloadLink.download =dataKH[0]?.value +"-QR code.png"
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    } 

    return (    
      <>
       <Card title={dataKH[0]?.value+":"+idEncodeed} bordered={false} style={{ width: '100%',margin:10 ,backgroundColor:'#f5f5f5', alignContent:"center"}}>    
       <li>
      
            <p>{dataKH[2]?.name}:  {dataKH[2]?.value}</p>
            <p>{dataKH[3]?.name}:  {dataKH[3]?.value} </p>  
            <p>{dataKH[7]?.name}:  {dataKH[7]?.value}</p>
                <div className="p-3">
                    <QRCodeCanvas id="qrcode-canvas" 
                    level="H" size={150} value={urlDomain+location.pathname} />
                    <div className="my-5">
                        <Button onClick={downloadQRCode}>Download QR Code</Button>
                    </div>
                </div>         
        </li>
            
           
       </Card>       
         {dataDV.map((item, i) => (           
            <Card key={i} title={item.name} bordered={false} style={{ width: '100%', backgroundColor: '#f5f5f5' ,margin:10 }}>    
                <li className="travelcompany-input" key={i}>
                    <span className="input-label"><b><FieldTimeOutlined />  Thời gian Chỉ định:{ item.tgyl } </b></span><br/>
                    <span className="input-label"><FieldTimeOutlined /><b>  Thời gian kết quả:{ item.tgkq }</b></span><br/>
                    <span className="input-label"><b><CheckCircleOutlined />    KQ:</b><br/>{ item.data_value }</span><br/>
                    <p><FileProtectOutlined />Xem chi tiết <a href={`http://103.237.144.134:3782/viewImgsH?ris_exam_id=${item.treatmentid}&service_id=${item.id}`} target="blank">Kết quả CLS</a>.</p>


                </li>
            </Card>
        ))}         
      </>
    );
  }