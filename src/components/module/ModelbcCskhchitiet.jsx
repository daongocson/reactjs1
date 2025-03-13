import { FileExcelOutlined } from '@ant-design/icons';
import {Button, Modal,Table, Tabs} from 'antd';
import { CSVLink } from 'react-csv';
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
    const getTitle = (items) => {
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
            title="Danh sách Báo cáo CSKH khoa chi tiết"
            style={{
              top: 30
            }}
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            loading={loading}
            width={1000}           
          >
          {/* <Space.Compact> */}
          <Tabs
                    defaultActiveKey="1"
                    items={[
                    {
                        label: `Báo cáo theo phòng`,
                        key: 'ctbncapcuu',
                        children: [ 
                          <strong key={"ctcctext"}>Tổng BN Khảo sát: ({getTitle(data)})</strong>,                           
                            <Table   
                              rowKey={"roomid"}                    
                              bordered
                              dataSource={data} columns={columns_nt}                       
                              key="cttbyhct"                          
                            /> ,
                            data?.length +' Phòng, Xuất file Excel=> ',
                            <CSVLink 
                              filename={"Baocaocskh.csv"}   
                              icon={<FileExcelOutlined />}                        
                              data={data}><Button
                              icon={<FileExcelOutlined />}
                              type="default"/>
                            </CSVLink>,                    
                        ]
                    }                   
                  ]}
              />           
          </Modal>
        </>
      );
};
export default ModelbcCskhchitiet;