import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/Login/Login.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ProtectedRoute } from "./contexts/ProtectedRoute.tsx";
import Note from "./pages/Note/Note.tsx";
import Register from "./pages/Register/Register.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import Setting from "./pages/Setting/Setting.tsx";
import Profile from "./pages/Profile/Profile.tsx";
import FriendList from "./pages/Friend/FriendList.tsx";
import SearchFriend from "./pages/Friend/SearchFriend.tsx";
import AddNote from "./pages/Note/AddNote.tsx";
import NoteFriend from "./pages/Friend/NoteFriend.tsx";

createRoot(document.getElementById("root")!).render(
	<AuthProvider>
		<StrictMode>
			<Toaster />
			<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
				<BrowserRouter>
					<Routes>
						<Route
							path="/"
							element={
								<ProtectedRoute>
									<Note />
								</ProtectedRoute>
							}
						/>

						<Route path="/login" element={<Login />} />
						<Route
							path="/note"
							element={
								<ProtectedRoute>
									<Note />
								</ProtectedRoute>
							}
						/>
						<Route path="/register" element={<Register />} />
						<Route
							path="/setting"
							element={
								<ProtectedRoute>
									<Setting />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/profile"
							element={
								<ProtectedRoute>
									<Profile />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/friends"
							element={
								<ProtectedRoute>
									<FriendList />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/search-friend"
							element={
								<ProtectedRoute>
									<SearchFriend />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/add-note"
							element={
								<ProtectedRoute>
									<AddNote />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/friend/:friendId"
							element={
								<ProtectedRoute>
									<NoteFriend />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</StrictMode>
	</AuthProvider>
);

