import React from "react";
import AppRouter from "./AppRouter";
import { Toaster } from "react-hot-toast";
import { LoansProvider } from "./context/LoansContext";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <LoansProvider>
        <AppRouter />;
      </LoansProvider>
    </>
  );
}

export default App;
