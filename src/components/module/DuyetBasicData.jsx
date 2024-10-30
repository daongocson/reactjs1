import React, { useState } from 'react';
//import { Button, Modal } from 'antd';
import {Form, Input,Modal } from 'antd';
function DuyetBasicData(props) {
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
             <Form.Item name="nhanviencode" label="Mã bác sĩ" 
             rules={[
                {
                required: true,
                message: 'Mời nhập mã bác sĩ!',
                },
            ]}
            >
            <Input />
            </Form.Item>    
            <Form.Item name="action" label="Mã quản trị" 
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
export default DuyetBasicData;