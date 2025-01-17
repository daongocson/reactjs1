import React from "react";
import { useMediaQuery } from 'react-responsive';
import "../../styles/Footer.css";
import { SocialIcon } from "react-social-icons";

export default function Footer() {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
    const isDesktop = useMediaQuery({ minWidth: 1025 });
    return (
        <footer className={`footer-container`}>
    <div className={`footer-content`}>
    <div className={`footer-left`}>
            <img src="/logo.png" alt="Logo" className="footer-logo" />
        </div>
        <div className="footer-center">
            <p>
                <strong>Bệnh viện Đa khoa Minh An</strong> được thành lập theo giấy phép số 216/BYT-GPHD cấp ngày 28/12/2017 của Bộ Y tế <br />
            </p>
            <p><strong><em>Địa chỉ:</em></strong> Quốc lộ 1A, Quỳnh Giang, Quỳnh Lưu, Nghệ An</p>
            <p><strong><em>Thời gian làm việc:</em></strong><br />
                Thứ 2 đến Chủ nhật: 06:45 - 17:30<br />
                <strong><em>Khám BHYT:</em></strong> Thứ 2 đến Chủ nhật
            </p>
        </div>
        <div className="footer-right">
            <p><strong>Thông tin liên hệ:</strong><br />
                <strong><em>Tổng đài:</em></strong> 1900 866 823 <br />
                <strong><em>Cấp cứu:</em></strong> 0981 145 115 <br />
                <strong><em>Email:</em></strong> <a href="mailto:benhvienminhan@gmail.com">benhvienminhan@gmail.com</a>
            </p>
            <SocialIcon
                url="https://www.facebook.com/benhviendakhoaminhan"
                target="_blank"
                style={{ margin: "0 10px" }}
                title="Facebook"
            />
            <a
                href="https://zalo.me/1584841675871607263"
                target="_blank"
                rel="noopener noreferrer"
                title="Zalo"
            >
                <img
                    src="/zalo-icon.png"
                    width="50"
                    height="50"
                    alt="Zalo"
                    style={{ margin: "0 10px", marginBottom: "-20px" }}
                />
            </a>
            <SocialIcon
                url="https://www.youtube.com/@benhvienminhan5052"
                target="_blank"
                style={{ margin: "0 10px" }}
                title="YouTube"
            />
            <SocialIcon
                url="https://benhvienminhan.com/"
                target="_blank"
                style={{ margin: "0 10px" }}
                title="Website chính thức BVĐK Minh An"
            />
        </div>
    </div>
    <div className="footer-bottom">
        <p>
            Bệnh viện Đa khoa Minh An giữ bản quyền nội dung trên website này. Web trả kết quả được phát triển bởi Phòng CNTT © 2025
        </p>
    </div>
</footer>

    );
}
