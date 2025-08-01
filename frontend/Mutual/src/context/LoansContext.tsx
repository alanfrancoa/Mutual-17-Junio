import React, { createContext, useContext, useEffect, useState } from "react";
import { ILoanList } from "../types/loans/ILoanList";
import { apiMutual } from "../api/apiMutual";

interface LoansContextType {
  loans: ILoanList[];
  loading: boolean;
  error: string | null;
}

const LoansContext = createContext<LoansContextType>({
  loans: [],
  loading: false,
  error: null,
});

export const LoansProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loans, setLoans] = useState<ILoanList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const data = await apiMutual.GetLoans();
        setLoans(data);
        setError(null);
      } catch (err: any) {
        setLoans([]);
        setError("Error al cargar préstamos");
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  return (
    <LoansContext.Provider value={{ loans, loading, error }}>
      {children}
    </LoansContext.Provider>
  );
};

export const useLoans = () => useContext(LoansContext);
