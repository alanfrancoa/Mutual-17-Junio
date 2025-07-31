import { DocumentTextIcon } from "@heroicons/react/24/solid";
import React from "react";

const DownloadSectionReports: React.FC = () => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-6 ">
        Reportes
      </h2>

      <div className="flex-1 flex flex-col w-full">
        <div className="overflow-x-auto rounded-lg bg-white p-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tipo de reporte</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Descarga</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="bg-white">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">Reporte de Morosidad</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                  <button
                    type="button"
                    className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Exportar
                  </button>
                </td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">Reporte Financiero</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                  <button
                    type="button"
                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Exportar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    
    </>
  );
};

export default DownloadSectionReports;
