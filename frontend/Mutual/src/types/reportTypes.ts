// src/types/reportTypes.ts

// Interfaz para el resumen del reporte
export interface ReportSummary {
  periodDisplay: string;
  loansApproved: number;
  totalCollected: string; // Ya formateado como string, ej. "$42,300.50"
  delinquency: string; // Ya formateado como string, ej. "5.2%"
  paymentsToSuppliers: string; // Ya formateado como string, ej. "$18,200.00"
  // Puedes añadir más campos aquí si tu reporte los tiene
}

