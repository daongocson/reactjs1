import { useLocation, useParams } from "react-router";
import React, { useEffect, useState } from "react";
import { postkqclsApi } from "../util/api";
// import { Card, notification, Button, Modal, Table, Typography,Space  } from "antd";
import { Card, notification, Button, Modal, Table, Typography, Space, Carousel, Row } from "antd";

// import { CheckCircleOutlined, FieldTimeOutlined, FileProtectOutlined } from "@ant-design/icons";
import { CheckCircleOutlined, FieldTimeOutlined, FileProtectOutlined, FileImageTwoTone } from "@ant-design/icons";


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
        // Gộp dữ liệu từ dataXN và dataDV
        const combinedData = [...res.dataXN, ...res.dataDV];

        // Tính số lượng DV đã có kết quả và chưa có kết quả
        const countHasResult = combinedData.filter(
          (item) => item.idcon === 0 && item.dm_servicedatastatusid === 3
        ).length;

        const countNoResult = combinedData.filter(
          (item) => item.idcon === 0 && item.dm_servicedatastatusid !== 3
        ).length;

        // Cập nhật state
        setCountHasResult(countHasResult);
        setCountNoResult(countNoResult);

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
  const Banner1 = () => {
    const images = [
      "/images/banner1.jpg",
      "/images/banner2.jpg",
      "/images/banner3.jpg",
      "/images/banner4.jpg",
    ];

    return (
      <div style={{ marginBottom: "20px" }}>
        <Carousel autoplay autoplaySpeed={3000}>
          {images.map((img, index) => (
            <div key={index}>
              <img
                src={img}
                alt={`Banner1 ${index + 1}`}
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </Carousel>
      </div>
    );
  };

  return (
    <>
      <div style={{ marginBottom: "20px", width: isDesktop ? "1317px" : "100%", margin: isDesktop ? "0 auto" : "0", }}>
        <Carousel autoplay autoplaySpeed={3000}>
          {images.map((img, index) => (
            <div key={index}>
              <img
                src={img}
                alt={`Banner1 ${index + 1}`}
                style={{
                  width: isDesktop ? "1317px" : "100%",
                  height: isDesktop ? "500px" : "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </Carousel>
      </div>
      <div style={{
        width: isDesktop ? "1317px" : "100%",
        margin: isDesktop ? "0 auto" : "0",
        textAlign: 'center',
        backgroundColor: '#02A6A1',
        color: 'white',
        fontSize: '12.5px',
        padding: '10px 0'
      }}>
        BỆNH VIỆN ĐA KHOA MINH AN <br />
        XIN GỬI TỚI QUÝ KHÁCH HÀNG KẾT QUẢ KHÁM CHỮA BỆNH
      </div>
      <Row
        style={{
          width: isDesktop ? "1317px" : "100%", // 1317px
          margin: isDesktop ? "0 auto" : "0", // Căn giữa trên desktop
          marginTop: "1px",
          backgroundColor: "#f5f5f5",
          textAlign: "left", // Căn trái
          border: "1px solid #ddd", // Tạo viền cho div nếu cần
          borderRadius: "5px", // Bo góc cho div nếu cần
          padding: "10px", // Thêm padding cho div
        }}
      >
        <div>
          <h2 style={{ marginBottom: "-13px" }}>{`${dataKH[0]?.value || "N/A"}: ${idDecoded}`}</h2>
          <h4 style={{ marginBottom: "-13px" }}>{dataKH[2]?.name}: {dataKH[2]?.value}</h4>
          <h4 style={{ marginBottom: "-13px" }}>{dataKH[3]?.name}: {dataKH[3]?.value}</h4>
          <h4 style={{ marginBottom: "-13px" }}>{dataKH[5]?.name}: {dataKH[5]?.value}</h4>
          <h4 style={{ marginBottom: "1px" }}> {dataKH[7]?.name}: {dataKH[7]?.value === "01/01/0001 00:00" ? "ĐANG ĐIỀU TRỊ" : dataKH[7]?.value}
          </h4>

        </div>
      </Row>

      <Row
        style={{
          width: isDesktop ? "1317px" : "100%", // 1317px
          margin: isDesktop ? "0 auto" : "0", // Căn giữa trên desktop
          marginTop: "1px",
          backgroundColor: "#f5f5f5",
          textAlign: "left", // Căn trái
          border: "1px solid #ddd", // Tạo viền cho div nếu cần
          borderRadius: "5px", // Bo góc cho div nếu cần
          padding: "10px", // Thêm padding cho div
        }}
      >
        <div style={{ position: "relative", width: "fit-content" }}>
          <QRCodeCanvas
            id="qrcode-canvas"
            level="H"
            size={150}
            value={`${urlDomain}${location.pathname}`}
          />
          <Button
            onClick={downloadQRCode}
            style={{
              position: "absolute",
              top: "120px", // Điều chỉnh vị trí theo trục dọc
              left: "160px", // Điều chỉnh vị trí theo trục ngang
            }}
          >
            Download QR Code
          </Button>
        </div>
      </Row>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <div style={{
          width: isDesktop ? "655px" : "100%",
          height: "70px",
          backgroundColor: '#02A6A1',
          color: 'white',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: isDesktop ? '20px' : '17px',
        }}>
          <div>DV ĐÃ CÓ KẾT QUẢ</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{countHasResult}</div>
        </div>

        <div style={{
          width: isDesktop ? "655px" : "100%",
          height: "70px",
          backgroundColor: '#02A6A1',
          color: 'white',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: isDesktop ? '20px' : '17px',
        }}>
          <div>DV CHƯA CÓ KẾT QUẢ</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{countNoResult}</div>
        </div>
      </div>

      {dataDV.map((item, i) => (
        <Card
          key={i}
          bordered={false}
          style={{
            width: isDesktop ? "1317px" : "100%",
            margin: isDesktop ? "0 auto" : "0",
            textAlign: "left",
            backgroundColor: "#f5f5f5",
            overflow: "visible", // Đảm bảo hiển thị phần tam giác
            marginBottom: isDesktop ? "-40px" : "-35px",
          }}
        >
          <div style={{ position: "relative", overflow: "visible" }}>
            {/* Tiêu đề */}
            <div
              style={{
                width: isDesktop ? "650px" : "100%",
                backgroundColor: "#02A6A1", // Màu nền xanh
                color: "white",
                fontWeight: "bold",
                fontSize: "20px",
                padding: isDesktop ? "5px 20px" : "5px 10px",
                borderRadius: "8px 8px 0 0", // Bo góc trên
              }}
            >
              {item.name}
            </div>
            {/* Phần tam giác nhọn */}
            <div
              style={{
                width: isDesktop ? "0" : "100%",
                position: "absolute",
                right: isDesktop ? "580px" : "-20px", // Canh phải của container
                width: "0", // Không cần chiều rộng
                height: "0", // Không cần chiều cao
                borderStyle: "solid",
                borderWidth: "20px 35px 0 15px", // Đáy tam giác nằm phía trên, đỉnh hướng xuống
                borderColor: "#02A6A1 transparent transparent transparent", // Màu tam giác ở cạnh trên
              }}
            ></div>
          </div>
          {/* Nội dung bên dưới */}
          <p>
            <FieldTimeOutlined /> Thời gian Chỉ định: {item.tgyl}
          </p>
          <p>
            <FieldTimeOutlined /> Thời gian kết quả: {item.tgkq}
          </p>
          <p>
            <CheckCircleOutlined /> Kết quả: {item.data_value}
          </p>
          {/* Điều kiện hiển thị "Xem chi tiết" */}
          {item.dm_servicesubgroupid === 401 ||
            item.dm_servicesubgroupid === 407 ||
            item.dm_servicesubgroupid === 406 ? (
            <p>
              <FileImageTwoTone style={{ fontSize: "20px" }} />{" "}
              <a
                href={`http://103.237.144.134:3782/viewImgsH?ris_exam_id=${item.treatmentid}&service_id=${item.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Xem chi tiết
              </a>
            </p>
          ) : null}
        </Card>
      ))}

      <Card bordered={false}
        style={{ margin: isDesktop ? "0 auto" : "0", padding: "0px" }}>
        <div
          style={{
            width: isDesktop ? "1317px" : "100%",
            margin: isDesktop ? "0 auto" : "0",
            textAlign: "left",
            backgroundColor: "#f5f5f5",
            overflow: "visible", // Đảm bảo hiển thị phần tam giác
            marginBottom: "0px",
            paddingBottom: isDesktop ? "0" : "10px",
          }}
        >
          <div style={{ position: "relative", overflow: "visible" }}>
            {/* Tiêu đề */}
            <div
              style={{
                width: isDesktop ? "650px" : "100%",
                backgroundColor: "#02A6A1", // Màu nền xanh
                color: "white",
                fontWeight: "bold",
                fontSize: "20px",
                padding: isDesktop ? "5px 20px" : "5px 10px",
                borderRadius: "8px 8px 0 0", // Bo góc trên
                marginLeft: isDesktop ? "20px" : "-5px", // Thụt lề vào một chút
              }}
            >
              Kết quả Xét nghiệm
            </div>
            {/* Phần tam giác nhọn */}
            <div
              style={{
                position: "absolute",
                right: isDesktop ? "606px" : "-15px", // Canh phải của container
                width: "0", // Không cần chiều rộng
                height: "0", // Không cần chiều cao
                borderStyle: "solid",
                borderWidth: "20px 35px 0 15px", // Đáy tam giác nằm phía trên, đỉnh hướng xuống
                borderColor: "#02A6A1 transparent transparent transparent", // Màu tam giác ở cạnh trên
                top: "41px", // Điều chỉnh vị trí theo trục dọc
              }}
            ></div>
          </div>
          {groupResultsByTreatment(dataXN).map((treatmentGroup, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                // gap: "0px", // Tạo khoảng cách giữa các phần
                padding: isDesktop ? "10px 20px" : "10px",
                // borderBottom: "1px solid #ddd", // Đường kẻ giữa các mục
                marginBottom: "-20px", // Khoảng cách giữa các mục (nếu cần)
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
        </div>
      </Card>

      <div
        style={{
          display: 'flex',
          width: isDesktop ? "1317px" : "100%",
          margin: isDesktop ? "0 auto" : "0",
          justifyContent: 'space-between', // Đặt khoảng cách đều giữa các nút
          marginBottom: "100px",
        }}
      >
        <Button
          style={{
            flex: '1', // Để hai nút có kích thước bằng nhau
            height: "70px",
            backgroundColor: '#02A6A1',
            color: 'white',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: isDesktop ? '20px' : '17px',
          }}
          onClick={() => {
            window.open('https://zalo.me/s/3491350673285432173/', '_blank'); // Mở liên kết trong tab mới
          }}
        >
          <div>ĐẶT LỊCH KHÁM</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}></div>
        </Button>

        {/* <Button
          style={{
            flex: '1', // Để hai nút có kích thước bằng nhau
            height: "70px",
            backgroundColor: '#02A6A1',
            color: 'white',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: isDesktop ? '20px' : '17px',
          }}
          onClick={() => {
            window.open('https://www.facebook.com/messages/t/1157731030938895', '_blank'); // Mở liên kết trong tab mới
          }}
        >
          <div>ĐẶT CÂU HỎI NHANH</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}></div>
        </Button> */}
        <Button
          style={{
            flex: '1', // Để hai nút có kích thước bằng nhau
            height: "70px",
            backgroundColor: '#02A6A1',
            color: 'white',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? '17px' : '20px', // Điều chỉnh font size theo thiết bị
          }}
          onClick={() => {
            const isDesktop = !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // Kiểm tra thiết bị
            if (isDesktop) {
              // Mở Web Messenger
              window.open('https://www.facebook.com/messages/t/1157731030938895', '_blank');
            } else {
              // Thử mở app Messenger, nếu không được thì fallback sang trình duyệt
              const messengerAppURL = 'fb-messenger://user-thread/1157731030938895';

              // Tạo một thẻ <a> ẩn để thử mở app Messenger
              const link = document.createElement('a');
              link.href = messengerAppURL;
              document.body.appendChild(link);
              link.click();

              // Fallback sau 2 giây nếu app không phản hồi
              setTimeout(() => {
                window.open('https://www.facebook.com/messages/t/1157731030938895', '_blank');
              }, 2000);
            }
          }}
        >
          <div>ĐẶT CÂU HỎI NHANH</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}></div>
        </Button>
      </div>
      <Modal
        title="Chi tiết kết quả xét nghiệm"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
      >
        <Table
          dataSource={groupResultsByParent(selectedXN)}  // Đảm bảo function này được định nghĩa đúng
          columns={columns}  // Đảm bảo biến columns đã được định nghĩa đúng
          pagination={false}
          bordered
          expandable={{
            defaultExpandAllRows: true,
          }}
        />
      </Modal>
    </>
  );
}
