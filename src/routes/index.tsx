import { Routes, Route } from "react-router-dom";
import { InTheRye, Info, Services, Booking, Checkout, Project, NotFound } from "@/pages";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<InTheRye />} />
      <Route path="/info" element={<Info />} />
      <Route path="/services" element={<Services />} />
      <Route path="/reservation" element={<Booking />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/project/:slug" element={<Project />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
