import { CrownOutlined, FileExcelOutlined, SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Button, DatePicker, notification, Result, Space, Table, Tabs } from "antd";
import { useState } from "react";
import { postycbydateApi } from "../util/api";
import { CSVLink } from "react-csv";

const QuantriPage = () => {   
      const [datebc, setDatebc]= useState(''); 
      const [optionNgay, setoptionNgay]= useState(''); 
      const [datayc, setDatayc]= useState([]); 
      const handleOnSelect  = (value) => {
        console.log("onSelect", value);
      };
      const columns = [
        {
            title: 'Tên bệnh nhân',
            dataIndex: 'tenbn',
        },
        {
            title: 'Yêu cầu',
            dataIndex: 'yeucau',
        }, {
            title: 'Ngày YC',
            dataIndex: 'nyc',
        },
        {
            title: 'Ngày Ra',
            dataIndex: 'nrv',
        }
    ];  
      const OnClickHs = async () => {
        if(datebc&&optionNgay){
            var option =0;
            if(optionNgay=="Đúng ngày")
                option=1;
            const res = await postycbydateApi({datebc:datebc,option:option});
            if (!res?.message) {     
                console.log(res);               
                setDatayc(res);   
            } else {
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                })
            }
        }
      };
    return (
        <div >           
            <Tabs
                defaultActiveKey="1"
                items={[
                {
                    label: 'Trang admin EHC',
                    key: '1',
                    children: [ 
                        <Result
                            key={"adfdf"}
                            icon={<CrownOutlined />}
                            title="Trang quản trị dành cho IT"
                        >
                        </Result>
                    ],
                },{
                    label: 'Tạo nick bác sĩ',
                    key: '2',
                    children: [                        
                        <Table   
                                   
                        key="admin2"
                        />                       
                    ],
                },{
                    label: 'Tổng hợp Hồ sơ',
                    key: '3',
                    children: [ 
                        <Space.Compact key={"spacehs"} block>
                        <DatePicker   
                            placeholder="Chọn ngày YC"
                            onChange={(date, dateString)=>{setDatebc(dateString)}}                       
                            style={{
                                width: '40%',
                            }}
                        />
                         <AutoComplete                        
                                style={{   
                                width: "40%"            
                            }}                                     
                            onSelect={(value)=>{setoptionNgay(value)}}
                            options={[
                                {key: '1a', label: 'Đúng ngày', value: 'Đúng ngày'},
                                {key: '2a', label: 'Trái ngày', value: 'Trái ngày'}                           
                            ]}
                            filterOption={true}                               
                            >   
                        </AutoComplete>
                        <Button type="default" onClick={OnClickHs}><SearchOutlined /></Button>
                        <CSVLink 
                            filename={"Tonghop-hosoyeucau.csv"}   
                            icon={<FileExcelOutlined />}                        
                            data={datayc}><Button
                              icon={<FileExcelOutlined />}
                            type="default"/>
                        </CSVLink>
                      </Space.Compact>,
                        <Table  
                            rowKey={"idyc"}                    
                            bordered
                            dataSource={datayc} 
                            columns={columns}   
                            defaultPageSize={10}                                  
                            pagination={{
                                defaultPageSize:"10" , 
                                defaultCurrent:"1",
                                total: datayc.length, 
                                pageSizeOptions: ["10","50", "100", "150"],                   
                                showSizeChanger: true, locale: {items_per_page: ""} 
                               }}           
                        
                                               
                        /> ,
                        'Số lượng: '+ datayc.length    ,                        
                    ],
                },
                ]}
                />
        </div>
      
    )
}
export default QuantriPage;