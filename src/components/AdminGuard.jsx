import { Navigate, Outlet } from "react-router-dom";
import useAdminStore from "../store/useAdminStore";

export default function AdminGuard() {
  const isAdmin = useAdminStore(
    (state) => state.isAdmin
  );

  if (!isAdmin) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return <Outlet />;
}
