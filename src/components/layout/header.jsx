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
            label: <Link to={"/tracuubn"}>Tra cứu bệnh nhân</Link>,
            key: 'tracuubn',
            icon: <UsergroupAddOutlined />,
        },
        {
            label: `Tìm nhanh ${auth?.user?.email ?? ""}`,
            key: 'SubMenu11',
            icon: <SettingOutlined />,
            children: [
                {
                    label: <Link to={"/ylenhbs"}>Tra cứu Bác sĩ</Link>,
                    key: 'ylenhbs',
                    icon: <UsergroupAddOutlined />,
                },
                {
                    label: <Link to={"/tracuubn"}>Tra cứu bệnh nhân</Link>,
                    key: 'tracuubnsub',
                    icon: <UsergroupAddOutlined />,
                }, {
                    label: <Link to={"/khambenh"}>Tra cứu Phòng khám</Link>,
                    key: 'khambenh',
                    icon: <UsergroupAddOutlined />,
                },
                {
                    label: <Link to={"/listEror"}>Hồ sơ cảnh báo</Link>,
                    key: 'hscanhbao',
                    icon: <UsergroupAddOutlined />,
                }, {
                    label: <Link to={"/chamcong"}>Chấm công vân tay</Link>,
                    key: 'chamcong',
                    icon: <UsergroupAddOutlined />,
                },
                {
                    label: <Link to={"/cskh"}>Hồ sơ CSKH</Link>,
                    key: 'cskh',
                    icon: <UsergroupAddOutlined />,
                },{
                    label: <Link to={"/ycsuahs"}>Xem yêu cầu HS</Link>,
                    key: 'dsSuahs',
                    icon: <UsergroupAddOutlined />,
                }
               // {
           //         label: <Link to={"/user"}>Người dùng</Link>,
             //       key: 'user',
         //           icon: <UsergroupAddOutlined />,
             //   }
            
            ]
        },,{
            label: <Link to={"/tracuubn"}>Quản trị EHC</Link>,
            key: 'quantriehc',
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

