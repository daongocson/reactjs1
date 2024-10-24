import React, { useState } from 'react';
//import { Button, Modal } from 'antd';
import { Button, Checkbox, Form, Input,Modal } from 'antd';
function CreateEkip(props) {
    const {isModalVisible,setIsModalVisible,form,onCreate } =props;    
    
    const onModelCreate = (values) => {
       
        onCreate(values);
        setIsModalVisible(false);
      };
    return (
        <>
            <Modal
            open={isModalVisible}
            title="Tạo bác sĩ ekip mới"
            okText="Gửi duyệt"
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
            
            <Form.Item name="mabhyt" label="Số chứng chỉ hành nghề(bác sĩ)">
                  <Input  disabled={true}/>
            </Form.Item>
            <Form.Item
            name="tenbs"
            label="Tên bác sĩ"           
            >
            <Input />
            </Form.Item>
            <Form.Item name="mabs" label="ID ekip mới" 
             rules={[
                {
                required: true,
                message: 'Mời nhập nick!',
                },
            ]}
            >
            <Input />
            </Form.Item>          
        </Modal>
    </>
    )
};
export default CreateEkip;