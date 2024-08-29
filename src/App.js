import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import RequsetPage from './pages/requestForm/requestPage';
import User from './pages/Users/User';
import Layout2 from './component/layout2/layout2';
import ClientHome from './pages/clientHomePage/clientHome';
import PageService from './pages/PageService/PageService';
import CategorizationPage from './pages/categorization/CategorizationPage';
import PagePriority from './pages/priority/PagePriority';
import PageProccess from './pages/Process/PageProccess';
import PageStationManger from './pages/StationManger/PageStationManger';
import HomeScreen from './pages/dashboard/PageDashboard';
import LayoutOne from './component/layout/layout';
import PageClientReq from "./pages/Client/Requested/PageRequested"
import PageWorkTask from "./pages/Client/Responsible/PageWorkTask"
import PageNotFound from "./pages/NotFound/PageNotFound";
import PageResponsible from "./pages/Client/Responsible/PageResponsible"
import PageCloseTicket from "./pages/Client/CloseTicket/closeTicket";
import ReportTickets from "./pages/Report/reportTickets";
import PageViewRep from "./pages/Client/Responsible/PageviewRep";
import PageViewReq from "./pages/Client/Requested/PageviewReport";
import DepartmentWorkTask from "./pages/Client/Responsible/DepartmentWorkTask";
import PageHeadOfDepet from "./pages/PageHeadOfDepet/PageHeadOfDepet";
import UserLayout from './component/UserLayout/UserLayout';
import Handlerlayout from './component/handlerLayout/Handlerlayout';
import HomeScreenHd from './pages/Client/handlerDasboard/PageDashboardHd';
import PageDashboardHead from './pages/dashboard Head/PageDashboardHead';
import HeadLayout from './component/headLayout/HeadLayout';
import AccessDenied from './pages/NotFound/AccessDenied';

function App() {

  let role = localStorage.getItem('role') || "";
  const userRole = role.includes("INCIDENT_USER");
  const adminRole = role.includes("INCIDENT_ADMIN");
  const handlerUser = role.includes("INCIDENT_HANDLER");
  const headUser = role.includes("INCIDENT_HEAD")

  return (
    // apps/incident
    <BrowserRouter basename='/apps/incident'>
      <div>
        {
          adminRole ?
            (
              <>

                <Routes>
                  <Route path="/" element={<Navigate to="/home" />} />

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

              </>

            )
            :
            handlerUser ?
              (
                <Handlerlayout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path='/home' element={<ClientHome />} />
                    <Route path='/requested' element={< PageClientReq />} />
                    <Route path='/pending' element={<PageClientReq />} />
                    <Route path='/request' element={<RequsetPage />} />
                    <Route path='/requestRep/:id' element={<PageViewRep />} />
                    <Route path='/report' element={<PageViewReq />} />
                    <Route path='/handler-report' element={<HomeScreenHd />} />
                    <Route path='/responsible/:id' element={<PageResponsible />} />
                    <Route path='/acceptable/:id' element={<PageCloseTicket />} />
                    <Route path='/worktask' element={<PageWorkTask />} />
                    <Route path='/department' element={<DepartmentWorkTask />} />
                  </Routes>
                </Handlerlayout>
              )
              :
              headUser ?
                (
                  <>
                    <Routes>
                      <Route path="/" element={<Navigate to="/home" />} />
                      <Route element={<HeadLayout />}>
                        <Route path='/home' element={<ClientHome />} />
                        <Route path='/requested' element={< PageClientReq />} />
                        <Route path='/pending' element={<PageClientReq />} />
                        <Route path='/request' element={<RequsetPage />} />
                        <Route path='/requestRep/:id' element={<PageViewRep />} />
                        <Route path='/report' element={<PageViewReq />} />
                        <Route path='/dashboard' element={<PageDashboardHead />} />
                        <Route path='/acceptable/:id' element={<PageCloseTicket />} />
                        <Route path='/headDepartment' element={<PageHeadOfDepet />} />
                      </Route>
                      <Route path="*" element={<PageNotFound />} />
                    </Routes>
                  </>
                )
                :
                userRole ?
                  (
                    <>
                      <UserLayout>
                        <Routes>
                          <Route path="/" element={<Navigate to="/home" />} />
                          <Route path='/home' element={<ClientHome />} />
                          <Route path='/requested' element={<PageClientReq />} />
                          <Route path='/pending' element={<PageClientReq />} />
                          <Route path='/request' element={<RequsetPage />} />
                          <Route path='/requestRep/:id' element={<PageViewRep />} />
                          <Route path='/report' element={<PageViewReq />} />
                          <Route path='/acceptable/:id' element={<PageCloseTicket />} />
                          <Route path="*" element={<PageNotFound />} />
                        </Routes>
                      </UserLayout>
                    </>
                  )
                  :
                  (
                    <>
                      <Routes>
                        <Route path="*" element={<AccessDenied />} />
                      </Routes>
                    </>
                  )

        }
      </div>
    </BrowserRouter>
  );
}

export default App;
