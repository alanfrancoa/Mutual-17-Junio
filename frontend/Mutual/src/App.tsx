import React from "react";
import AppRouter from "./AppRouter";
import { Toaster } from "react-hot-toast";
import { LoansProvider } from "./context/LoansContext";

function App() {
  return (
    <>
      <LoansProvider>
        <Toaster position="top-right" />
        <AppRouter />;
      </LoansProvider>
    </>
  );
}

export default App;
