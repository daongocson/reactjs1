import React, { useState,useRef } from 'react';
//import { Button, Modal } from 'antd';
import { AutoComplete, Button, Card, Checkbox, Form, Input,Modal, notification, Select, Space, Table, Tabs } from 'antd';
import Draggable from 'react-draggable';
import TextArea from 'antd/es/input/TextArea';
import { PhoneOutlined } from '@ant-design/icons';
import { postkqGoiApi, postpatientApi, postUpdateCallIDApi } from '../../util/api';
function ModelViewCskh(props) {
    const{open,setOpen,phone,pid,uuid,loading,refetch,modaldata,handleCancel,startCall,setStartCall}=props;  
    const [disabled, setDisabled] = useState(true);   
    const [form] = Form.useForm();
    // const [loading, setLoading] = React.useState(true);
    const onStart = (_event, uiData) => {
      const { clientWidth, clientHeight } = window.document.documentElement;
      const targetRect = draggleRef.current?.getBoundingClientRect();
      if (!targetRect) {
        return;
      }
      setBounds({
        left: -targetRect.left + uiData.x,
        right: clientWidth - (targetRect.right - uiData.x),
        top: -targetRect.top + uiData.y,
        bottom: clientHeight - (targetRect.bottom - uiData.y),
      });
  }  
  const columns = [
    {
      title: 'Tên DV',
      dataIndex: 'tendv',
    },              
    {
        title: 'SL',
        dataIndex: 'soluong',
    }, {
      title: 'Đơn giá',
      dataIndex: 'dongia',
    },
    {
        title: 'Loại DV',
        dataIndex: 'loaidv',
    }, {
      title: 'Bác sĩ',
      dataIndex: 'bacsi',
  }
  ];  
    const onFinish = (values) => {
        // console.log('Success:',">>>",form.getFieldsValue());
        if(startCall){
          UpdateCallID(pid,uuid);
        }
        postkqGoi(form.getFieldsValue());
          
      };
      const UpdateCallID = async(pid,callid)=>{
        await postUpdateCallIDApi(pid,callid);  
    }
      const postkqGoi = async (values) => {
          if(values?.ketqua&&values?.note){
            const res = await postkqGoiApi({"idcskh":pid,ketqua:values.ketqua,note:values.note});            
            if (!res?.success) {   
              form.resetFields();
              setOpen(false);
              refetch();
              // setFilData(res);                      
            } else {
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
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      }
    const [bounds, setBounds] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
      });
    const callPhone =()=>{
      setStartCall(true);
      // omiSDK.makeCall(phoneNumber);  
      omiSDK.makeCall(phone);  
    }
    const cancelPhone =()=>{
      // console.log("testui>>>",startCall);
      omiSDK.stopCall()
    }
    const draggleRef = useRef(null);
    return (
        <>         
          <Modal
                 title={
                    <div
                      style={{
                        width: '100%',
                        cursor: 'move',
                      }}
                      onMouseOver={() => {
                        if (disabled) {
                          setDisabled(false);
                        }
                      }}
                      onMouseOut={() => {
                        setDisabled(true);
                      }}
                      // fix eslintjsx-a11y/mouse-events-have-key-events
                      // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
                      onFocus={() => {}}
                      onBlur={() => {}}
                      // end
                    >
                      Chi tiết bệnh nhân IDCSKH-{pid}
                    </div>
                  }
                open={open}
                onOk={onFinish}
                loading={loading}
                okText="Lưu & đóng"
                onCancel={handleCancel}
                modalRender={(modal) => (
                    <Draggable
                      disabled={disabled}
                      bounds={bounds}
                      nodeRef={draggleRef}
                      onStart={(event, uiData) => onStart(event, uiData)}
                    >
                      <div ref={draggleRef}>{modal}</div>
                    </Draggable>
                  )}
                  footer={(_, { OkBtn, CancelBtn }) => (
                    <>
                      <Button onClick={callPhone}  icon={<PhoneOutlined /> } danger>Gọi điện</Button>
                      <Button onClick={cancelPhone}  icon={<PhoneOutlined /> } danger>Hủy gọi</Button>
                      <CancelBtn />
                      <OkBtn />
                    </>
                  )}
            >             
              <Tabs
                  defaultActiveKey="1"
                  items={[
                    {
                      label: 'Bệnh nhân',
                      key: 'bnhan',
                      children: [
                        <div key={"bnhaninfo"}>
                          {modaldata.length==0?"loading...":
                          (<Card key="ab" title={modaldata.dataKH[0].value+"("+modaldata.dataKH[3].value+")"} size="small">
                            {/* <p>Mã CSKH: {pid}</p> */}
                              <p style={{ color: 'blue' }}>{modaldata.dataKH[4].value}</p>     
                              <p>Mã VP: {modaldata.dataKH[1].value}</p>   
                              <p>Phone: {phone}</p>     
                              
                              {/* <p><strong> {modaldata.dataKH[0].value}({modaldata.dataKH[3].value})</strong></p> */}
                             
                              <p>{modaldata.dataKH[2].value}</p>                           
                              <p>{modaldata.dataKH[6].name}:{modaldata.dataKH[6].value}</p>                            
                              <p>{modaldata.dataKH[7].name}:{modaldata.dataKH[7].value}</p>                            
                              <p><b>{modaldata.dataKH[8].value=="13"?"Chuyển Tuyến":""}</b></p>
                          </Card>)
                          }
                        </div>
                        
                        
                        
                      ]
                    },
                    {
                      label: 'Dịch vụ',
                      key: '1A',
                      children: [
                        // <Card key="ab" title="Thông tin bệnh nhân" size="small">
                        //   <li>Mã CSKH: {pid}</li>
                        //   <li>Phone: {phone}</li>
                        //   {modaldata.length==0?"loading...":(
                        //   <>
                        //    {modaldata.dataKH.map((item) => (
                        //       <li key={item.id}>{item.name}:{item.value}</li>
                        //     ))}
                        //   </>
                        // ) }
                        // </Card>    
                        <Table   
                        rowKey={"id"}                    
                       // bordered                       
                        dataSource={modaldata.khDV} columns={columns}                 
                        key="cskhkhl"
                        />                                         
                      ]
                    },
                    {
                      label: 'Thuốc',
                      key: '12A',
                      children: [
                        <Table   
                        rowKey={"id"}                    
                        bordered                       
                        dataSource={modaldata.khTH} columns={columns}                 
                        key="cskhkhl"
                        />                                              
                      ]
                    },
                    {
                      label: 'Xét nghiệm',
                      key: '13A',
                      children: [
                        <Table   
                        rowKey={"id"}                    
                        bordered                       
                        dataSource={modaldata.khXN} columns={columns}                 
                        key="cskhkhl"
                        />                                              
                      ]
                    },{
                      label: 'Cập nhật kết quả',
                      key: '14A',
                      children: [                      
                        <Form                       
                        form={form}
                        key={"formcskh"}
                        name="control-hooks"
                        onFinish={onFinish}
                        style={{
                          maxWidth: '100%',
                        }}
                      >  
                        <Form.Item
                            name="ketqua"
                            label="Kết quả"
                            rules={[
                              {
                                required: true,
                              },
                            ]}
                          >
                            <Select
                              placeholder="Chọn kết quả hài lòng của bệnh nhân"
                              options={[
                                      { value: '0', label: 'Chưa xử lý' },
                                      { value: '1', label: 'Không có SĐT' },
                                      { value: '2', label: 'Không nghe máy' },
                                      { value: '3', label: 'Hài lòng' },
                                      { value: '4', label: 'Không hài lòng' },
                                      { value: '5', label: 'Sai số' }                                      
                                    ]}
                            />   
                          </Form.Item>                       
                            <Form.Item
                              name="note"
                              label="Ghi chú"
                              rules={[
                                {
                                  required: true,
                                },
                              ]}
                            >
                              <TextArea
                              showCount                                                    
                                  placeholder="Nhập ghi chú bệnh nhân"
                                  style={{ height: 120, resize: 'none' }}
                              />
                            </Form.Item>                            
                         </Form>
                                        
                      ]
                    },
                  ]}
                />               
            </Modal>
        </>
      );
};
export default ModelViewCskh;