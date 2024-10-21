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
        <div style={{ padding: 20 }}>
            <Result
                icon={<CrownOutlined />}
                title="Hệ thống check lỗi, Chấm công tự động- BV MINHAN"
            />
        </div>
    )
}

export default HomePage;