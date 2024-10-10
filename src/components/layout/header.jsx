import React, { useContext, useState } from 'react';
import { UsergroupAddOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

const Header = () => {

    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const items = [
        {
            label: <Link to={"/"}>Trang chủ</Link>,
            key: 'home',
            icon: <HomeOutlined />,
        },
        ...(auth.isAuthenticated ? [{
            label: <Link to={"/listEror"}>Danh sách lỗi</Link>,
            key: 'listEror',
        },
        {
            label: `Tìm nhanh ${auth?.user?.email ?? ""}`,
            key: 'SubMenu11',
            icon: <SettingOutlined />,
            children: [
                {
                    label: <Link to={"/ylenhbs"}>Y lệnh Bs</Link>,
                    key: 'ylenhbs',
                    icon: <UsergroupAddOutlined />,
                },
                {
                    label: <Link to={"/user"}>Người dùng</Link>,
                    key: 'user',
                    icon: <UsergroupAddOutlined />,
                }
            
            ]
        }
       
        ] : []),
        {
            label: `Welcome ${auth?.user?.email ?? ""}`,
            key: 'SubMenu',
            icon: <SettingOutlined />,
            children: [
                ...(auth.isAuthenticated ? [{
                    label: <span onClick={() => {
                        localStorage.clear("access_token");
                        setCurrent("home");
                        setAuth({
                            isAuthenticated: false,
                            user: {
                                email: "",
                                name: ""
                            }
                        })
                        navigate("/");

                    }}>Đăng xuất</span>,
                    key: 'logout',
                }] : [
                    {
                        label: <Link to={"/login"}>Đăng nhập</Link>,
                        key: 'login',
                    }
                ]),
            ],
        }

    ];

    const [current, setCurrent] = useState('mail');
    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };
    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};
export default Header;

