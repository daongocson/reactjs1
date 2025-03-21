import { Modal,Table, Tabs} from 'antd';
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
    const getTitle = (items) => {
      let all =0;    
      for (let item of items) {
        all+=item.tong;
      }
      return all.toString();
    };
  const handChitiet=(dataChitiet)=>{
      return dataChitiet.map(item => {
          if(item.roomid==1001){ 
            return {
              name:"Phòng Khám",
              ksdt:0,    
              knm:0,
              hl:0,
              khl:item.khl,
              ss:0,
              knm:0
            }
          }
          return item;
      });
      // return data;
      // handChitiet
  }
    return (
        <>         
           <Modal          
            title="Danh sách báo cáo CSKH theo khoa"
            style={{
              top: 30
            }}
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            loading={loading}
            width={1000}           
          >
          <p><strong>Tổng bệnh nhân khảo sát ({getTitle(data)})</strong></p>
          <div className="p-4" >
              <Table
                                rowKey={"roomid"}
                                bordered
                                dataSource={data} columns={columns_nt}     
                               
                                key="cskhk3hlxx"                                        
                            />  ,
              <div className="w-full h-96" key={"chat11"}>
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300} key={"ress"}>
                <BarChart data={handChitiet(data)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="knm" fill="#8884d8" barSize={50} name="Không nghe máy"  />
                  <Bar dataKey="hl" fill="#82ca9d" barSize={50}  name="Hài lòng"  />
                  <Bar dataKey="khl" fill="#ffc658" barSize={50}  name="Không hài lòng" />
                </BarChart>
              </ResponsiveContainer>
              </div>
            </div>                 
          </Modal>
        </>
      );
};
export default ModelbcCskhchitiet;