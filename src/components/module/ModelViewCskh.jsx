import React, { useState,useRef } from 'react';
//import { Button, Modal } from 'antd';
import { AutoComplete, Button, Card, Checkbox, Form, Input,Modal, notification, Select, Space, Tabs } from 'antd';
import Draggable from 'react-draggable';
import TextArea from 'antd/es/input/TextArea';
import { PhoneOutlined } from '@ant-design/icons';
import { postkqGoiApi, postpatientApi } from '../../util/api';
function ModelViewCskh(props) {
    const{open,setOpen,phone,pid,loading,refetch,modaldata,handleCancel}=props;  
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
    const onFinish = (values) => {
        // console.log('Success:',">>>",form.getFieldsValue());
        postkqGoi(form.getFieldsValue());
          
      };
      const postkqGoi = async (values) => {
          if(values?.ketqua&&values?.note){
            const res = await postkqGoiApi({"idcskh":pid,ketqua:values.ketqua,note:values.note});
            console.log("refetch343434>>",res);
            if (!res?.success) {   
              form.resetFields();
              setOpen(false);
              console.log("refetch>>");
              refetch();
              // setFilData(res);                      
            } else {
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                })
            }          
        }else{
          console.log("postkqGoimmmm>>");
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
      omiSDK.makeCall(phone);  
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
                      Chi tiết bệnh nhân
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
                      <CancelBtn />
                      <OkBtn icon={<PhoneOutlined />} >Gọi điện</OkBtn>
                    </>
                  )}
            >             
              <Tabs
                  defaultActiveKey="1"
                  items={[
                    {
                      label: 'Bệnh nhân',
                      key: '1A',
                      children: [
                        <Card key="ab" title="Thông tin bệnh nhân" size="small">
                          <li>Mã CSKH: {pid}</li>
                          <li>Phone: {phone}</li>
                          {modaldata.length==0?"loading...":(
                          <>
                           {modaldata.dataKH.map((item) => (
                              <li key={item.id}>{item.name}:{item.value}</li>
                            ))}
                          </>
                        ) }
                        </Card>                                            
                      ]
                    },
                    {
                      label: 'Thuốc',
                      key: '12A',
                      children: [
                        <Card key="ab2" title="Danh sách Thuốc" size="small">
                            {modaldata.length==0?"loading...":(
                          <>
                           {modaldata.dataTH.map((item) => (
                              <li key={item.id}>{item.name}:{item.value}</li>
                              ))}
                            </>
                          )}                         
                        </Card>                                            
                      ]
                    },
                    {
                      label: 'Dịch vụ',
                      key: '13A',
                      children: [
                        <Card key="ab3" title="Danh sách dịch vụ" size="small">
                            {modaldata.length==0?"loading...":(
                          <>
                           {modaldata.dataDV.map((item) => (
                              <li key={item.id}>{item.name}:{item.value}</li>
                              ))}
                            </>
                          )}                         
                        </Card>                                           
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
                                  maxLength={100}                                 
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