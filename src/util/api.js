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
const postpatientApi = (mavp) => {
    const URL_API = "/v1/api/postpatient";
    const data = {
        mavp
    }
    return axios.post(URL_API, data)
}
const postycsuaApi = (data) => {
    const URL_API = "/v1/api/postycsua"; 
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
    postduyetycApi,createUserApi, loginApi, getUserApi,getLsErrorApi,getLsDoctorApi,postbacsiApi,postpatientApi,getLsphongkhamApi,postKhambenhApi,getLsCskhApi,getLsChamcongApi,postChamcongIdApi,postycsuaApi,getYcsuaApi
}