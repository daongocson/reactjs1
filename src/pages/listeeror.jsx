import { Button, Input, Modal, notification, Table } from "antd";

import { useEffect, useState,useRef } from "react";
import { getLsErrorApi } from "../util/api";
import { EyeOutlined } from "@ant-design/icons";
import Draggable from 'react-draggable';

const { Search } = Input;

const ListErorPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [disabled, setDisabled] = useState(true);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modaldata, setmodaldata] = useState([]);
    const keys  = ["TenBS","ndloi","MaKhoa","MaVP","TenDV"];    
    const [keyword, setKeyword] = useState('');
    const fetchUser = async () => {
        const res = await getLsErrorApi();
        if (!res?.message) {              
            setDataSource(res);               
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message
            })
        }
    }
    useEffect(() => {   
        fetchUser();        
    }, [])
    const onSearch = (value, _e, info) => console.log(info?.source, value);
    const [bounds, setBounds] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
      });
      const draggleRef = useRef(null);
    const columns = [
        {
            title: 'Mã VP',
            dataIndex: 'MaVP',
        },       
        {
            title: 'Nội dung lỗi',
            dataIndex: 'ndloi',
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'TenDV',
        },
        {
            title: 'Phòng',
            dataIndex: 'MaKhoa',
        },
        {
            title: 'Tên bác sĩ',
            dataIndex: 'TenBS',
        }, {
            title: 'Action',
            dataIndex: 'id',
            key: 'id',
            render: (index, record) => (
              <Button  icon={<EyeOutlined />} onClick={() => showModal(record)} />
            ),
          },

    ];   
    const showModal = (record) => {
        console.log(record);
        setmodaldata(record);
        setIsModalVisible(true);
      };
      const handleOk = () => {
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };
    const searchTable=(data)=>{      
        return data.filter(
            (item)=>(
                keys.some((key)=>item[key].toLowerCase().includes(keyword.toLowerCase())
            )));        
    }
    const onStart = (_event, uiData) => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
          return;
        }
        setBounds({
          left: -targetRect.left + uiData.x,
          right: clientWidth - (targetRect.right - uiData.x),
          top: -targetRect.top + uiData.y,
          bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    }
    return (       
        <div style={{ padding: 30 }}>      
            <div className="ant-col ant-col-xs-24 ant-col-xl-8">             
                    <Search
                    placeholder="Nhập nội dung"
                    allowClear
                    onChange={(event)=>setKeyword(event.target.value)}
                    onSearch={onSearch} enterButton 
                    style={{
                        width: "100%"                        
                    }}
                    />
                 
            </div>           
            <Table
                bordered
                dataSource={searchTable(dataSource)} columns={columns}
                defaultPageSize={30}         
                rowKey={"id"}
                pagination={{
                    defaultPageSize:"10" , 
                    defaultCurrent:"1",
                    total: dataSource.length, 
                    pageSizeOptions: ["10","50", "100", "150"],                   
                    showSizeChanger: true, locale: {items_per_page: ""} 
                   }}           
          
            />
              <Modal
                 title={
                    <div
                      style={{
                        width: '100%',
                        cursor: 'move',
                      }}
                      onMouseOver={() => {
                        if (disabled) {
                          setDisabled(false);
                        }
                      }}
                      onMouseOut={() => {
                        setDisabled(true);
                      }}
                      // fix eslintjsx-a11y/mouse-events-have-key-events
                      // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
                      onFocus={() => {}}
                      onBlur={() => {}}
                      // end
                    >
                      Draggable Modal
                    </div>
                  }
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                modalRender={(modal) => (
                    <Draggable
                      disabled={disabled}
                      bounds={bounds}
                      nodeRef={draggleRef}
                      onStart={(event, uiData) => onStart(event, uiData)}
                    >
                      <div ref={draggleRef}>{modal}</div>
                    </Draggable>
                  )}
            >
                <p>Mã VP: {modaldata.MaVP}</p>
                <p>Mã BN: {modaldata.MaBN}</p>                
                <p>{modaldata.TenBS}({modaldata.MaBS})</p>
                <p>{modaldata.TenDV}</p>
                <b>Nội dung lỗi:</b>
                <p>{modaldata.ndloi}</p>
            </Modal>
            <>Total {dataSource.length} items</>
        </div>
    )
}

export default ListErorPage;