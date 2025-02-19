import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { createUserApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import React, { Component } from 'react'
import QrReader from 'react-qr-scanner'
import TextArea from 'antd/es/input/TextArea';

class Test extends Component {
  constructor(props){
    super(props)
    this.state = {
      delay: 100,
      result: 'No result',
    }

    this.handleScan = this.handleScan.bind(this)
  }
  handleScan(data){
    this.setState({
      result: data,
    })
  }
  handleError(err){
    console.error(err)
  }
  render(){
    const previewStyle = {
      height: 240,
      width: 320,
    }

    return(
      <div>
        <QrReader
          delay={this.state.delay}
          style={previewStyle}
          onError={this.handleError}
          onScan={this.handleScan}
          />
        <p>{this.state.result}</p>
      </div>
    )
  }
}
const TestQrPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
      console.log(values);      
      const { name } = values;
      var arrInfo = [];
      var arr = name.split("\n");        
      if(arr.length<7){
        console.log("Không đúng định dạng",arr.length);
        return;
      }    
      for (let i = 0; i < arr.length; i++) {
        var vArr=arr[i].split(":");
        if(vArr.length<2){
          console.log("Không đúng định dạng",vArr.length);
          return;
        } 
        arrInfo.push(vArr[1]);  
      }
      var arrAdr = arrInfo[5].split(",");
      console.log("giatri:",arrAdr[0],"-",arrAdr[1],"-",arrAdr[2],"-",arrAdr[3]);      

      console.log("giatri-",arrInfo);      


        // const res = await createUserApi(name, email, password);

        // if (res) {
        //     notification.success({
        //         message: "CREATE USER",
        //         description: "Success"
        //     });
        //     navigate("/login");

        // } else {
        //     notification.error({
        //         message: "CREATE USER",
        //         description: "error"
        //     })
        // }

    };

    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "15px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                }}>
                    <legend>Đăng Ký Tài Khoản</legend>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout='vertical'
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your name!',
                                },
                            ]}
                        >
                            <TextArea   autoSize={{ minRows: 4, maxRows: 9 }}
                            />
                        </Form.Item>

                        <Form.Item
                        >
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                    <Test />
                    <Link to={"/"}><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                    <Divider />                   

                </fieldset>
            </Col>
        </Row>

    )
}

export default TestQrPage;