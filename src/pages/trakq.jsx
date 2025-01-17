import { useLocation, useParams } from "react-router";
import React, { useEffect, useState } from "react";
import { postkqclsApi } from "../util/api";
import { Card, notification, Button, Modal, Table, Typography, Space, Carousel, Row } from "antd";
import { CheckCircleOutlined, FieldTimeOutlined, FileProtectOutlined, FileImageTwoTone } from "@ant-design/icons";
import { QRCodeCanvas } from "qrcode.react";
import banner1 from "../assets/images/banner1.jpg";
import banner2 from "../assets/images/banner2.jpg";
import banner3 from "../assets/images/banner3.jpg";
import banner4 from "../assets/images/banner4.jpg";
import { useMediaQuery } from 'react-responsive';
import Footer from "../components/module/Footer";
import '../styles/trakq.css';


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

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [dataKH, setDataKH] = useState([]);
  const [dataXN, setDataXN] = useState([]);
  const [dataDV, setDataDV] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedXN, setSelectedXN] = useState([]);
  const [countHasResult, setCountHasResult] = useState(0);
  const [countNoResult, setCountNoResult] = useState(0);
  const [gender, setGender] = useState([]);

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
        // Lưu dữ liệu vào state
        setDataKH(res.dataKH);
        setDataXN(res.dataXN);
        setDataDV(res.dataDV);
        // Gộp dữ liệu từ dataXN và dataDV
        const gender = res.dataKH.find(item => item.id === "11")?.gender || "Không tìm thấy thông tin giới tính.";
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
        setGender(gender);
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
        description: "Failed to fetch data. Please try again later.",
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
          tgyl: item.tgyl,
          tgkq: item.tgkq,
          children: [],
        };
      }

      treatmentMap[item.treatmentid].children.push(item);
    });

    return Object.values(treatmentMap);
  };

  const getNormalValue = (normal, gender) => {
    // Tách chuỗi thành mảng các phần Nam, Nữ hoặc giá trị chung
    const normalValues = normal.split(/\r?\n|\s+/).map(item => item.trim()); // Loại bỏ dấu cách và xuống dòng
    // Tạo một biến lưu giá trị kết hợp Nam và giá trị sau đó
    let result = '';

    for (let i = 0; i < normalValues.length; i++) {
      // Kiểm tra nếu phần tử hiện tại chứa giới tính
      if (normalValues[i].includes(gender)) {
        // Kiểm tra phần tử tiếp theo để lấy giá trị sau dấu ":"
        if (normalValues[i + 1]) {
          result = normalValues[i] + normalValues[i + 1].replace(';', ''); // Ghép "Nam:" với "62-120"
        }
      }
    }

    // Nếu có kết quả, tách giá trị sau dấu ":"
    if (result) {
      return result.split(':')[1].trim(); // Trả về giá trị sau dấu ":"
    } else {
      // Nếu không có thông tin giới tính, trả về toàn bộ giá trị chung
      return normalValues.join(' ');
    }
  };

  const columns = [
    {
      title: "Tên xét nghiệm",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        const color = getColor(record, "result"); // Lấy màu từ hàm getColor
        return <span style={{ color }}>{text}</span>;
      },
    },
    {
      title: "Kết quả",
      dataIndex: "result",
      key: "result",
      render: (text, record) => {
        const color = getColor(record, "result"); // Lấy màu từ hàm getColor
        return <span style={{ color }}>{text}</span>;
      },
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
      render: (text, record) => {
        const color = getColor(record, "result"); // Lấy màu từ hàm getColor
        return <span style={{ color }}>{text}</span>;
      },
    },
    {
      title: "Bình thường",
      dataIndex: "normal",
      key: "normal",
      render: (text, record) => {
        const normalRange = getNormalValue(record.normal, gender);
        const color = getColor(record, "result"); // Lấy màu từ hàm getColor
        return <span style={{ color }}>{normalRange}</span>;
      },
    },
  ];
  // Hàm getColor để xác định màu sắc dựa trên giá trị của cột "Kết quả"
  const getColor = (record, field) => {
    const normalRange = getNormalValue(record.normal, gender);
    const value = record[field]; // Giá trị của trường cần kiểm tra (ví dụ "result")

    if (!normalRange || normalRange === "N/A") {
      return "black";
    }

    const rangeParts = normalRange.split("-");
    if (rangeParts.length === 2) {
      const [min, max] = rangeParts.map(Number);
      const parsedValue = parseFloat(value);

      if (!isNaN(parsedValue) && !isNaN(min) && !isNaN(max)) {
        if (parsedValue < min) return "blue";
        if (parsedValue > max) return "red";
        return "black";
      }
    }
    return "black";
  };
  const Banner1 = () => {
    const images = [
      "/images/banner1.jpg",
      "/images/banner2.jpg",
      "/images/banner3.jpg",
      "/images/banner4.jpg",
    ];

    return (
      <div className={`banner`}>
        <Carousel autoplay autoplaySpeed={2500}>
          {images.map((img, index) => (
            <div key={index}>
              <img
                src={img}
                alt={`Banner1 ${index + 1}`}
                className={`banner-img`}
              />
            </div>
          ))}
        </Carousel>
      </div>
    );
  };

  return (
    <>
      <div className="banner">
        <Carousel autoplay autoplaySpeed={2500}>
          {images.map((img, index) => (
            <div key={index}>
              <img
                src={img}
                alt={`Banner1 ${index + 1}`}
                className={`banner-img`}
              />
            </div>
          ))}
        </Carousel>
      </div>
      <div className={`slogan`}>
        BỆNH VIỆN ĐA KHOA MINH AN <br />
        XIN GỬI TỚI QUÝ KHÁCH HÀNG KẾT QUẢ KHÁM CHỮA BỆNH
      </div>
      <Row className={`info ${isDesktop ? 'desktop' : ''}`}>
        <div>
          {dataKH.map((item) => (
            <div key={item.id}>
              {item.id === "1" && (<h2 style={{ marginBottom: "-13px" }}>{item.value || "N/A"}: {idDecoded}</h2>)}
              {item.id === "3" && (<h4 style={{ marginBottom: "-13px" }}>{item.name}: {item.value || "N/A"}</h4>)}
              {item.id === "11" && (<h4 style={{ marginBottom: "-13px" }}>{item.name}: {item.gender || "N/A"}</h4>)}
              {item.id === "5" && (<h4 style={{ marginBottom: "-13px" }}>{item.name}: {item.value || "N/A"}</h4>)}
              {item.id === "7" && (<h4 style={{ marginBottom: "1px" }}>{item.name}: {item.value === "01/01/0001 00:00" ? "ĐANG ĐIỀU TRỊ" : item.value}</h4>)}
              {item.id === "9" && (<h4 style={{ marginBottom: "-13px" }}>{item.name}: {item.value || "N/A"}</h4>)}
            </div>
          ))}
        </div>
      </Row>

      <Row className={`qr-code ${isDesktop ? 'desktop' : ''}`}>
        <div style={{ position: "relative", width: "fit-content" }}>
          <QRCodeCanvas
            id="qrcode-canvas"
            level="H"
            size={150}
            value={`${urlDomain}${location.pathname}`}
          />
          <Button
            onClick={downloadQRCode}
            className={`qr-down`}
          >
            Download QR Code
          </Button>
        </div>
      </Row>

      <div className="trakq-box-container">
        <div className={`trakq-result-box ${isDesktop ? '' : 'mobile'}`}>
          <div>DV ĐÃ CÓ KẾT QUẢ</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{countHasResult}</div>
        </div>

        <div className={`trakq-result-box ${isDesktop ? '' : 'mobile'}`}>
          <div>DV CHƯA CÓ KẾT QUẢ</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{countNoResult}</div>
        </div>
      </div>

      {dataDV.map((item, i) => (
        <Card
          key={i} bordered={false}
          className={`trakq-dv-card ${isDesktop ? '' : 'mobile'}`}
        >
          <div className="trakq-dv-container">
            <div className={`trakq-dv-header ${isDesktop ? '' : 'mobile'}`}>
              {item.name}
            </div>
            <div className={`trakq-dv-triangle ${isDesktop ? '' : 'mobile'}`}></div>
          </div>
          <p className={`trakq-time-text ${isDesktop ? '' : 'mobile'}`}>
            <FieldTimeOutlined style={{color: "#02A6A1" }} /> Thời gian Chỉ định: {item.tgyl}
          </p>
          <p className={`trakq-time-text ${isDesktop ? '' : 'mobile'}`}>
            <FieldTimeOutlined style={{ color: "#02A6A1" }} /> Thời gian kết quả: {item.tgkq}
          </p>
          <p className={`trakq-time-text ${isDesktop ? '' : 'mobile'}`}>
            <CheckCircleOutlined style={{ color: "#02A6A1" }} /> Kết quả: <b>{item.data_value}</b>
          </p>
          {/* Điều kiện hiển thị "Xem chi tiết" */}
          {item.dm_servicesubgroupid === 401 ||
            item.dm_servicesubgroupid === 407 ||
            item.dm_servicesubgroupid === 406 ? (
              <p className={`trakq-time-text ${isDesktop ? '' : 'mobile'}`}>
              <FileImageTwoTone style={{ fontSize: "20px" }} />{" "}
              <a
                href={`http://103.237.144.134:3782/viewImgsH?ris_exam_id=${item.treatmentid}&service_id=${item.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "20px", fontWeight: "bold", }}
              >
                Xem chi tiết
              </a>
            </p>
          ) : null}
        </Card>
      ))}
      {groupResultsByTreatment(dataXN).length > 0 && (
        <Card bordered={false}
          style={{ margin: isDesktop ? "0 auto" : "0", padding: "0px" }}
        >
          <div className={`trakq-treatment-container ${isDesktop ? '' : 'mobile'}`}>
            <div className="trakq-treatment-header">
              <div className={`trakq-treatment-title ${isDesktop ? '' : 'mobile'}`}>
                Kết quả Xét nghiệm
              </div>
              <div className={`trakq-treatment-triangle ${isDesktop ? '' : 'mobile'}`}></div>
            </div>
            <div>
              {groupResultsByTreatment(dataXN).map((treatmentGroup, index) => (
                <div
                  key={index}
                  className={`trakq-treatment-item ${isDesktop ? '' : 'mobile'}`}
                >
                  <div>
                    <p>
                      <FieldTimeOutlined style={{ color: "#02A6A1" }} /> Thời gian Chỉ định: {treatmentGroup.tgyl}
                    </p>
                    <p>
                      <FieldTimeOutlined style={{ color: "#02A6A1" }} /> Thời gian Kết quả: {treatmentGroup.tgkq}
                    </p>
                  </div>

                  <Button
                    type="primary"
                    onClick={() => {
                      setSelectedXN(treatmentGroup.children);
                      setIsModalVisible(true);
                    }}
                    style={{ marginRight: "-20px"}}
                  >
                    Xem Kết Quả
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      <div className={`trakq-buttons-container ${isDesktop ? 'desktop' : ''}`}>
        <Button
          className={`trakq-button ${isDesktop ? 'desktop' : ''}`}
          onClick={() => {
            window.open('https://zalo.me/s/3491350673285432173/', '_blank'); // Mở liên kết trong tab mới
          }}
        >
          <div>ĐẶT LỊCH KHÁM</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}></div>
        </Button>

        <Button
          className={`trakq-button ${isDesktop ? 'desktop' : ''}`}
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
      <Footer />
    </>
  );
}
