import React, { useState, } from 'react';
//import { Button, Modal } from 'antd';
import {Button, DatePicker, Form,Modal, notification, Space, Spin, Table} from 'antd';

import { postkqGoiApi, postLoadcskhApi, postNapcskhApi } from '../../util/api';
function ModelNapCskh(props) {
    const{open,setOpen,refetch}=props;  
    const [loading, setLoading] = React.useState(false);
    const [datestr, setDateStr] = React.useState(false);
    const [dataBn, setDataBn] = React.useState([]);
  const columns = [
    {
      title: 'Mã VP',
      dataIndex: 'patientrecordid',
    },              
    {
        title: 'Tên BN',
        dataIndex: 'patientname',
    }, {
      title: 'Điện thoại',
      dataIndex: 'patientphone',
    },
    {
      title: 'Phòng',
      dataIndex: 'phongkham',
    },
    {
        title: 'Ngày RV',
        dataIndex: 'medicalrecorddate_out',
    }, {
      title: 'Khoa điều trị',
      dataIndex: 'khoadieutri',
  }
  ];  
      const postNapbn = async () => {
        if (dataBn?.length > 0) {
          setLoading(true);
          const res = await postNapcskhApi(datestr); 
          if (res?.success) {   
            notification.success({
              message: "Thành công",
              description: res.message
          })
            setLoading(false); 
            setOpen(false);
            refetch();                             
          } else {
            setLoading(false);            
              notification.error({
                  message: "Unauthorized",
                  description: res.message
              })
          }      
        }else{
          notification.error({
            message: "Thiếu",
            description: "Không có dữ liệu nạp"
        })
        }
      }
      const postkqGoi = async () => {
          if(datestr){
            setLoading(true);
            const res = await postLoadcskhApi(datestr);    
              
            if (!res?.success) {   
              setLoading(false);            
              // setOpen(false);
              // refetch();
              setDataBn(res);                      
            } else {
              setLoading(false);            
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                })
            } 
        }else{
          notification.error({
            message: "Cần nhập kết quả cuộc gọi",
            description: "Thiếu dữ liệu"
        })
        }
    }
    const onChange = (date, dateString) => {
      // console.log(date, dateString);
        setDateStr(dateString);
    };
    return (
        <>         
           <Modal
            title="Chọn ngày nạp khách hàng"
            style={{
              top: 30
            }}
            loading={loading}
            open={open}
            onOk={() => setOpen(false)}
            okText="Nạp dữ liệu"
            onCancel={() => setOpen(false)}
            width={1000}           
          >
          <Space.Compact>
            <DatePicker onChange={onChange} />
            <Button 
              type="primary"
              onClick={postkqGoi}
              >
              Tải khách hàng
            </Button> &nbsp;&nbsp;         
            <Button 
              type="primary"
              onClick={postNapbn}
              >
              Đồng ý Nạp
            </Button>    
          </Space.Compact>
          <p><strong>SL khách hàng: {dataBn.length}</strong></p>
          
          <Table   
            rowKey={"patientrecordid"}                    
            bordered    
          //  loading={{ indicator: <div><Spin /></div>, spinning:loading}}          
            dataSource={dataBn} columns={columns}                 
            key="cskhkhl"
          />            
          </Modal>
        </>
      );
};
export default ModelNapCskh;