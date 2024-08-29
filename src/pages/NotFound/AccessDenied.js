import React from 'react';
import { Button, Result } from 'antd';
import UserService from '../../UserService/UserService';
const AccessDenied = () => {
    const handleChangeMenu = () => {
        UserService.doLogout()
    }
  return(
    <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page. 
    Please Contact MIS Team"
    extra={<Button type="primary" onClick={handleChangeMenu}>Back Home</Button>}
  />
 )
};
export default AccessDenied;