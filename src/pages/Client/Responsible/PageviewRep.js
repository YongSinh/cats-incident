import React from "react";
import {
    useNavigate,
    Link
} from "react-router-dom"
import { useRef } from "react";
import PageView from "../../requestForm/PageView";
const PageViewRep = () => {
    const navigate = useNavigate();
    const onClick = () => {
        navigate(-1);
    }


    return (
        <PageView
            onClickBtnBack={onClick}
        ></PageView>
    )
};

export default PageViewRep;