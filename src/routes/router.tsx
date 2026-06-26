import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import SearchResultsPage from "../pages/SearchResultsPage";
import BookingPage from "../pages/BookingPage";
import PaymentPage from "../pages/PaymentPage";
import BookingConfirmationPage from "../pages/BookingConfirmationPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/search", element: <SearchResultsPage /> },
      { path: "/booking", element: <BookingPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/payment", element: <PaymentPage /> },
          {
            path: "/booking-confirmation",
            element: <BookingConfirmationPage />,
          },
          {
            path: "/my-bookings",
            lazy: async () => {
              const { default: Component } = await import(
                "../pages/MyBookingsPage"
              );
              return { Component };
            },
          },
          {
            path: "/profile",
            lazy: async () => {
              const { default: Component } = await import(
                "../pages/ProfilePage"
              );
              return { Component };
            },
          },
          {
            path: "/tickets/:ticketNumber",
            lazy: async () => {
              const { default: Component } = await import(
                "../pages/TicketPage"
              );
              return { Component };
            },
          },
          {
            path: "/agent",
            lazy: async () => {
              const { default: Component } = await import(
                "../pages/AgentPage"
              );
              return { Component };
            },
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);