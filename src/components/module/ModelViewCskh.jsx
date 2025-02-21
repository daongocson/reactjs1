import React, { useState,useRef } from 'react';
//import { Button, Modal } from 'antd';
import { AutoComplete, Button, Card, Checkbox, Form, Input,Modal, Select, Tabs } from 'antd';
import Draggable from 'react-draggable';
import TextArea from 'antd/es/input/TextArea';
function ModelViewCskh(props) {
    const{open,phone,pid,modaldata ,handleOk,handleCancel}=props;  
    const [disabled, setDisabled] = useState(true); 
    const [kqSelect, setKqSelect] = useState(true); 
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
        console.log('Success:', values);
      };
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
                onOk={handleOk}
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
            >
              <Button type="primary" onClick={callPhone}>Gọi điện</Button>
              <Tabs
                  defaultActiveKey="1"
                  items={[
                    {
                      label: 'Bệnh nhân',
                      key: '1A',
                      children: [
                        <Card key="ab" title="Thông tin bệnh nhân" size="small">
                          <li>Mã VP: {pid}</li>
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
                        <Card key="ab2" title="Kết quả phản hồi bệnh nhân" size="small">
                            <Select
                            defaultValue="jack"
                            style={{ width: '100%' }}
                            onChange={(value)=>setKqSelect(value)}
                            options={[
                              { value: 'jack', label: 'Hài lòng' },
                              { value: 'lucy', label: 'Không hài lòng' },
                              { value: 'Yiminghe', label: 'Không nghe máy' },
                              { value: 'disabled', label: 'Sai số' },
                              { value: 'fghj', label: 'Chưa xử lý' },
                            ]}
                          />   ,
                           <TextArea
                            showCount
                            maxLength={100}
                            onChange={(value)=>setKqSelect(value)}
                            placeholder="Nhập ghi chú bệnh nhân"
                            style={{ height: 120, resize: 'none' }}
                          />                          
                          {/* </AutoComplete> */}
                        </Card>                                            
                      ]
                    },
                  ]}
                />               
            </Modal>
        </>
      );
};
export default ModelViewCskh;