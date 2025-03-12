import { AudioOutlined, EyeOutlined } from "@ant-design/icons";
import { List, Card, Typography, Button, notification } from "antd";
import { postcskhPidApi } from "../../util/api";
import { useState } from "react";
import ModelViewCskh from "./ModelViewCskh";


const BlogList =  ({ posts,loadingPost })=> {
  const { Title, Paragraph } = Typography;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modaldata, setModaldata] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [pid, setPid] = useState('');

  const showModal = (record) => {  
    console.log(record);
    if(record["patientrecordid"]!==''){
        const phoneNumber = record["phone"];
        setPid(record["idcskh"]);
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
                <List.Item.Meta title={post.tenbn+"-"+post.phone} description=
                  {
                    <>
                      <Paragraph >{post?.ghichu}</Paragraph>
                      <strong>Tên Bệnh: </strong>{post?.tenbenh}
                      <p><strong>Địa chỉ: </strong>{post?.diachi}</p>                
                      <Paragraph type="warning">{post.pkham} </Paragraph>                  
                      <Paragraph type="secondary">Bác sĩ: {post.bacsi} - Ngày ra viện: {post.ngayra}</Paragraph>                  
                      <Button  icon={<EyeOutlined />} onClick={() => showModal(post)} />            
                    </>
                  }
                />                                             
                
              </List.Item>
                     
              </>
            )}
          />
          </Card>,
          <ModelViewCskh 
          open={isModalVisible}
          setOpen={setIsModalVisible}
          loading={loading}
          pid={pid}
          modaldata={modaldata}
          handleOk={handleOk}
          handleCancel={handleCancel}
      />    
    </>
  );
};

export default BlogList;
