import { Button, Result } from 'antd';
import {
    useNavigate
} from "react-router-dom"
import "./load.css"
const LoadScreen = () => {
    return (
        <div className='body'>
            <div class="background-loader">
                <div class="loader">
                    <span class="spinner spinner1"></span>
                    <span class="spinner spinner2"></span>
                    <span class="spinner spinner3"></span>
                    <br/>
                        <span class="loader-text">LOADING...</span>
                </div>
            </div>
        </div>
    )
};
export default LoadScreen;