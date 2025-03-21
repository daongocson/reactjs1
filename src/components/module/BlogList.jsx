import { AudioOutlined, EyeOutlined, HistoryOutlined } from "@ant-design/icons";
import { List, Card, Typography, Button, notification } from "antd";
import { getTokenApi, postcskhPidApi } from "../../util/api";
import { useState } from "react";
import ModelViewCskh from "./ModelViewCskh";
import ModelBcCskh from "./ModelBcCskh";
import ModelbcCallHistory from "./ModelbcCallHistory";


const BlogList =  ({ posts,loadingPost })=> {
  const { Title, Paragraph } = Typography;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modaldata, setModaldata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [idcskh, setIdcskh] = useState('');
  const [isModalOpenHistory, setIsModalOpenHistory] = useState(false);
  const [loadingPlay, setloadingPlay] = useState(false);
  const [mPhoneHistory, setMPhoneHistory] = useState([]);

  const [token, setToken] = useState('');

  const [pid, setPid] = useState('');
  const [idTitle, setIdTitle] = useState('');

  const getNewToken=async()=>{
    const res = await getTokenApi();     
    if(res.access_token){
      setToken(res.access_token);
      return res.access_token;    
    }
    else{
        setloadingPlay(false); 
        console.log("Lấy token thất bại");
    }
  }
  const fetchHistoryByPhone = async(vtoken, phone)=>{
    if(vtoken?.length>10){
      const unixTimeMillis = Date.now();
      const unixTime10DaysAgo = Math.floor((Date.now() - 20 * 86400000) );
      const url_mp3= "https://public-v1-stg.omicall.com/api/v2/callTransaction/search"; 
      const response  = await fetch(url_mp3,{
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization":vtoken
          },
          body: JSON.stringify( {fromDate:unixTime10DaysAgo, toDate:unixTimeMillis,keyword:phone})
      });        
      const {payload} = await response.json();           
      setMPhoneHistory(payload.items); 
    }
  }
  const showModal = (record) => {  
    if(record["patientrecordid"]!==''){
        const phoneNumber = record["phone"];
        setPid(record["idcskh"]);
        setIdTitle(record.idcskh+"-"+record.tenbn)
        // setPhone(phoneNumber);
        loadDataModel(record["patientrecordid"]);
    }        
    setIsModalVisible(true);
  }; 
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
  const handleOk=()=>{
    setIsModalVisible(false);
}
const handleCancel=()=>{
    setIsModalVisible(false);
}
const getCallHistory =async(record) => {  
  setPid(record.tenbn+"-"+record.idcskh);
  setIdTitle(record.idcskh+"-"+record.tenbn)
  setPhone(record.phone);
  setIsModalOpenHistory(true);   
  if(token==''){     
    let newtoken = await getNewToken();  
    fetchHistoryByPhone(newtoken,record.phone)
    setloadingPlay(false);   
  }else{
    fetchHistoryByPhone(token, record.phone);
    setloadingPlay(false); 
  }
}
  return (
      <>
        <Card title="BỆNH NHÂN không hài lòng" style={{ marginBottom: "20px" }}>
          <List
            itemLayout="horizontal"
            loading={loadingPost}
            dataSource={posts}
            renderItem={(post) => (
              <>
              <List.Item>
                <List.Item.Meta                
                title={post.tenbn+"-"+post.phone} description=
                  {
                    <>
                      <Paragraph style={{ fontFamily: "Arial", fontSize: "16px" }} >{post?.ghichu}</Paragraph>
                      <strong>Tên Bệnh: </strong>{post?.tenbenh}
                      <p><strong>Địa chỉ: </strong>{post?.diachi}</p>                
                      <Paragraph type="warning">{post.pkham} </Paragraph>                  
                      <Paragraph type="secondary">Bác sĩ: {post.bacsi} - Ngày ra viện: {post.ngayrv}</Paragraph>                  
                      <Button  icon={<EyeOutlined />} onClick={() => showModal(post)} />   
                      <span><Button icon={<HistoryOutlined />}  onClick={() => getCallHistory(post)} key="viewsHis" >Nhật ký cuộc gọi</Button></span>      
                    </>
                  }
                />                                             
                
              </List.Item>
                     
              </>
            )}
          />
          </Card>,
          <ModelBcCskh 
          open={isModalVisible}
          setOpen={setIsModalVisible}
          loading={loading}
          pid={pid}
          idTitle={idTitle}
          modaldata={modaldata}
          handleOk={handleOk}
          handleCancel={handleCancel}
      /> 
        <ModelbcCallHistory
                open={isModalOpenHistory}
                setOpen={setIsModalOpenHistory}              
                loading={loadingPlay}
                phone={phone}      
                idcskh={pid}   
                pid={idTitle}    
                idTitle={idTitle}    
                setPhone={setPhone}    
                data={mPhoneHistory}      
                fetchHistoryByPhone={fetchHistoryByPhone}     
            />       
    </>
  );
};

export default BlogList;
