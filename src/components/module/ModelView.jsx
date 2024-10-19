import React, { useState,useRef } from 'react';
//import { Button, Modal } from 'antd';
import { Button, Checkbox, Form, Input,Modal } from 'antd';
import Draggable from 'react-draggable';
function ModelView(props) {
    const{open,modaldata, handleOk,handleCancel}=props;  
    const [disabled, setDisabled] = useState(true); 
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    const showModal = () => {
        setOpen(true);
    };  
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
                <p>Mã VP: {modaldata.MaVP}</p>
                <p>Mã BN: {modaldata.MaBN}</p>                
                <p>{modaldata.TenBS}({modaldata.MaBS})</p>
                <p>{modaldata.TenDV}</p>
                <b>Nội dung lỗi:</b>
                <p>{modaldata.ndloi}</p>
            </Modal>
        </>
      );
};
export default ModelView;