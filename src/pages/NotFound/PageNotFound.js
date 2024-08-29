import { Button, Result } from 'antd';
import {
    useNavigate
} from "react-router-dom"

const PageNotFound = () => {
    const navigate = useNavigate();
const handleChangeMenu = (item) => {
    navigate(item.key)
}
return(
    <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button type="primary" href="/apps/incident" onChange={handleChangeMenu}>Back Home</Button>}
  />
 )
};
export default PageNotFound;