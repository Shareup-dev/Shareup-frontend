import axios from 'axios';
import AuthService from './auth.services';

const EMPLOYEE_API_BASE_URL = 'http://localhost:8080/api/v1/employees'
let authAxios = null;

if(AuthService.getCurrentUser()){
    authAxios = axios.create({
        baseURL: 'http://192.168.100.2:8080/api/v1/employees',
        headers: {
            Authorization: `Bearer ${AuthService.getCurrentUser().jwt}`
        }
    })
}else{
    authAxios = axios.create({
        baseURL: 'http://192.168.100.2:8080/api/v1'
    })
}

class EmployeeService {
    getEmployees = async () => {
        const result = await authAxios.get('/')
        return result;
        // return axios.get(EMPLOYEE_API_BASE_URL)
    }

    createEmployee = async (employee) => {
        const result = await authAxios.post('/', employee)
        return result;
    }

    getEmployeeById = async (employeeId) => {
        const result = await authAxios.get('/'+ employeeId)
        return result;
    }

    updateEmployee = async (employee, employeeId) => {
        const result = await authAxios.put(employeeId, employee)
        return result;
    }

    deleteEmployee = async (employeeId) => {
        const result = await authAxios.delete('/'+ employeeId)
        return result;
        // return axios.delete(EMPLOYEE_API_BASE_URL + '/' + employeeId);
    }
}

export default new EmployeeService();