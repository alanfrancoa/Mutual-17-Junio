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

// Interfaz para los detalles de asistencia en la tabla
export interface AttendanceDetail {
  date: string; // Ej: "05/02/24"
  attendance: 'Sí' | 'No';
  absence: 'Sí' | 'No';
  observations: string;
}

// Interfaz para los datos detallados de la tabla (parte superior)
export interface DetailedReportData {
  employerRazonSocial: string;
  employerRUT: string;
  employeeName: string;
  employeeRUT: string;
  consultedPeriod: string; // Ej: "Desde: 30/01/2025 Hasta: 5/03/2025"
  position: string;
  serviceLocation: string;
  attendanceDetails: AttendanceDetail[]; // Array de detalles de asistencia
  totalDaysWorkedSept: string; // "Total domingos y / o festivos 3 laborados en septiembre"
  totalDaysWorkedPeriod: string; // "Total domingos y / o festivos laborados 3 del 01/09/24 al 30/09/24"
}

// Interfaz para el objeto completo del reporte que será retornado
export interface ReportData {
  summary: ReportSummary;
  details: DetailedReportData;
  // Si tienes diferentes tipos de reportes con estructuras de 'details' muy diferentes,
  // aquí podrías tener un campo 'type: "DomingosYFestivos" | "Mensual", etc.'
  // y 'details' podría ser un tipo de unión (union type) o simplemente omitirlo y pasar
  // solo el summary y la tabla detallada como props separadas a ReportDisplay si te complica el tipado.
}