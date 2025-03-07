import React, { useEffect, useState, } from 'react';
//import { Button, Modal } from 'antd';
import {Button, DatePicker, Form,Modal, notification, Space, Spin, Table, Tabs} from 'antd';

import { postbaocaongoaitruApi, postkqGoiApi, postLoadcskhApi } from '../../util/api';
function ModelbcNgoaitruchitiet(props) {
    const{open,setOpen,data,loading}=props;  
    // const [loading, setLoading] = React.useState(false);
    const [pending, setPending] = React.useState(false);
    const [datestr, setDateStr] = React.useState(false);
    const [dataBn, setDataBn] = React.useState([]);
    const [datacc, setDatacc]= useState([]); 
    const [dataKham, setdataKham]= useState([]);    
    const [dataKhamxtri, setdataKhamxtri]= useState([]);    
    const [dataKhamkkb, setdataKhamkkb]= useState([]);    
    const [dataChuyentuyen, setdataChuyentuyen]= useState([]);   
    const [dataChuyentuyencc, setdataChuyentuyencc]= useState([]);   
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
        title: 'Loại DV',
        dataIndex: 'loaidv',
    }, {
      title: 'Bác sĩ',
      dataIndex: 'bacsi',
  }
  ];  
  const columns_nt = [
    {
        title: 'Mã VP',
        dataIndex: 'patientrecordid',
    },
    {
        title: 'Thời gian',
        dataIndex: 'tgkham',
    }
]; 
    const onChange = (date, dateString) => {
      //data.datacc?.length})(BH${data.datacc.filter(item=>item.dm_patientobjectid.toString()==='1').length}
      // console.log(date, dateString);
        setDateStr(dateString);
    };    
    const getTitle = (items) => {
      let bh = items.filter(item=>item.dm_patientobjectid.toString()==='1')
      let vp = items.filter(item=>item.dm_patientobjectid.toString()==='2')
      if (items?.length > 0) {
        return "("+items?.length+")(BH:"+bh.length+" "+"VP:"+vp.length+")";
      } else {
        return "(0)";
      }
       return "(001-"+items?.length+")";
      //data.datacc?.length})(BH${data.datacc.filter(item=>item.dm_patientobjectid.toString()==='1').length}
      // console.log(date, dateString);
        
    };
    return (
        <>         
           <Modal
            title="Danh sách bệnh nhân chi tiết"
            style={{
              top: 30
            }}
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            loading={loading}
            width={1000}           
          >
          {/* <Space.Compact> */}
          <Tabs
                    defaultActiveKey="1"
                    items={[
                    {
                        label: `BN Khám Cấp cứu ${getTitle(data.datacc)}`,
                          //numbers.filter(num => num > 25)
                        key: 'bncapcuu',
                        children: [                            
                            <Table   
                            rowKey={"patientrecordid"}                    
                            bordered
                            dataSource={data.datacc} columns={columns_nt}                       
                            key="tbyhct"                          
                            /> ,
                            'Số lượng: '+ data.datacc?.length                     
                        ]
                    },
                    {
                        label: `CT Cấp cứu ${getTitle(data.dataChuyentuyencc)}`,
                        key: 'bnchuyentuyencc',
                        children: [                            
                            <Table   
                            rowKey={"patientrecordid"}                    
                            bordered
                            dataSource={data.dataChuyentuyencc} columns={columns_nt}                       
                            key="tbchuyentuyen"                           
                            /> ,
                            'Số lượng: '+data.dataChuyentuyencc?.length                    
                        ]
                    },
                    {
                        label: `CT Khám bệnh ${getTitle(data.dataChuyentuyen)}`,
                        key: 'ctbnchuyentuyen',
                        children: [ 
                            <Table   
                            rowKey={"patientrecordid"}                    
                            bordered
                            dataSource={data.dataChuyentuyen} columns={columns_nt}                       
                            key="tbchuyentuyen"                           
                            /> ,
                            'Số lượng: '+ data.dataChuyentuyen?.length                    
                        ]
                    },{
                      label: `BN Khám bệnh ${getTitle(data.dataKham)}`,
                      key: 'ctbnkham',
                      children: [ 
                          <Table   
                          rowKey={"patientrecordid"}                    
                          bordered
                          dataSource={data.dataKham} columns={columns_nt}                       
                          key="tbchuyentuyen"                           
                          /> ,
                          'Số lượng: '+ data.dataKham?.length                    
                      ]
                  }
                  ]}
              />           
          </Modal>
        </>
      );
};
export default ModelbcNgoaitruchitiet;