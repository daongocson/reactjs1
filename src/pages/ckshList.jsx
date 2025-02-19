import { useEffect, useState } from "react";
import { Tabs, Table, Button, Space, DatePicker, Input, AutoComplete, notification } from 'antd';
import { getLsCskhApi, postbacsiApi} from "../util/api";
import { SignatureOutlined } from "@ant-design/icons";
const CSKHListPage = () => {       
    const [dataKh, setDataKh]= useState([]); 
    const { Search } = Input;
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {   
        fetchKhachhang();        
    }, [])
    const onSearch = async(value, _e, info) => {  
    }
    const columns = [
        {
            title: 'Tên bệnh nhân',
            dataIndex: 'patientrecordid',
        },              
        {
            title: 'Dịch vụ',
            dataIndex: 'dichvu',
        },
        {
            title: 'Yêu cầu',
            dataIndex: 'ghichu',
        },
        {
            title: 'Ngày ra viện',
            dataIndex: 'nrv',
        },{
            title: 'Ngày Yc',
            dataIndex: 'nyc',
        },{
            title: 'Người Yc',
            dataIndex: 'nguoiyc',
        },{
            title: 'Phòng',
            dataIndex: 'ngayra',
        },{
            title: 'Xử lý',
            dataIndex: 'phongth',
        },{
            title: 'Duyệt',
            dataIndex: 'id',
            key: 'id',
            render: (index, record) => (
              <Button  icon={<SignatureOutlined />} onClick={() => showModal(record)} />
            )
          },
          
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
    const handleOnSelect=async (vOptions)=>{
        console.log("vOptions",vOptions,fromDate,toDate);
        const res = await postbacsiApi("abc");
        if (!res?.message) {    
            // setPhong(res.listphongchucnang)
            // setQuyen(res.listphanquyen)
            // setDataBS(res.dataBS);    
            // setDataYL(res.dataYL);     
            // setDataTH(res.dataTH);
            // setDataKQ(res.dataKQ);   
            // setBsChinhEkip(res.dataBS[0].value);      
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
    }
    return (
        <div style={{ padding: 20 }}>    
        <div className="ant-col ant-col-xs-24 ant-col-xl-8">
                
                <Space.Compact key={"spacehs"} block>                                   
                <DatePicker   
                        label="Từ ngày"
                        placeholder="Từ ngày"
                        onChange={(date, dateString)=>{setFromDate(dateString)}}                       
                        style={{
                            width: '160',
                        }}
                    />  <DatePicker                       
                    placeholder="Tới ngày"
                    onChange={(date, dateString)=>{setToDate(dateString)}}                       
                    style={{
                        width: '160',
                    }}
                />  
                    <AutoComplete
                    style={{   
                        width: "100%"            
                    }}
                    placeholder="Nhập khoa"
                    options={[
                        {key: '1k', label: 'Khoa khám bệnh', value: 'Khoa khám bệnh'},
                        {key: '2n', label: 'Khoa Nội', value: 'Khoa Nội'} ,
                        {key: '3ng', label: 'Khoa Ngoại', value: 'Khoa Ngoại'} ,
                        {key: '3yh', label: 'Khoa YHCT', value: 'Khoa YHCT'} ,
                        {key: '4s', label: 'Khoa Sản', value: 'Khoa sản'}     
                                          
                    ]}
                    filterOption={true}
                    onSelect={(value)=>{
                        handleOnSelect(value);
                    }}
                    >
                        
                    </AutoComplete>               
                     <Button
                        type="primary"
                        onClick={config}
                    >
                        Cài đặt cuộc gọi
                    </Button> 
             </Space.Compact>
        </div>     
                
           <Tabs
                defaultActiveKey="1"
                items={[
                {
                    label: `BN chưa xử lý (${dataKh.length})`,
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
                },{
                    label: `BN không nghe máy (${dataKh.length})`,
                    key: 'bn2',
                    children: [ 
                        <Table   
                        rowKey={"idcs1kh"}                    
                        bordered
                        dataSource={dataKh} columns={columns}                       
                        key="cskhkhl"
                        /> ,
                        'Số lượng: '+ dataKh.length                     
                    ],
                },{
                    label: `Tất cả BN(${dataKh.length})`,
                    key: 'bn3',
                    children: [ 
                        <Table   
                        rowKey={"idcsk11h"}                    
                        bordered
                        dataSource={dataKh} columns={columns}                       
                        key="cskhkhl"
                        /> ,
                        'Số lượng: '+ dataKh.length                     
                    ],
                }
                ]}
            />                                     
        </div>
    )
}

export default CSKHListPage;

