import {Button, Input, Modal,Space,Table, Tabs} from 'antd';
import { useEffect, useState } from 'react';
import Mp3Player from './Mp3Player';
import { SaveOutlined } from '@ant-design/icons';
import {  postcskhSaveTransactionApi } from '../../util/api';
function ModelbcCallHistory(props) {

    const{open,setOpen,phone,setPhone,loading,fetchHistoryByPhone,data,idcskh}=props;    
    const { Search } = Input;
    const formatDate = (unixTimestamp) => {
      const date = new Date(unixTimestamp ); // Chuyển từ giây sang mili giây
      const formattedDate = date.toLocaleString(); 
      return formattedDate;
    };
    const saveTransaction=async(idcskh,transid)=>{
        // console.log("hiuhgiiihohiohoih>>",idcskh,transaction_id);
        await postcskhSaveTransactionApi(transid,idcskh);  
    }
    const columns_nt = [
    {
        title: 'ID Cuộc gọi',
        dataIndex: 'transaction_id',
        render: (index, record) => (
          <span>{record.transaction_id.substring(0, 10)+"..."}
            <Button  icon={<SaveOutlined />} onClick={() => saveTransaction(idcskh,record.transaction_id)} />
          </span>
          
        )
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
  )
}
]; 
   
   
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
            title={"Lịch sử cuộc gọi-"+idcskh}
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
                    value={phone}
                    onChange={(event)=> setPhone(event.target.value)}
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
                              dataSource={data} columns={columns_nt}                       
                              key="cttbyhct"                          
                            /> ,
                            'Số lượng: '+ data?.length                     
                        ]
                    },
                    {
                        label: `Thông tin bệnh nhân`,
                        key: 'infotab',
                        children: [                                                          
                            <Table   
                              rowKey={"transaction_id"}                    
                              bordered
                              dataSource={data} columns={columns_nt}                       
                              key="cttbchuyentuyen"                           
                            /> ,
                            'Số lượng: '+data?.length                    
                        ]
                    }
                  ]}
              />           
          </Modal>
        </>
      );
};
export default ModelbcCallHistory;