import { useState } from "react";
import { Tabs, Table, Input, notification } from 'antd';
import { postbacsiApi, postpatientApi, postycsuaApi } from "../util/api";
import { CollectionsPage2 } from "../components/module/CreateFormModal";
const TracuubnPage = () => {   
    const { Search } = Input;
    const [options, setOptions]= useState('');  
    const [dataOp, setDataOp] = useState([]);

    const [dataKH, setDataKH]= useState([]); 
    const [dataKB, setDataKB]= useState([]); 
    const [dataTH, setDataTH]= useState([]); 
    const [dataDV, setDataDV]= useState([]);   
    const [dataYC, setDataYC]= useState([]);   
    const columns = [
        {
            title: 'Nội dung',
            dataIndex: 'name',
        },
        {
            title: 'Ngày YL',
            dataIndex: 'value',
        }
    ];  
    const columnEr = [
        {
            title: 'Dịch vụ',
            dataIndex: 'dichvu',
        },
        {
            title: 'Nội dung',
            dataIndex: 'yeucau',
        },
        {
            title: 'người yc',
            dataIndex: 'nguoiyc',
        },{
            title: 'ngày yc',
            dataIndex: 'nyc',
        }
    ];  
    const fetchPatientByID = async (query) => {  
        setOptions(query);    
        const res = await postpatientApi(query);                     
        if (!res?.message) {                    
            setDataKH(res.dataKH)          
            setDataKB(res.dataKB);              
            setDataTH(res.dataTH);    
            setDataDV(res.dataDV);  
            setDataYC(res.dataYC);  
            callSetOp(res.dataDV);                
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
    }    
    const onCreate = async (data) =>{
        var ngayrv ="";
        dataKH.forEach(element => {
            if(element.id==7){
                ngayrv = element.value;
            }
            console.log(">>>",element);
          });
        data.ngayrv=ngayrv;
        console.log(">>>data>",data);
       const res = await postycsuaApi(data);  
       if (!res?.message) {   
        setDataYC(res);                 
        notification.success({
            message: "Gửi YC thành công",
            description: res.message
        })           
       } else {
           notification.error({
               message: "Cập nhật thất bại",
               description: res.message
           })
       }        
    }     
    const callSetOp = (data) =>{
        const ops = [];      
        data.forEach((dv, index) => {         
          ops.push({key: dv.id,label:dv.name,value:dv.name});
        });        
        setDataOp(ops);        
    }    
    const onSearch = (value, _e, info) =>{
        if (isNaN(value)) 
            {
              alert("Must input numbers");
              return false;
            }else{
                if(value.length==6)
                    fetchPatientByID(value);
                else
                    setOptions([]);
            }
        
    } 
    return (
        <div style={{ padding: 20 }}>
             <div className="ant-col ant-col-xs-24 ant-col-xl-8">                          
                    <Search
                    placeholder="Nhập mã viện phí"
                    allowClear                   
                    onSearch={onSearch} enterButton 
                    style={{
                        width: "100%"                        
                    }}
                    
                    />
            </div>            
           <Tabs
                defaultActiveKey="1"
                items={[
                {
                    label: 'Thông tin Khách hàng',
                    key: '1',
                    children: [                              
                        <Table   
                        rowKey={"id"}                    
                        bordered
                        dataSource={dataKH} columns={columns}                       
                        key="tbylenh"
                        />                   
                    ],
                }, {
                    label: 'Công Khám',
                    key: '2',
                    children: [ 
                        <Table   
                        rowKey={"id"}                    
                        bordered
                        dataSource={dataKB} columns={columns}                       
                        key="tbcongkham"
                        />                      
                    ],  
                                   
                },
                {
                    label: 'Thuốc',
                    key: '3',
                    children: [ 
                        <Table   
                        rowKey={"id"}                    
                        bordered
                        dataSource={dataTH} columns={columns}                       
                        key="tbThuoc"
                        />                               
                    ],  
                                   
                },
                {
                    label: 'Dịch vụ',
                    key: '4',
                    children: [ 
                        <Table   
                        rowKey={"id"}                    
                        bordered
                        dataSource={dataDV} columns={columns}                       
                        key="tbDichvu"
                        />   ,
                        'Số lượng: '+ dataDV.length    ,                         
                    ],
                },{
                    label: 'Báo sửa HS',
                    key: '5',
                    children: [ 
                        <Table   
                        rowKey={"idyc"}                    
                        bordered
                        dataSource={dataYC} columns={columnEr}                       
                        key="tbbaoloi"
                        />,                       
                    ],
                }
                ]}
            />
            <>
             <CollectionsPage2
                            key="collectionEr"
                            dataKH={
                                dataKH.length>0?{ tenbn:options+'-'+dataKH[0].value} :{}   
                            }
                            onCreate={onCreate}
                            dataOp={dataOp}
                            onChange={onCreate}
                        />                                    
           </>
        </div>
    )
}

export default TracuubnPage;
