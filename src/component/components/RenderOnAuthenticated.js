import UserService from "../../UserService/UserService";

const RenderOnAuthenticated = ({ children }) => (UserService.isLoggedIn()) ? children : null;

export default RenderOnAuthenticated
