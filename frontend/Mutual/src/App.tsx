import React from "react";
import AppRouter from "./AppRouter";
import { Toaster } from "react-hot-toast";
import { LoansProvider } from "./context/LoansContext";

function App() {
  return (
    <>
    <LoansProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "#22C55E",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#22C55E",
            },
          },
          error: {
            style: {
              background: "#EF4444",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#EF4444",
            },
          },
        }}
      />
      <AppRouter />;
      </LoansProvider>
    </>
    
  );
}

export default App;
