import PropTypes from 'prop-types'
import { Route } from "react-router-dom";
import UserService from "../../UserService/UserService";
import NotAllowed from "./NotAllowed";
import PageNotFound from '../../pages/NotFound/PageNotFound';

const RolesRoute = ({ roles, children, ...rest }) => (
  <Route {...rest}>
    {UserService.hasRole(roles) ? children : <PageNotFound/>}
  </Route>
)

RolesRoute.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default RolesRoute
