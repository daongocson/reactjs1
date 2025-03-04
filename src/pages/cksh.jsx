import { useEffect, useState } from "react";
import { Tabs, Table, Button } from 'antd';
import { getLsCskhApi} from "../util/api";
import { Link } from "react-router-dom";
import { UsergroupAddOutlined } from "@ant-design/icons";
const CSKHPage = () => {       
    const [dataKh, setDataKh]= useState([]); 
    useEffect(() => {   
        fetchKhachhang();        
    }, [])
 
    const columns = [
        {
            title: 'Mã VP',
            dataIndex: 'patientrecordid',
        },
        {
            title: 'Nội dung',
            dataIndex: 'ghichu',
        }, {
            title: 'Nội dung',
            dataIndex: 'phone',
        },
        {
            title: 'Ngày Ra',
            dataIndex: 'ngayra',
        }
    ];  
    const fetchKhachhang = async () => {
        const res = await getLsCskhApi();
        if (!res?.message) {   
            setDataKh(res);              
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
    }  
    const config=()=>{      
                let config = {
                        theme: 'default', // sử dụng UI mặc định của sdk
                        debug: true, // cho phép console.log các event call và trạng thái trong sdk
                        busy: false, // nếu true, sẽ auto reject các cuộc gọi đến, nhưng vẫn có thể thực hiện cuộc gọi ra
                        language: 'vi', // Ngôn ngữ giao diện dialog,
                        ringtoneVolume: 0.5,
                         options: {
                        // 	showNoteInput: false, // hiển thị input note mặc định để lưu vào Omi, sẽ submit qua callback "saveCallInfo" khi cuộc gọi đã kết thúc và dialog call được đóng
                             hideCallButton: false, // ẩn hiển thị nút toggle dialog nhập số để gọi ra mặc định
                        // 	showContactLoading: false, // hiển thị loading ở dialog gọi khi có cuộc gọi đến, dùng kết hợp với function omiSDK.updateContactInfo để hiển thị avatar và tên của số điện thoại gọi đến
                        // 	// maskedPhoneNumberFormat: ['start', 4, '*'], // => ****749346
                        // 	// maskedPhoneNumberFormat: ['end', 5, 'x'], // => 03947xxxxx
                         },
                        // classes: { custom class, được truyền vào thuộc tính class cho 2 component
                        // 	btnToggle: 'custom-btn-toggle-call custom-abc',
                        // 	dialog: 'custom-dialog-call',
                        // },
                        // styles: { custom style được truyền dạng inline css cho 2 component
                        // 	btnToggle: {
                        // 		'background-color': 'blue',
                        // 		justifyContent: 'center',
                        // 		color: 'red',
                        // 	},
                        // 	dialog: {
                        // 		'background-color': 'blue',
                        // 		justifyContent: 'center',
                        // 		color: 'red',
                        // 	},
                        // },
                        // forms: [ // hiển thị form UI bên phải dialog trong khi call, sẽ submit qua callback "saveCallInfo" khi cuộc gọi đã kết thúc và dialog call được đóng
                        // 	{
                        // 		id: 'note1',
                        // 		label: 'Ghi chú 1',
                        // 		plh: 'Nhập ghi chú 1',
                        // 		multiline: true,
                        // 		required: true,
                        // 		className: 'demo-custom-form form-note',
                        // 	},
                        // 	{
                        // 		id: 'note2',
                        // 		label: 'Ghi chú 2',
                        // 		plh: 'Nhập ghi chú 2',
                        // 	},
                        // 	{
                        // 		id: 'note3',
                        // 		label: 'Ghi chú 3',
                        // 		plh: 'Nhập ghi chú 3',
                        // 		multiline: true,
                        // 		required: true,
                        // 		height: '200px',
                        // 	},
                        // 	{
                        // 		id: 'address',
                        // 		label: 'Địa chỉ',
                        // 		plh: 'Nhập ghi địa chỉ',
                        // 	},
                        // ],
                        callbacks: {
                            register: (data) => {
                                // Sự kiện xảy ra khi trạng thái kết nối tổng đài thay đổi
                                // console.log('register:', data);
                            },
                            connecting: (data) => {
                                // Sự kiện xảy ra khi bắt đầu thực hiện cuộc gọi ra
                                // console.log('connecting:', data);
                            },
                            invite: (data) => {
                                // Sự kiện xảy ra khi có cuộc gọi tới
                                 console.log('invite:', data);
                            },
                            inviteRejected: (data) => {
                                // Sự kiện xảy ra khi có cuộc gọi tới, nhưng bị tự động từ chối
                                // trong khi đang diễn ra một cuộc gọi khác
                                // console.log('inviteRejected:', data);
                            },
                            ringing: (data) => {
                                // Sự kiện xảy ra khi cuộc gọi ra bắt đầu đổ chuông
                                // console.log('ringing:', data);
                            },
                            accepted: (data) => {
                                // Sự kiện xảy ra khi cuộc gọi vừa được chấp nhận
                                // console.log('accepted:', data);
                            },
                            incall: (data) => {
                                // Sự kiện xảy ra mỗi 1 giây sau khi cuộc gọi đã được chấp nhận
                                // console.log('incall:', data);
                            },
                            acceptedByOther: (data) => {
                                // Sự kiện dùng để kiểm tra xem cuộc gọi bị kết thúc
                                // đã được chấp nhận ở thiết bị khác hay không
                                // console.log('acceptedByOther:', data);
                            },
                            ended: (data) => {
                                // Sự kiện xảy ra khi cuộc gọi kết thúc
                                // console.log('ended:', data);
                            },
                            holdChanged: (status) => {
                                // Sự kiện xảy ra khi trạng thái giữ cuộc gọi thay đổi
                                // console.log('on hold:', status);
                            },
                            saveCallInfo: (data) => {
                                // data = { callId, note, ...formData };
                                // Sự kiện xảy ra khi cuộc gọi đã có đổ chuông hoặc cuộc gọi tới, khi user có nhập note input mặc định hoặc form input custom
                                // console.log('on save call info:', data);
                            },
                        },
                        // backwards compatible | Legacy APIs
                        // ringtone_volume: 0.5,
                        // form_ui: { call_button: { enabled: false } },
                        // register_fn: (data) => {
                        // 	console.log('[LEGACY_API] register_fn:', data);
                        // }, // done
                        // incall_fn: (data) => {
                        // 	console.log('[LEGACY_API] incall_fn:', data);
                        // }, // 
                        // accept_fn: (data) => {
                        // 	console.log('[LEGACY_API] accept_fn:', data);
                        // }, // done
                        // endcall_fn: (data) => {
                        // 	console.log('[LEGACY_API] endcall_fn:', data);
                        // }, // done
                        // invite_fn: (data) => {
                        // 	console.log('[LEGACY_API] invite_fn:', data);
                        // }, // done
                        // invite_2fn: (data) => {
                        // 	console.log('[LEGACY_API] invite_2fn:', data);
                        // }, // done
                        // accept_out_fn: (data) => {
                        // 	console.log('[LEGACY_API] accept_out_fn:', data);
                        // }, // done
                        // ping_fn: (data) => {
                        // 	console.log('[LEGACY_API] ping_fn:', data);
                        // },
                    };
                    // flow dùng cơ bản: Init SDK với config, sau đó register tới tổng đài trong callback của fucntion init
                    omiSDK.init(config, () => {
                        // nếu url login của bạn là: https://abc.omicall.com
                        // và số nội bộ của bạn là 100 với password là 123456
                        // thì param khi register sẽ là:
                        // omiSDK.register({
                        //    domain: 'abc',
                        //    username: '100', 
                        //    password: '123456'
                        // });
                        
                        // // có thể catch các lỗi khi reigster thất bại bằng cách:
                        // // Error : { code, message }
                        // currentSDK.register(extension, (error) => {
                        // 	console.log('register error:', error);
                        // });
                        // // hoặc
                        let extension = {
                            domain: 'cnttminhan',
                            username: '100',
                            password: 'Cg7xcBf9ur',
                        };
                        omiSDK.register(extension);
                        console.log("click config me!!");
                        // currentSDK.register(extension)
                        // 	.then((data) => console.log('register finish!', data))
                        // 	.catch(error => console.log('register error:', error));
        });	
        
    } 
    return (
        <div style={{ padding: 20 }}>       
           <Tabs
                defaultActiveKey="1"
                items={[
                {
                    label: 'BN không hài lòng',
                    key: '1',
                    children: [ 
                        <Table   
                        rowKey={"idcskh"}                    
                        bordered
                        dataSource={dataKh} columns={columns}                       
                        key="cskhkhl"
                        /> ,
                        'Số lượng: '+ dataKh.length                     
                    ],
                }
                ]}
            />   
            <Button
                type="primary"
                onClick={config}
            >
                Báo sửa HS
            </Button>                            
        </div>
    )
}

export default CSKHPage;

