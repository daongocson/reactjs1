import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = {
        name, email, password
    }

    return axios.post(URL_API, data)
}

const loginApi = (email, password,ipClient) => {    
    const URL_API = "/v1/api/login";
    const data = {
        email, password,ipClient
    }

    return axios.post(URL_API, data)
}
const postbacsiApi = (bacsi) => {
    const URL_API = "/v1/api/postbacsi";
    const data = {
        bacsi
    }
    return axios.post(URL_API, data)
}
const postDoctorApi = (bacsi) => {
    const URL_API = "/v1/api/postfilldoctor";
    const data = {
        bacsi
    }
    return axios.post(URL_API, data)
}
const postIcdApi = (bacsi) => {
    const URL_API = "/v1/api/postfillicd";
    const data = {
        bacsi
    }
    return axios.post(URL_API, data)
}
const postbaocaoIcdApi = (data) => {
    const URL_API = "/v1/api/postbaocaoicd";    
    return axios.post(URL_API, data)
}
const postbaocaodieutriApi = (data) => {
    console.log("postbaocaodieutriApi>>>",data);
    const URL_API = "/v1/api/postbaocaodieutri";    
    return axios.post(URL_API, data)
}
const createnickbsApi = (data) => {
    const URL_API = "/v1/api/createnickbs";
    return axios.post(URL_API, data)
}
const postDeleteYeucauApi = (data) => {   
    const URL_API = "/v1/api/deleteYeucau";    
    return axios.post(URL_API, data)
}
const postpatientApi = (mavp) => {
    const URL_API = "/v1/api/postpatient";
    const data = {
        mavp
    }
    return axios.post(URL_API, data)
}
const postcskhPidApi = (mavp) => {
    const URL_API = "/v1/api/postcskhpid";
    const data = {
        mavp
    }
    return axios.post(URL_API, data)
}
const postkqclsApi = (mavp) => {
    const URL_API = "/v1/api/postkqcls"
    return axios.post(URL_API, {mavp})
}
const postycsuaApi = (data) => {
    const URL_API = "/v1/api/postycsua"; 
    return axios.post(URL_API, data)
}
const fetchycbydateApi = (data) => {
    const URL_API = "/v1/api/fetchycbydate"; 
    return axios.post(URL_API, data)
}
const postduyetycApi = (data) => {
    const URL_API = "/v1/api/postduyetyc"; 
    return axios.post(URL_API, data)
}
const postChamcongIdApi = (manv) => {
    const URL_API = "/v1/api/postchamcongid";
    const data = {
        manv
    }
    return axios.post(URL_API, data)
}
const postKhambenhApi = (phongkham) => {
    const URL_API = "/v1/api/postPhongkham";
    const data = {
        phongkham
    }
    return axios.post(URL_API, data)
}
const postycbydateApi = (data) => {   
    const URL_API = "/v1/api/postycbydate";
    return axios.post(URL_API, data)
}
const getuserduyetApi = (data) => {
    const URL_API = "/v1/api/getuserduyet";
    return axios.post(URL_API, data)
}
const getbnBynv =(tungay, denngay, nhanvien) => {
    const URL_API = "/v1/api/getbncskh";
    const data = {
        tungay, denngay, nhanvien
    }
    return axios.post(URL_API, data)
}
const postkqGoiApi =(data) => {
    const URL_API = "/v1/api/postkqgoi";   
    return axios.post(URL_API, data)
}
const postmaquyenApi = (data) => {
    const URL_API = "/v1/api/postmaquyen";
    return axios.post(URL_API, data)
}
const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API)
}
const getLsErrorApi = () => {
    const URL_API = "/v1/api/lseror";
    return axios.get(URL_API)
}
const getYcsuaApi = () => {   
    const URL_API = "/v1/api/lsycsua";
    return axios.get(URL_API)
}
const getLsChamcongApi = () => {
    const URL_API = "/v1/api/lschamcong";
    return axios.get(URL_API)
}
const getLsCskhApi = () => {
    const URL_API = "/v1/api/lsCskh";
    return axios.get(URL_API)
}
const getLsDoctorApi  = () => {
    const URL_API = "/v1/api/getLsDoctors";
    return axios.get(URL_API)
}
const getLsphongkhamApi  = () => {   
    const URL_API = "/v1/api/getLsPhongKham";
    return axios.get(URL_API)
}
export {
    postbaocaodieutriApi,postbaocaoIcdApi,postIcdApi,postcskhPidApi,postkqGoiApi,getbnBynv,postkqclsApi,fetchycbydateApi,postmaquyenApi,getuserduyetApi,createnickbsApi,postDoctorApi,postycbydateApi,postDeleteYeucauApi,postduyetycApi,createUserApi, loginApi, getUserApi,getLsErrorApi,getLsDoctorApi,postbacsiApi,postpatientApi,getLsphongkhamApi,postKhambenhApi,getLsCskhApi,getLsChamcongApi,postChamcongIdApi,postycsuaApi,getYcsuaApi
}