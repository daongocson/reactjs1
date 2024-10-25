import React, { useState } from 'react';
//import { Button, Modal } from 'antd';
import { AutoComplete, Form, Input,Modal } from 'antd';
import { postDoctorApi } from '../../util/api';
function CreateEkip(props) {
    const {isModalVisible,setIsModalVisible,form,onCreate,dataEkip,dataBS } =props;    
    const [dataOp, setDataOp]= useState([]); 
    const onModelCreate = (values) => {       
        onCreate(values);
        setIsModalVisible(false);
      };
      const handleOnSearch = async(values) => {   
        if(values.length==4||(values.length>4&&dataOp))  {
            const res = await postDoctorApi(values);
            if (!res?.message) {                    
                const firstOptions = res.map(res => ({
                    key:res.rownum,
                    value: res.nhanvienemail+"->"+res.nvcode+"-"+dataEkip,
                    label: res.nhanvienemail+"->"+res.nvcode+"-"+dataEkip,
                    nvcode:res.nvcode,
                    tenbsekip:res.nhanvienemail,
                    phonebsekip:res.nhanvienphone,
                    isLeaf: false    
                  }));                   
                setDataOp(firstOptions);              
            } else {
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                })
            }
        }      
      
      };
      const handleOnSelect = async(values,option) => {  
        form.resetFields();       
        form.setFieldsValue({mabhyt:dataBS[1].value+"(" +dataBS[3].value+")",mabs:option.nvcode+"-"+dataEkip,tenbsekip:option.tenbsekip,phonebsekip:option.phonebsekip});  
      }
    return (
        <>
            <Modal
            open={isModalVisible}
            title="Tạo mới BS-ekip"
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
            
            <Form.Item name="mabhyt" label="Số chứng chỉ hành nghề(bác sĩ chính)">
                  <Input  disabled={true}/>
            </Form.Item>  
            <Form.Item name="mabs" label="Nick đăng nhập" 
             rules={[
                {
                required: true,
                message: 'Mời nhập nick!',
                },
            ]}
            >
             <AutoComplete
                 style={{   
                    width: "100%"            
                }}                
                 placeholder="Nhập accout bs"
                 options={dataOp}
                 filterOption={true}               
                 onSearch={(value)=>handleOnSearch(value)}
                 onSelect={(value,option)=>{
                    handleOnSelect(value,option);
                 }}
                 >
                    
            </AutoComplete>
            </Form.Item>      
            <Form.Item name="tenbsekip" label="Tên BS ekip" 
             rules={[
                {
                required: true,
                message: 'Mời nhập tên bs ekip!',
                },
            ]}
            >
            <Input />
            </Form.Item>    
            <Form.Item name="phonebsekip" label="SĐT BS ekip" 
             rules={[
                {
                required: true,
                message: 'Số Điện thoại BS ekip',
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