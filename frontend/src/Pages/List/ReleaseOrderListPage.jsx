import { useState, useEffect } from "react";
import { ArrowLeft, Search, Download } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";

const InvoiceListPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/api/release-order/");
      setInvoices(data.reverse());
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter((releaseOrder) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      releaseOrder.customerName?.toLowerCase().includes(searchLower) ||
      String(releaseOrder.contactNumber).toLowerCase().includes(searchLower)
    );
  });

  const handleExcelDownload = () => {
    // Prepare data for export by selecting and formatting specific fields
    const exportData = filteredInvoices.map((releaseOrder) => ({
      ...releaseOrder,
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.max(key.length, 20),
    }));
    ws["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Release Orders");

    // Generate Excel file and trigger download
    XLSX.writeFile(
      wb,
      `Business_Culture-CRM-Invoices-${
        new Date().toISOString().split("T")[0]
      }.xlsx`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-200 flex items-center justify-center">
        <div className="text-gray-600">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <Link
              to="/release-order"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to New Release Order
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Submitted Invoices
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Total Invoices: {filteredInvoices.length}
            </div>
            <button
              onClick={handleExcelDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Search Box */}
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by customer name or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Publication
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Edition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Release Order No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((releaseOrder, index) => {
                    const uniqueKey = releaseOrder.releaseOrderID
                      ? `${releaseOrder._id}-${index}`
                      : `key-${index}`;

                    return (
                      <tr key={uniqueKey}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 font-semibold ">
                          <div className="border border-blue-500 text-center uppercase">
                            <Link to={`/release-order/${releaseOrder._id}`}>
                              {(releaseOrder.clientInfo &&
                                releaseOrder.clientInfo.split("\n")[0]) ||
                                "Client Name"}
                            </Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 uppercase">
                          {releaseOrder.publication}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 uppercase">
                          {releaseOrder.edition}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 uppercase">
                          {releaseOrder.roNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 uppercase">
                          {releaseOrder.TotalAmount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 uppercase">
                          {new Date(releaseOrder.createdAt).toLocaleString(
                            "en-IN"
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceListPage;
