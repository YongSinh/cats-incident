import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import RequsetPage from '../../pages/requestForm/requestPage';
import Allrequest from '../../pages/allrepestpage/Allrequest';
import User from '../../pages/Users/User';
import Layout2 from '../layout2/layout2';
import ClientHome from '../../pages/clientHomePage/clientHome';
import PageService from '../../pages/PageService/PageService';
import CategorizationPage from '../../pages/categorization/CategorizationPage';
import PagePriority from '../../pages/priority/PagePriority';
import PageClose from '../../pages/allrepestpage/PageClose';
import PageRespone from '../../pages/allrepestpage/PageRespone';
import PageProccess from '../../pages/Process/PageProccess';
import PageStationManger from '../../pages/StationManger/PageStationManger';
import LayoutOne from "../layout/layout";
import PageClientReq from "../../pages/Client/Requested/PageRequested"
import PageWorkTask from "../../pages/Client/Responsible/PageWorkTask"
import RolesRoute from '../components/RenderOnRole'
import PageNotFound from "../../pages/NotFound/PageNotFound";
import PageResponsible from "../../pages/Client/Responsible/PageResponsible"
import PageCloseTicket from "../../pages/Client/CloseTicket/closeTicket";
import ReportTickets from "../../pages/Report/reportTickets";
import DepartmentWorkTask from "../../pages/Client/Responsible/DepartmentWorkTask";
import PageHeadOfDepet from "../../pages/PageHeadOfDepet/PageHeadOfDepet";
import PageViewRep from "../../pages/Client/Responsible/PageviewRep";
import PageDashboardHead from "../../pages/dashboard Head/PageDashboardHead";
import HomeScreen from "../../pages/dashboard/PageDashboard";
import HomeScreenHd from "../../pages/Client/handlerDasboard/PageDashboardHd";
import PageViewReq from "../../pages/Client/Requested/PageviewReport";


const Router = ({
}) => {


  return (
    <BrowserRouter basename='/apps/incident'>

      <Routes>
              <Route path="*" element={<Navigate to="/home" />} />

              <Route element={<Layout2 />}>
                <Route path='/home' element={<ClientHome />} />
                <Route path='/requested' element={< PageClientReq />} />
                <Route path='/pending' element={<PageClientReq />} />
                <Route path='/request' element={<RequsetPage />} />
                <Route path='/requestRep/:id' element={<PageViewRep />} />
                <Route path='/report' element={<PageViewReq />} />
                <Route path='/dashboard' element={<PageDashboardHead />} />
                <Route path='/handler-report' element={<HomeScreenHd />} />
                <Route path='/responsible/:id' element={<PageResponsible />} />
                <Route path='/acceptable/:id' element={<PageCloseTicket />} />
                <Route path='/worktask' element={<PageWorkTask />} />
                <Route path='/department' element={<DepartmentWorkTask />} />
                <Route path='/headDepartment' element={<PageHeadOfDepet />} />
                </Route>
              <Route element={<LayoutOne />}>
                <Route path="/admin" element={<HomeScreen />} />
                <Route path='/admin-process' element={<PageProccess />} />
                <Route path='/admin-isouser' element={<User />} />
                <Route path='/admin-service' element={<PageService />} />
                <Route path='/admin-categorization' element={<CategorizationPage />} />
                <Route path='/admin-priority' element={<PagePriority />} />
                <Route path='/admin-station-manager' element={<PageStationManger />} />
                <Route path='/admin-report' element={<ReportTickets />} />
                </Route>
              <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>

  );
};


export default Router;


