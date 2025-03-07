import {Modal,Table, Tabs} from 'antd';
function ModelbcNgoaitruchitiet(props) {
    const{open,setOpen,data,loading}=props;    
  const columns_nt = [
    {
        title: 'Mã VP',
        dataIndex: 'patientrecordid',
    },
    {
        title: 'Thời gian',
        dataIndex: 'tgkham',
    }
]; 
    const onChange = (date, dateString) => {
      //data.datacc?.length})(BH${data.datacc.filter(item=>item.dm_patientobjectid.toString()==='1').length}
      // console.log(date, dateString);
        setDateStr(dateString);
    };    
    const getTitle = (items) => {    
      if (items?.length > 0) {
        let bh = items.filter(item=>item.dm_patientobjectid.toString()==='1')
        let vp = items.filter(item=>item.dm_patientobjectid.toString()==='2')
        return ""+items?.length+"(BH:"+bh.length+" "+"VP:"+vp.length+")";
      } else {
        return "(0)";
      }
    };
    return (
        <>         
           <Modal
            title="Danh sách bệnh nhân chi tiết"
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
                        label: `BN Khám Cấp cứu`,
                        key: 'ctbncapcuu',
                        children: [ 
                          <strong key={"ctcctext"}>Tổng: {getTitle(data.datacc)}</strong>,                           
                            <Table   
                              rowKey={"patientrecordid"}                    
                              bordered
                              dataSource={data.datacc} columns={columns_nt}                       
                              key="cttbyhct"                          
                            /> ,
                            'Số lượng: '+ data.datacc?.length                     
                        ]
                    },
                    {
                        label: `CT Cấp cứu `,
                        key: 'ctbnchuyentuyencc',
                        children: [   
                            <strong key={"ctcctext1"}>Tổng: {getTitle(data.dataChuyentuyencc)}</strong>,                             
                            <Table   
                              rowKey={"patientrecordid"}                    
                              bordered
                              dataSource={data.dataChuyentuyencc} columns={columns_nt}                       
                              key="cttbchuyentuyen"                           
                            /> ,
                            'Số lượng: '+data.dataChuyentuyencc?.length                    
                        ]
                    },
                    {
                        label: `CT Khám bệnh`,
                        key: 'ctbnchuyentuyen',
                        children: [ 
                            <strong  key={"ctcctext2"}>Tổng: {getTitle(data.dataChuyentuyen)}</strong>, 
                            <Table   
                              rowKey={"patientrecordid"}                    
                              bordered
                              dataSource={data.dataChuyentuyen} columns={columns_nt}                       
                              key="cttbchuyentuyen"                           
                            /> ,
                            'Số lượng: '+ data.dataChuyentuyen?.length                    
                        ]
                    },{
                      label: `BN Khám bệnh`,
                      key: 'ctbnkham',
                      children: [ 
                          <strong  key={"ctcctext3"}>Tổng: {getTitle(data.dataKham)}</strong>, 
                          <Table   
                          rowKey={"patientrecordid"}                    
                          bordered
                          dataSource={data.dataKham} columns={columns_nt}                       
                          key="tbchuyentuyen"                           
                          /> ,
                          'Số lượng: '+ data.dataKham?.length                    
                      ]
                  }
                  ]}
              />           
          </Modal>
        </>
      );
};
export default ModelbcNgoaitruchitiet;