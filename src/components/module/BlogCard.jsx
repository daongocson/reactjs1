import { DownloadOutlined, EyeOutlined, HistoryOutlined, PauseCircleOutlined, PhoneOutlined, PlayCircleOutlined, PlusOutlined, QuestionOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Form, Input, Layout, Menu, Modal, Pagination, Spin, Typography } from "antd";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import sampleImage from "../../assets/react.svg"; // Import hình ảnh từ thư mục assets
import banner4 from "../../assets/images/banner4.jpg";
import ModelViewCskh from "./ModelViewCskh";
import { getTokenApi, postcskhPidApi } from "../../util/api";
import ModelbcNgoaitruchitiet from "./ModelbcNgoaitruchitiet";
import ModelbcCallHistory from "./ModelbcCallHistory";
import Mp3Player from "./Mp3Player";

const { Header, Content } = Layout;
const { TextArea } = Input;
const { Title, Paragraph } = Typography;
const { Meta } = Card;
const BlogCard = ({ posts,loadPage }) => {
  // const [posts, setPosts] = useState([
  //   { 
  //     id: 1, 
  //     title: "Bài viết đầu tiên", 
  //     content: "Nội dung của bài viết đầu tiên", 
  //     image: "https://via.placeholder.com/150", 
  //     author: "Admin", 
  //     date: "12/03/2025", 
  //     views: 120 
  //   },
  // ]);
      const audioRef = useRef(null);
      const [startCall, setStartCall] = useState(false);
      const togglePlay = () => {
        if(audioSrc=='')return;
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      };
  const [audioSrc, setAudioSrc] = useState('sample.mp3');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modaldata, setModaldata] = useState([]);
  const [phone, setPhone] = useState('');
  const [idcskh, setIdcskh] = useState('');

  const [mPhoneHistory, setMPhoneHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpenPlay, setIsModalOpenPlay] = useState(false);
  const [isModalOpenHistory, setIsModalOpenHistory] = useState(false);
  const [loadingPlay, setloadingPlay] = useState(false);
  const [token, setToken] = useState('');
  const [tenbn,setTenbn]=useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [newPost, setNewPost] = useState({ title: "", content: "", image: "", author: "", date: "", views: 0 });
  const [searchTerm, setSearchTerm] = useState("");
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
const fetchHistoryByPhone = async(vtoken, phone)=>{
  if(vtoken?.length>10){
    setloadingPlay(true);
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
    setloadingPlay(false);
  }else if(token?.length>10){    
    setloadingPlay(true);
    const unixTimeMillis = Date.now();
    const unixTime10DaysAgo = Math.floor((Date.now() - 20 * 86400000) );
    const url_mp3= "https://public-v1-stg.omicall.com/api/v2/callTransaction/search"; 
    const response  = await fetch(url_mp3,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization":token
        },
        body: JSON.stringify( {fromDate:unixTime10DaysAgo, toDate:unixTimeMillis,keyword:phone})
    });        
    const {payload} = await response.json();           
    setMPhoneHistory(payload.items); 
    setloadingPlay(false);
  }
}
const handleDownload = () => {
  if(audioSrc=='')return;
  const link = document.createElement("a");
  link.href = audioSrc;
  link.setAttribute("download", audioSrc); // File name when downloaded
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const getLink =async(uuid,vtoken,tenbn)=>{
  setTenbn(tenbn);
  if(vtoken?.length>10){
    const url_mp3= "https://public-v1-stg.omicall.com/api/v2/callTransaction/getByTransactionId"; 
    const response  = await fetch(url_mp3,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization":vtoken
        },
        body: JSON.stringify({transactionId:uuid})
    }); 
    const {payload} = await response.json();  
    // https://public-v1-stg.omicrm.com/third_party/recording/uc?id=NTJkTkVjZXBCamRvODdCSjBJYlFZdEp3L2Z2V3JMOEdqdXJQWU53bDJ0VXRVSWdvNzlKZGJIQWpVcFd1WnNHTzl3b2hkbzBUSTJadDk1OHh6bUtaa2c9PQ==&code=21c2b76d-35e2-40c0-a88c-b643b5a1c596
    if(payload.recording_file_url){
        setAudioSrc(payload.recording_file_url);
    }
  }
  // return "";
  
}
const getCallHistory =async(record) => {   
  setIdcskh(record.tenbn+"-"+record.idcskh);
  setPhone(record.phone);
  setIsModalOpenHistory(true);   
  setloadingPlay(true);   
  if(token==''){     
    let newtoken = await getNewToken();  
    fetchHistoryByPhone(newtoken,record.phone)
    setloadingPlay(false);   
  }else{
    fetchHistoryByPhone(token, record.phone);
    setloadingPlay(false); 
  }
}
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
const playCallCskh =async(record) => {          
  setIsModalOpenPlay(true);   
  setloadingPlay(true);   
  if(token==''){     
    let newtoken = await getNewToken(); 
    await getLink(record.transaction_id, newtoken ,record.tenbn+"-"+record.patientrecordid);    
  }else{
    await getLink(record.transaction_id,token,record.tenbn+"-"+record.patientrecordid);               
    
  }
  setloadingPlay(false); 

}
  const showModal = (record) => {
    // setPid(record["idcskh"]);       
    if(record["patientrecordid"]!==''){    
        loadDataModel(record["patientrecordid"]);
    }        
    // Initiate the call
    // omiSDK.makeCall(phoneNumber);  
    
    setIsModalVisible(true);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setPosts([...posts, { id: posts.length + 1, ...newPost }]);
    setIsModalOpen(false);
    setNewPost({ title: "", content: "", image: "", author: "", date: "", views: 0 });
  };

  const handleCancel = () => {
    setIsModalOpenPlay(false);
    setAudioSrc('');
    setIsPlaying(false);
    setIsModalVisible(false)
    setIsModalOpen(false);
  };
  const handleCancelHistory = () => {
    setIsModalOpenHistory(false);
  }
  const filteredPosts = posts.filter(post => 
    post.tenbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.phone.toLowerCase().includes(searchTerm.toLowerCase())||
    post.pkham.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const getTextTrangthai = (trangthai)=>{
    // { value: '1', label: 'Không có SĐT' },
    // { value: '2', label: 'Không nghe máy' },
    // { value: '3', label: 'Hài lòng' },
    // { value: '4', label: 'Không hài lòng' },
    // { value: '5', label: 'Sai số' }          
    switch (true) {
      case trangthai == 0:
        return "Chưa gọi";
      case trangthai == 1:
        return "Không có SĐT";
      case trangthai == 2:
        return "Không nghe máy";
      case trangthai == 3:
        return "Hài Lòng";
      case trangthai == 4:
        return "Không Hài lòng";
      case trangthai == 5:
        return "Sai số";
      default:
        return "Chưa update";
    }
  }
  const handlePageSizeChange = (current, size) => {   
    setPageSize(size);
    setCurrentPage(1);
  };
  return (
    <Layout style={{ minHeight: "100vh" }} >     
      <Content style={{ padding: "20px" }} >
        <Input
          placeholder="Tìm kiếm bệnh nhân..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 20, width: "100%" }}
        />
        {/* <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Thêm bài viết
        </Button> */}
         <Spin spinning={loadPage}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "10px", marginTop:10 }}>          
          {paginatedPosts.map(post => (
            <Card
              key={post.idcskh}          
              actions={[
                 <PhoneOutlined  onClick={() => showModal(post)} key="views" />,
                <span>{post ?.transaction_id?(<Button  icon={<PlayCircleOutlined /> } onClick={() => playCallCskh(post)} />):(<QuestionOutlined />)} Ghi âm</span>,
                <span><Button icon={<HistoryOutlined />}  onClick={() => getCallHistory(post)} key="viewsHis" >Nký gọi</Button></span>,

              ]}
            >
              <Meta
                title={post.tenbn+"-"+post.phone}
                description={
                  <>
                    <Paragraph>Ghi chú:{post.ghichu}</Paragraph>
                    {/* <Paragraph>{post.bacsi}</Paragraph> */}
                    <Paragraph type="secondary">{post.bacsi}-{post.pkham} - Ngày ra viện: {post.ngayrv}</Paragraph>
                    <Paragraph type="warning">{getTextTrangthai(post.trangthai)}: {post.ngaycapnhat}</Paragraph>
                  </>
                }
              />
            </Card>
          ))}
        </div>
        </Spin>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          onShowSizeChange={handlePageSizeChange}
          total={filteredPosts.length}
          onChange={(page) => setCurrentPage(page)}
          style={{ marginTop: 20, textAlign: "center" }}
        />
        </Content>
        <ModelViewCskh 
                open={isModalVisible}
                setOpen={setIsModalVisible}
                // refetch={fetchKhachhang}
                // phone={phone}
                loading={loading}
                // pid={pid}
                // startCall={startCall}
                // setStartCall={setStartCall}
                // uuid={uuid}
                modaldata={modaldata}
                handleOk={handleOk}
                handleCancel={handleCancel}
            /> 
          <Modal title={"Nghe lại cuộc gọi(" +tenbn+")"} open={isModalOpenPlay} onOk={handleCancel} onCancel={handleCancel} loading={loadingPlay}>                              
                <Mp3Player filemp3={audioSrc}/>
                <Button type="dashed" icon={<DownloadOutlined />} onClick={handleDownload}>
                    Download MP3
                </Button>
            </Modal>           
             <ModelbcCallHistory
                open={isModalOpenHistory}
                setOpen={setIsModalOpenHistory}              
                loading={loadingPlay}
                setLoading={setloadingPlay}
                phone={phone}      
                idcskh={idcskh}           
                setPhone={setPhone}    
                data={mPhoneHistory}      
                fetchHistoryByPhone={fetchHistoryByPhone}     
            />    
        </Layout>
    
  );
};

export default BlogCard;
