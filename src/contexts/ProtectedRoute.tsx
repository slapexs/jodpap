import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading) {
			if (!isAuthenticated) {
				navigate("/login");
			}
		}
	}, [isAuthenticated, isLoading, navigate]);

	return isAuthenticated ? <>{children}</> : null;
};

