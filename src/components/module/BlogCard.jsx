import { DownloadOutlined, EyeOutlined, PauseCircleOutlined, PhoneOutlined, PlayCircleOutlined, PlusOutlined, QuestionOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Form, Input, Layout, Menu, Modal, Pagination, Typography } from "antd";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import sampleImage from "../../assets/react.svg"; // Import hình ảnh từ thư mục assets
import banner4 from "../../assets/images/banner4.jpg";
import ModelViewCskh from "./ModelViewCskh";
import { getTokenApi, postcskhPidApi } from "../../util/api";

const { Header, Content } = Layout;
const { TextArea } = Input;
const { Title, Paragraph } = Typography;
const { Meta } = Card;
const BlogCard = ({ posts }) => {
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
  const [audioSrc, setAudioSrc] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modaldata, setModaldata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpenPlay, setIsModalOpenPlay] = useState(false);
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
const handleDownload = () => {
  if(audioSrc=='')return;
  const link = document.createElement("a");
  link.href = audioSrc;
  link.setAttribute("download", audioSrc); // File name when downloaded
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
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
  if(payload.recording_file_url){
      setAudioSrc(payload.recording_file_url);
      setloadingPlay(false);        
      return payload.recording_file_url;
  }else{
      setloadingPlay(false);   
      return ""
  }
}
const playCallCskh =async(record) => {          
  setIsModalOpenPlay(true);   
  setloadingPlay(true);   
  if(token==''){
      const res = await getTokenApi();      
      if(res.access_token){
          // console.log("access_token",res.access_token);
          setToken(res.access_token);
          const link = getLink(record.transaction_id,res.access_token,record.tenbn+"-"+record.patientrecordid);
          // setAudioSrc(link);
      }
      else{
          setloadingPlay(false); 
          console.log("Lấy token thất bại");
      }
  }else{
      const link = await getLink(record.transaction_id,token,record.tenbn+"-"+record.patientrecordid);               
  }
  
}
  const showModal = (record) => {
    // setPid(record["idcskh"]);       
    if(record["patientrecordid"]!==''){
        const phoneNumber = record["phone"];
        // setPhone(phoneNumber);
        console.log("nhocnhan>",record["patientrecordid"]);
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

  const filteredPosts = posts.filter(post => 
    post.tenbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.phone.toLowerCase().includes(searchTerm.toLowerCase())
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
    <Layout style={{ minHeight: "100vh" }}>     
      <Content style={{ padding: "20px" }}>
        <Input
          placeholder="Tìm kiếm bệnh nhân..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 20, width: "100%" }}
        />
        {/* <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Thêm bài viết
        </Button> */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "10px", marginTop:10 }}>
          {paginatedPosts.map(post => (
            <Card
              key={post.idcskh}          
              actions={[
                 <PhoneOutlined  onClick={() => showModal(post)} key="views" />,
                <span>{post ?.transaction_id?(<Button  icon={<PlayCircleOutlined /> } onClick={() => playCallCskh(post)} />):(<QuestionOutlined /> )} Ghi âm</span>,
                // <span>{post.idcskh} lượt xem</span>
              ]}
            >
              <Meta
                title={post.tenbn+"-"+post.phone}
                description={
                  <>
                    <Paragraph>Ghi chú:{post.ghichu}</Paragraph>
                    <Paragraph>{post.bacsi}</Paragraph>
                    <Paragraph type="secondary">{post.pkham} - Update: {post.ngaycapnhat}</Paragraph>
                    <Paragraph type="warning">Kết quả: {getTextTrangthai(post.trangthai)}</Paragraph>
                  </>
                }
              />
            </Card>
          ))}
        </div>
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
                <audio ref={audioRef} src={audioSrc} />
                <p><strong>Link lưu trữ</strong></p>
                <p>{audioSrc}</p>
                <Button 
                    type="primary" 
                    icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />} 
                    onClick={togglePlay}
                    style={{ marginTop: 10 }}
                >
                    {isPlaying ? "Dừng" : "Nghe lại cuộc gọi"}
                </Button>
                <Button type="dashed" icon={<DownloadOutlined />} onClick={handleDownload}>
                    Download MP3
                </Button>
            </Modal>        
        </Layout>
    
  );
};

export default BlogCard;
