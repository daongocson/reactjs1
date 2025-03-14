import { FileExcelOutlined } from '@ant-design/icons';
import {Button, Modal,Table, Tabs} from 'antd';
import { CSVLink } from 'react-csv';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
function ModelbcCskhchitiet(props) {
    const{open,setOpen,data,loading}=props;    
  const columns_nt = [
    {
        title: 'Phòng bệnh',
        dataIndex: 'name',
    }, {
      title: 'Không có SĐT',
      dataIndex: 'ksdt',
    },{
      title: 'Không nghe máy',
      dataIndex: 'knm',
    },{
      title: 'Hài Lòng',
      dataIndex: 'hl',
    },
    {
        title: 'Không hài lòng',
        dataIndex: 'khl',
    },
    {
        title: 'Sai số',
        dataIndex: 'ss',
    },{
      title: 'Tổng BN',
      dataIndex: 'tong',
  }
]; 
    const onChange = (date, dateString) => {
      //data.datacc?.length})(BH${data.datacc.filter(item=>item.dm_patientobjectid.toString()==='1').length}
      // console.log(date, dateString);
        setDateStr(dateString);
    };   
    const handleData = (datafil) => {
        console.log(datafil);
      //data.datacc?.length})(BH${data.datacc.filter(item=>item.dm_patientobjectid.toString()==='1').length}
      // console.log(date, dateString);
        // setDateStr(dateString);
    };   
    //.filter(item=> item.roomid_out!==1001) 
    const getTitle = (items) => {
      console.log(items);
      let all =0;    
      for (let item of items) {
        all+=item.tong;
        console.log("tessttt>",item.tong);        
      }
      return all.toString();
    };
    return (
        <>         
           <Modal
           key={"dfd"}
            title="Danh sách Báo cáo CSKH khoa chi tiết+Chart"
            style={{
              top: 30
            }}
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            loading={loading}
            width={1000}           
          >
          <div className="p-4" key={"chartkhoa"}>
              <Table
                                rowKey={"roomid"}
                                bordered
                                dataSource={data} columns={columns_nt}     
                               
                                key="cskhk3hlxx"                                        
                            />  ,
              <div className="w-full h-96" key={"chat11"}>
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300} key={"ress"}>
                <BarChart key={"barddd"} data={ data.filter(item=> item.roomid!==1001)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ksm" fill="#8884d8" barSize={50} />
                  <Bar dataKey="hl" fill="#82ca9d" barSize={50} />
                  <Bar dataKey="khl" fill="#ffc658" barSize={50} />
                </BarChart>
              </ResponsiveContainer>
              </div>
            </div>                 
          </Modal>
        </>
      );
};
export default ModelbcCskhchitiet;