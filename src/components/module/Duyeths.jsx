import React, { useState } from 'react';
//import { Button, Modal } from 'antd';
import { Button, Checkbox, Form, Input,Modal } from 'antd';
function Duyeths(props) {
    const {isModalVisible,setIsModalVisible,form,onCreate } =props;    
    
    const onModelCreate = (values) => {
       
        onCreate(values);
        setIsModalVisible(false);
      };
    return (
        <>
            <Modal
            open={isModalVisible}
            title="Duyệt hồ sơ"
            okText="Duyệt"
            cancelText="Cancel"
            okButtonProps={{
            autoFocus: true,
            htmlType: 'submit',
            }}
            onCancel={() => setIsModalVisible(false)}
            destroyOnClose
            modalRender={(dom) => (
            <Form
                layout="vertical"
                form={form}
                name="form_in_modal"                        
                onFinish={(values) => onModelCreate(values)}
            >
                {dom}
            </Form>
            )}
        >
            
            <Form.Item name="idyc" label="Mã HS">
                  <Input  disabled={true}/>
            </Form.Item>
            <Form.Item
            name="tenbn"
            label="Tên bệnh nhân"           
            >
            <Input />
            </Form.Item>
            <Form.Item name="maquyen" label="Mã quản trị" 
             rules={[
                {
                required: true,
                message: 'Mời nhập mã quyền quản trị!',
                },
            ]}
            >
            <Input type="password"  />
            </Form.Item>          
        </Modal>
    </>
    )
};
export default Duyeths;