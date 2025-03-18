import {Input, Modal,Space,Table, Tabs} from 'antd';
import { useState } from 'react';
import Mp3Player from './Mp3Player';
function ModelbcCallHistory(props) {

    const{open,setOpen,data,loading,token}=props;    
    const { Search } = Input;
    const [items, setItems] = useState([]);   
    const formatDate = (unixTimestamp) => {
      const date = new Date(unixTimestamp ); // Chuyển từ giây sang mili giây
      const formattedDate = date.toLocaleString(); 
      return formattedDate;
    };
  const columns_nt = [
    {
        title: 'ID Cuộc gọi',
        dataIndex: 'transaction_id',
    },
    {
        title: 'Phone',
        dataIndex: 'phone_number',
    },{
      title: 'Ngày gọi',
      dataIndex: 'created_date',
      render: (created_date) => formatDate(created_date), // Chuyển đổi UNIX time sang ngày tháng
  },{
    title: 'Ghi âm',
    dataIndex: 'created_date',
    render: (index, record) => (
      <Mp3Player filemp3={record.recording_file_url} />
  ) // Chuyển đổi UNIX time sang ngày tháng
}
]; 
    const onChange = (date, dateString) => {
      //data.datacc?.length})(BH${data.datacc.filter(item=>item.dm_patientobjectid.toString()==='1').length}
      // console.log(date, dateString);
        setDateStr(dateString);
    };    
    const fetchHistoryByPhone = async(phone)=>{
      
      if(token?.length>10){
        const unixTimeMillis = Date.now();
        const unixTime10DaysAgo = Math.floor((Date.now() - 10 * 86400000) );
        console.log(unixTimeMillis,"miamitoken>",unixTime10DaysAgo);
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
        console.log(payload.items);
        setItems(payload.items); 
      }
    }
    const onSearch = (value, _e, info) =>{
      if (isNaN(value)) 
          {
            alert("Must input numbers");
            return false;
          }else{
              if(value.length>8 && value.length<11)
                  fetchHistoryByPhone(value);
              else{              
                  // setOptions([]);
                  console.log("fffff",value)
                  }
          }
      
  } 
    return (
        <>        
           <Modal
            title="Lịch sử cuộc gọi"
            style={{
              top: 30
            }}
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            loading={loading}
            width={1000}           
          >
          <div className="ant-col ant-col-xs-24 ant-col-xl-8">                          
                    <Search
                    placeholder="Nhập số điện thoại"
                    allowClear                   
                    onSearch={onSearch} enterButton 
                    style={{
                        width: "100%"                        
                    }}
                    
                    />
            </div>   
          <Tabs
                    defaultActiveKey="1"
                    items={[
                    {
                        label: `Lịch sử cuộc gọi`,
                        key: 'historyTab',
                        children: [ 
                            <Table   
                              rowKey={"transaction_id"}                    
                              bordered
                              dataSource={items} columns={columns_nt}                       
                              key="cttbyhct"                          
                            /> ,
                            'Số lượng: '+ items?.length                     
                        ]
                    },
                    {
                        label: `Thông tin bệnh nhân`,
                        key: 'infotab',
                        children: [                                                          
                            <Table   
                              rowKey={"transaction_id"}                    
                              bordered
                              dataSource={items} columns={columns_nt}                       
                              key="cttbchuyentuyen"                           
                            /> ,
                            'Số lượng: '+items.length                    
                        ]
                    }
                  ]}
              />           
          </Modal>
        </>
      );
};
export default ModelbcCallHistory;