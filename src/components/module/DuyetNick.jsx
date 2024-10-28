import React, { useState } from 'react';
//import { Button, Modal } from 'antd';
import { Button, Card, Checkbox, Form, Input,Modal, Space } from 'antd';
function DuyetNick(props) {
    const {isModalVisible,setIsModalVisible,form,onCreate,modaldata } =props;    
    
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
            <Form.Item>
                <Card title="Thông tin bác sĩ" size="small">
                <p>BS chính{modaldata.nhanviencode_byt}-{modaldata.nhanvienname}</p>
                <p>Họ tên(đăng ký BHXH): {modaldata.hovaten}</p>
                <p>Mã định danh y tế: {modaldata.masodinhdanhyte}</p>  
                <p>Nick Ekip:<b> {modaldata.nhanviencode}</b></p>
                <p>Tên BSEkip: {modaldata.nhanvienemail}</p>                           
                <p>Phone BSEkip: {modaldata.nhanvienphone}</p>   
                </Card>
            </Form.Item>
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
export default DuyetNick;