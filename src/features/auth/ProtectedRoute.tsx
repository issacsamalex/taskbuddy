import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
