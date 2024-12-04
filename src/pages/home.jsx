import { CrownOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import { useEffect } from 'react';

const HomePage = () => {
   
    const GetComputerName =()=> {
        try {
            const userAgent = window.navigator.userAgent;
            const platform = "";//window.navigator.platform;
            const randomString = "";//Math.random().toString(20).substring(2, 14) + Math.random().toString(20).substring(2, 14);
            console.log(">>>",window.location.hostname,userAgent);
            return window.location.hostname+userAgent;
        }
        catch (e) { return "exception"+e}
    }
    useEffect(() => {     
        console.log(">>>>homepage"+GetComputerName());        
    })
    
    return (
        <div >
            <Result
                icon={<CrownOutlined />}
                title="Hệ thống check lỗi, Chấm công tự động- BV MINHAN-40576"
            >
           
              <div >
                <b>HƯỚNG DẪN TẠO YC SỬA HỒ SƠ</b>                      
                <ul >
                    <li><b>Bước 1:</b> &#8594; Tra cứu bệnh nhân &#8594; Nhập mã bệnh nhân VD "562753"  &#8594; Báo sửa hồ sơ  </li>
                    <li><b>Bước 2:</b> &#8594; Xem YC hồ sơ=&gt; Xem trạng thái hồ sơ, đang ở KHTH hay IT,đã xử lý xong  </li>                  
                </ul>
            </div> 
                </Result>
        </div>
      
    )
}

export default HomePage;