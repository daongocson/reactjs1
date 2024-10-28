import React, { useState } from 'react';
//import { Button, Modal } from 'antd';
import {Form, Input,Modal } from 'antd';
function DuyetBasic(props) {
    const {isbasicVisible,setIsbasicVisible,form,onCreate} =props;    
    
    const onModelCreate = (values) => {    
        onCreate(values);
        setIsbasicVisible(false);
      };
    return (
        <>
            <Modal
            open={isbasicVisible}
            title="Admin Function"
            okText="Duyệt"
            cancelText="Cancel"
            okButtonProps={{
            autoFocus: true,
            htmlType: 'submit',
            }}
            onCancel={() => setIsbasicVisible(false)}
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
            <Form.Item name="maquyen" label="Mã quản trị" 
             rules={[
                {
                required: true,
                message: 'Mời nhập mã quyền quản trị!',
                },
            ]}
            >
            <Input.Password />
            </Form.Item>          
        </Modal>
    </>
    )
};
export default DuyetBasic;