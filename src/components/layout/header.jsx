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
                    label: <Link to={"/cskh"}>Quản lý CSKH</Link>,
                    key: 'qlkh',
                    icon: <UsergroupAddOutlined />,
                    children: [
                        {
                            label: <Link to={"/cskhlist"}>Quản lý cuộc gọi</Link>,
                            key: 'qlcg',
                            icon: <UsergroupAddOutlined />,
                        },
                        {
                            label: <Link to={"/cskh"}>BN không hài lòng</Link>,
                            key: 'hskh',
                            icon: <UsergroupAddOutlined />,
                        }, {
                            label: <Link to={"/cskh"}>Danh sách khách hàng</Link>,
                            key: 'cskhlist',
                            icon: <UsergroupAddOutlined />,
                        }, {
                            label: <Link to={"/cskh"}>Báo cáo CSKH</Link>,
                            key: 'bccskh',
                            icon: <UsergroupAddOutlined />,
                        }
                    ]
                },{
                    label: <Link to={"/ycsuahs"}>Xem yêu cầu HS</Link>,
                    key: 'dsSuahs',
                    icon: <UsergroupAddOutlined />,
                },{
                    label: <Link to={"/testqr"}>Quét QRcode</Link>,
                    key: 'testqr',
                    icon: <UsergroupAddOutlined />,
                }
                /*{
                    label: <Link to={"/yctaonick"}>YC Tạo nick</Link>,
                    key: 'yctaonick',
                    icon: <UsergroupAddOutlined />,
                },
                {
                    label: <Link to={"/user"}>Người dùng</Link>,
                    key: 'user',
                    icon: <UsergroupAddOutlined />,
                } */
            
            ]
        },,{
            label: <Link to={"/quantri"}>Quản trị& Báo cáo</Link>,
            key: 'quantriehc',
            children: [
                {
                    label: <Link to={"/quantri"}>Quản trị IT</Link>,
                    key: 'quantriit',
                    icon: <UsergroupAddOutlined />,
                },
                {
                    label: <Link to={"/tracuuicd"}>Báo cáo ICD</Link>,
                    key: 'tracuuicd',
                    icon: <UsergroupAddOutlined />,
                },
                {
                    label: <Link to={"/bcdieutri"}>BC Điều Trị</Link>,
                    key: 'bcnoitru',
                    icon: <UsergroupAddOutlined />,
                }, {
                    label: <Link to={"/bcngoaitru"}>BC Ngoại trú</Link>,
                    key: 'bcngoaitru',
                    icon: <UsergroupAddOutlined />,
                },
                {
                    label: <Link to={"/khambenh"}>Tra cứu Phòng khám</Link>,
                    key: 'khambenhqt',
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

