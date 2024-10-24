import { CrownOutlined } from "@ant-design/icons"
import { Button, Checkbox, Form, Input, Table, Tabs } from "antd"

const YCtaonickPage = () => {
    return (
        <div style={{ padding: 30 }}>
             <Tabs
                defaultActiveKey="1"
                items={[
                {
                    label: 'Bác sĩ phụ trách',
                    key: '1',
                    children: [ 
                        <Form
                            name="basic"
                            labelCol={{
                            span: 8,
                            }}
                            wrapperCol={{
                            span: 16,
                            }}
                            style={{
                            maxWidth: 600,
                            }}
                            initialValues={{
                            remember: true,
                            }}                          
                            autoComplete="off"
                        >
                            <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {
                                required: true,
                                message: 'Please input your username!',
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
                            <Input />
                            </Form.Item>

                            <Form.Item
                            name="remember"
                            valuePropName="checked"
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                            >
                            <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                            >
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                            </Form.Item>
                        </Form>   
                    ],
                },{
                    label: 'Bác sĩ BH',
                    key: '2',
                    children: [                        
                        <Table   
                                   
                        key="admin2"
                        />                       
                    ],
                }
            ]}
          />
        </div>
    )
}
export default YCtaonickPage