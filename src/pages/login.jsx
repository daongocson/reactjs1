
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { loginApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import { ArrowLeftOutlined } from '@ant-design/icons';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    const [ipClient, setIpClient] = useState('');
    const getClientApi=()=>{
        fetch("https://api.ipify.org?format=json")
        .then(response => response.json())
        .then(data => {
            // Display the IP address on the screen
            let userAgent = window.navigator.userAgent;
            if(userAgent.length>45)userAgent=userAgent.substring(0,45);
            const host= window.location.hostname;

            let info = host+":ip-"+data.ip+userAgent;
            setIpClient(info);
        })
        .catch(error => {
            console.error("Error fetching IP address:", error);
        });
    }    
    useEffect(() => {           
        getClientApi();        
    }, [])
    const onFinish = async (values) => {       
        const { email, password } = values;
        const res = await loginApi(email, password,ipClient);
        if (res && res.EC === 0) {
            localStorage.setItem("access_token", res.access_token)
            notification.success({
                message: "LOGIN USER",
                description: "Success"
            });
            setAuth({
                isAuthenticated: true,
                user: {
                    email: res?.user?.email ?? "",
                    name: res?.user?.name ?? "",
                    ipclient:ipClient
                }
            })
            navigate("/");

        } else {
            notification.error({
                message: "LOGIN USER",
                description: res?.EM ?? "error"
            })
        }

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
                    <legend>Đăng Nhập</legend>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout='vertical'
                    >
                        <Form.Item
                            label="Tài khoản(Liên hệ IT cấp tài khoản)"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>



                        <Form.Item
                        >
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link to={"/"}><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        Chưa có tài khoản? <Link to={"/register"}>Đăng ký tại đây</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    )
}

export default LoginPage;