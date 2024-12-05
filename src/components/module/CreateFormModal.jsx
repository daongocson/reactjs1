import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Radio, AutoComplete } from "antd";


const CreateForm = (props) => {
  const { visible, setVisible, onCreate,form,dataOp} = props;  
  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {                
        onCreate(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  const handleOnSearch=(query)=>{  
    if(dataOp?.length>0)
      dataOp.filter((el) => el.value.toLowerCase().includes(query.toLowerCase()));  
    
}

  return (
    <Modal
   
    open={visible}
      title="Báo sửa HS"
      okText="Lưu"
      onCancel={() => {   
        setVisible(false);
      }}
      onOk={handleCreate}
    >
      <Form 
      form={form} 
      layout="vertical"      
      >
        <Form.Item name="tenbn" label="Tên bệnh nhân">
          <Input   disabled={true}
          />
        </Form.Item> 
     
        <Form.Item
          label="Nhập Yêu cầu IT"
          name="yeucau"
          type="textarea"
          rules={[
            { required: true, message: "Nhập yêu cầu !" }
          ]}
        >
          <AutoComplete
                 style={{   
                    width: "100%"            
                }}                
                 placeholder="Nhập yêu cầu"
                 options={[
                    {key: '1', label: 'IT Mở HS, Khoa sửa', value: 'IT Mở HS, Khoa sửa'},
                    {key: '2', label: 'IT sửa giờ', value: 'IT sửa giờ'},
                    {key: '3', label: 'IT sửa công khám', value: 'IT sửa công khám'},
                    {key: '4', label: 'IT sửa dịch vụ', value: 'IT sửa dịch vụ'},
                    {key: '5', label: 'Đã sửa', value: 'Đã sửa'}
                  ]}
                 filterOption={true}                               
                 >
                    
                </AutoComplete>
        </Form.Item>

        <Form.Item
          label="Dịch vụ yêu cầu sửa"
          name="dichvu"         
          rules={[
            { required: true, message: "Nhập yêu cầu!" }
          ]}
        >
            <AutoComplete
                 style={{   
                    width: "100%"            
                }}                
                 placeholder="Nhập dịch vụ"
                 options={dataOp}
                 filterOption={true}               
                 onSearch={(value)=>handleOnSearch(value)}
                 >
                    
                </AutoComplete>
        </Form.Item>
        <Form.Item name="nguoiyc" label="Người yêu cầu" 
         rules={[
          { required: true, message: "Nhập yêu cầu!" }
        ]}>
          <Input/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

/**
 * Function version of the component below
 * @param {function} onChange when change occurs
 */
export const CollectionsPage2 = (props) => {
  const { onChange,dataKH,dataOp  } = props;
  const [visible, setVisible] = useState(false);
 const [form] = Form.useForm();

  const onCreate = (values) => {    
    onChange(values);
    setVisible(false);
  };
  const urlDomain ="https://traketqua.benhvienminhan.com/";
  return (
    <div>
      <span className="input-label">
      <Button
        type="primary"
        onClick={() => {          
          form.setFieldsValue(dataKH);      
          if(Object.keys(dataKH).length !== 0){             
            setVisible(true);
          }
            
         // }    
          
          
        }}
      >
        Báo sửa HS
      </Button>
      <Button
        type="default"
        color="yellow"
        onClick={() => {  
          if(dataKH?.tenbn){
            let idAray = dataKH.tenbn.split("-");
            let idEncodeed = btoa(idAray[0]);
            window.open(urlDomain+'ketquacls/'+idEncodeed, '_blank').focus();
          }
          
       //   console.log(dataKH.tenbn);
          // window.open('ketquacls/'+dataKH, '_blank').focus();

          //ketquacls/NTk4NzQz 
        }}
      >
        Trả KQ-CLS
      </Button>
      </span>
      <CreateForm
        visible={visible}
        setVisible={setVisible}
        onCreate={onCreate}       
        dataOp={dataOp}
        form={form}
      />
    </div>
  );
};

/**
 * Class version of the component above
 * @param {function} onChange when change occurs
 */
export class CollectionsPage extends React.Component {
  state = {
    visible: false
  };

  constructor(props) {
    super(props);
    this.onChange = this.props.onChange;
  }

  setVisible = (bool) => {
    this.setState({ visible: bool });
  };

  onCreate = (values) => {
    this.onChange(values);
    this.setVisible(false);
  };

  // It renders a button and a model consists of a form
  // Create form component
  render() {
    return (
      <div>
        <Button
          type="primary"
          onClick={() => {
            this.setVisible(true);
          }}
        >
          Báo lỗi
        </Button>
        <CreateForm
          visible={this.state.visible} // visibility flag
          setVisible={this.setVisible} // setVisible function as parameter
          onCreate={this.onCreate} // when form completed this function will bring the values
        />
      </div>
    );
  }
}

// render(<CollectionsPage />, document.getElementById("root"));
