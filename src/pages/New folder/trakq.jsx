import { useLocation, useParams } from "react-router";
import React, { useEffect, useState } from "react";
import { postkqclsApi } from "../util/api";
import { Card, notification, Button, Modal, Table, Typography,Space  } from "antd";
import { CheckCircleOutlined, FieldTimeOutlined, FileProtectOutlined } from "@ant-design/icons";
import { QRCodeCanvas } from "qrcode.react";
import banner1 from "../assets/images/banner1.jpg";
import banner2 from "../assets/images/banner2.jpg";
import banner3 from "../assets/images/banner3.jpg";
import banner4 from "../assets/images/banner4.jpg";

import { useMediaQuery } from 'react-responsive';

export default function TrakqPage() {
  const { id } = useParams();
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener when component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [dataKH, setDataKH] = useState([]);
  const [dataXN, setDataXN] = useState([]);
  const [dataDV, setDataDV] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedXN, setSelectedXN] = useState([]);
  const [countHasResult, setCountHasResult] = useState(0);
  const [countNoResult, setCountNoResult] = useState(0);
  const images = [banner1, banner2, banner3, banner4];
  const idDecoded = atob(id);
  const urlDomain = "https://traketqua.benhvienminhan.com/";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await postkqclsApi(id);
      if (!res?.message) {
        setDataKH(res.dataKH);
        setDataXN(res.dataXN);
        setDataDV(res.dataDV);
      } else {
        notification.error({
          message: "Unauthorized",
          description: res.message,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch data. Please try again later."
      });
    }
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector("#qrcode-canvas");
    if (!canvas) {
      notification.error({
        message: "Error",
        description: "QR Code canvas not found."
      });
      return;
    }

    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${dataKH[0]?.value || "QRCode"}-QR-code.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const groupResultsByParent = (data) => {
    const resultMap = {};
  
    data.forEach((item) => {
      if (item.idcon === 0) {
        // Là chỉ số cha
        if (!resultMap[item.id]) {
          resultMap[item.id] = {
            ...item,
            children: [],
          };
        } else {
          resultMap[item.id] = {
            ...resultMap[item.id],
            ...item,
          };
        }
      } else {
        // Là chỉ số con
        if (!resultMap[item.idcon]) {
          resultMap[item.idcon] = {
            id: item.idcon,
            name: "Chỉ số cha chưa xác định",
            data_value: null,
            donvi: null,
            binhthuong: null,
            children: [],
          };
        }
        resultMap[item.idcon].children.push(item);
      }
    });
  
    // Đảm bảo các trường "result", "unit", và "normal" luôn tồn tại
    return Object.values(resultMap).map((parent) => ({
      ...parent,
      result: parent.children.length === 0 ? parent.data_value || "N/A" : "",
      unit: parent.children.length === 0 ? parent.donvi || "N/A" : "",
      normal: parent.children.length === 0 ? parent.binhthuong || "N/A" : "",
      children: parent.children.map((child) => ({
        ...child,
        result: child.data_value,
        unit: child.donvi || "N/A",
        normal: child.binhthuong || "N/A",
      })),
    }));
  };
  
  
  const groupResultsByTreatment = (data) => {
    const treatmentMap = {};
  
    data.forEach((item) => {
      if (!treatmentMap[item.treatmentid]) {
        treatmentMap[item.treatmentid] = {
          treatmentid: item.treatmentid,
          tgyl: item.tgyl, // Thời gian chỉ định
          tgkq: item.tgkq, // Thời gian kết quả
          children: [],
        };
      }
  
      treatmentMap[item.treatmentid].children.push(item);
    });
  
    return Object.values(treatmentMap);
  };

  const columns = [
    {
      title: "Tên xét nghiệm",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        const normalRange = record.normal;
        const color = getColor(record, "result"); // Lấy màu từ hàm getColor
        return <span style={{ color }}>{text}</span>;
      },
    },
    {
      title: "Kết quả",
      dataIndex: "result",
      key: "result",
      render: (text, record) => {
        const normalRange = record.normal;
        const color = getColor(record, "result"); // Lấy màu từ hàm getColor
        return <span style={{ color }}>{text}</span>;
      },
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
      render: (text, record) => {
        const normalRange = record.normal;
        const color = getColor(record, "result"); // Lấy màu từ hàm getColor
        return <span style={{ color }}>{text}</span>;
      },      
    },
    {
      title: "Bình thường",
      dataIndex: "normal",
      key: "normal",
      render: (text, record) => {
        const normalRange = record.normal;
        const color = getColor(record, "result"); // Lấy màu từ hàm getColor
        return <span style={{ color }}>{text}</span>;
      },
    },
  ];
  // Hàm getColor để xác định màu sắc dựa trên giá trị của cột "Kết quả"
const getColor = (record, field) => {
  const normalRange = record.normal;
  const value = record[field]; // Giá trị của trường cần kiểm tra (ví dụ "result")
  
  if (!normalRange || normalRange === "N/A") {
    return "black"; // Nếu không có phạm vi bình thường, trả về màu đen
  }

  const rangeParts = normalRange.split("-");
  if (rangeParts.length === 2) {
    const [min, max] = rangeParts.map(Number);
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && !isNaN(min) && !isNaN(max)) {
      if (parsedValue < min) return "blue"; // Màu xanh khi giá trị nhỏ hơn mức bình thường
      if (parsedValue > max) return "red"; // Màu đỏ khi giá trị lớn hơn mức bình thường
      return "black"; // Màu xanh nhạt khi giá trị trong phạm vi bình thường
    }
  }

  return "black"; // Mặc định là màu đen nếu không có điều kiện nào khớp
};
  
  return (
    <>
      <Card
        title={`${dataKH[0]?.value || "N/A"}: ${idDecoded}`}
        bordered={false}
        style={{ width: "100%", margin: 10, backgroundColor: "#f5f5f5" }}
      >
        <ul>
          <li>{dataKH[2]?.name}: {dataKH[2]?.value}</li>
          <li>{dataKH[3]?.name}: {dataKH[3]?.value}</li>
          <li>{dataKH[7]?.name}: {dataKH[7]?.value}</li>
        </ul>
        <div>
          <QRCodeCanvas id="qrcode-canvas" level="H" size={150} value={`${urlDomain}${location.pathname}`} />
          <Button onClick={downloadQRCode} style={{ marginTop: 10 }}>Download QR Code</Button>
        </div>
      </Card>

      {dataDV.map((item, i) => (
        <Card
          key={i}
          title={item.name}
          bordered={false}
          style={{ width: "100%", backgroundColor: "#f5f5f5", margin: 10 }}
        >
          <p><FieldTimeOutlined /> Thời gian Chỉ định: {item.tgyl}</p>
          <p><FieldTimeOutlined /> Thời gian kết quả: {item.tgkq}</p>
          <p><CheckCircleOutlined /> Kết quả: {item.data_value}</p>
          <p>
            <FileProtectOutlined /> <a href={`http://103.237.144.134:3782/viewImgsH?ris_exam_id=${item.treatmentid}&service_id=${item.id}`} target="_blank" rel="noopener noreferrer">Xem chi tiết</a>
          </p>
        </Card>
      ))}
  <Card
  title="Kết quả Xét nghiệm"
  bordered={false}
  style={{ width: "100%", margin: 10, backgroundColor: "#f5f5f5" }}
>
  {groupResultsByTreatment(dataXN).map((treatmentGroup, index) => (
    <div
      key={index}
      style={{
        display: "flex",
        // display: "inline-flex",
        // justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "15px",
      }}
    >
      <div>
        <p>
          <FieldTimeOutlined /> Thời gian Chỉ định: {treatmentGroup.tgyl}
        </p>
        <p>
          <FieldTimeOutlined /> Thời gian Kết quả: {treatmentGroup.tgkq}
        </p>
      </div>
      <Button
        type="primary"
        onClick={() => {
          setSelectedXN(treatmentGroup.children); // Chỉ hiển thị dữ liệu của nhóm này
          setIsModalVisible(true);
        }}
        style={{ marginLeft: "20px" }}
      >
        Xem Kết Quả
      </Button>
    </div>
  ))}
</Card>
      <Modal
        title="Chi tiết kết quả xét nghiệm"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
      >
        <Table
          dataSource={groupResultsByParent(selectedXN)}
          columns={columns}
          pagination={false}
          bordered
          expandable={{
            defaultExpandAllRows: (record) => record.children && record.children.length > 0,
          }}
        />
      </Modal>
    </>
  );
}
