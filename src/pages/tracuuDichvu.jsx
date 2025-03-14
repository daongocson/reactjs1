import { AutoComplete, Button, DatePicker, Input, notification, Select, Space, Spin, Table, Tabs } from "antd";
import { useState } from "react";
import { postbaocaoDichvuApi, postbaocaoIcdApi, postDichvuApi, postDoctorApi, postIcdApi } from "../util/api";
import { SearchOutlined } from "@ant-design/icons";

const TracuuDichvuPage = () => {   
    const { RangePicker } = DatePicker;
    const [pending, setPending]= useState(false);  
    const [dataOp, setDataOp] = useState([]); 
    const [dateOp, setDateOp] = useState([]); 
    const [dataBaocao, setDataBaocao] = useState([]); 
    const [serviceCode, setServiceCode] = useState(''); 
    const columns = [
        {
            title: 'Mã VP',
            dataIndex: 'patientrecordid',
        },
        {
            title: 'Tên dịch vụ',
            dataIndex: 'servicename',
        },{
            title: 'Ngày KQ',
            dataIndex: 'ngayrv',
        }      

    ];  
    const handleOnSearch = async(values) => {   
        if(values.length==4)  {
            const res = await postDichvuApi(values);
            if (!res?.message) {                    
                const Options = res.map(res => ({
                    key:res.id,
                    value: res.servicecode,
                    label: res.servicecode+"->"+res.servicename,                    
                    isLeaf: false    
                  }));                   
                setDataOp(Options);              
            } else {
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                })
            }
        }else {
            if(values.length>4&&dataOp.length<1){
                const res = await postDichvuApi(values);
            }else{
                //filter(khi data có rồi thì filter)
            }            
        }      
      
      };
      const handleOnSelect = async(values,option) => {   
            setServiceCode(values);       
      }
      const OnClickHs = async () => {  
            if(dateOp.length<2) {
                notification.warning({
                    message: "Thời gian",
                    description: "Chưa chọn thời gian thống kê"
                })
                return;
            }    
            setDataBaocao([]);    
            setPending(true);               
            let data = {...dateOp,serviceCode};            
            const res = await postbaocaoDichvuApi(data);   
            if (!res?.message) { 
                setPending(false);
                if(res?.thongbao){
                    notification.success({
                        message: "Thành công",
                        description: res.thongbao
                    })
                }else
                setFilData(res);                
            } else {
                setPending(false);
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                })
            }
        
        
      };    
    const setFilData=(data)=>{
        setDataBaocao(data);              
    };  
      const onChangeDate = (date, dateString) => {        
        // console.log("date", dateString);
        setDateOp(dateString);
      };   
    return (
        <>
         <div style={{ padding: 20 }}>             
          <Space.Compact key={"spacehs"} block>
            <RangePicker onChange={onChangeDate}/>                          
            <AutoComplete
                        style={{   
                            width: "50%"            
                        }}                
                        placeholder="Nhập mã dịch vụ"
                        options={dataOp}
                        filterOption={true}               
                        onSearch={(value)=>handleOnSearch(value)}
                        onSelect={(value,option)=>{
                            handleOnSelect(value,option);
                        }}
                        >                            
            </AutoComplete>  
            <Button type="primary" disabled={pending}
                 onClick={OnClickHs}
                ><SearchOutlined /></Button>
            </Space.Compact>    
                <Tabs
                    defaultActiveKey="1"
                    items={[
                    {
                        label: `Thống kê bệnh nhân(${dataBaocao.length})`,
                        key: 'allbn',
                        children: [ 
                            // <Search
                            // placeholder="Nhập nội dung tìm kiếm"
                            // key={"seachCxl"}
                            // allowClear
                            // onChange={(event)=>{
                            //     setKeyword(event.target.value)
                            // }}                      
                            // style={{
                            //     width: "30%"                        
                            // }}
                            // /> ,
                            <Table
                                rowKey={"patientrecordid"}
                                bordered
                                dataSource={dataBaocao} columns={columns}      
                                loading={{ indicator: <div><Spin /></div>, spinning:pending}}
                                key="cskhk3hlxx"                                        
                            />  ,
                            'Số lượng: '+ dataBaocao.length                     
                        ],
                    }
                    ]}
                />
                </div>                 
        </>
    )
}

export default TracuuDichvuPage;
