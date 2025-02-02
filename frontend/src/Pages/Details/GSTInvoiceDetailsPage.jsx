import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PlusCircle, MinusCircle } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import {
  InvoiceHeaderStatic,
  BankInfoStatic,
  NoteStatic,
} from "../../Utils/GSTInvoicePage/Static";

const INITIAL_INVOICE_STATE = {
  GSTInvoiceNo: "BC/24-25/000",
  date: new Date().toISOString().split("T")[0],
  roNo: null,
  clientInfo: "",
  sacCode: "",
  poNo: "",
  poDate: "",
  AllItemAmountTotal: "",
  discount: "",
  NetAmount: "",
  I_GST: "",
  C_GST: "",
  S_GST: "",
  gstType: "local",
  gstSlab: "5",
  TotalAmount: "",
};

const INITIAL_ITEM_STATE = {
  sno: "1",
  publication: "",
  edition: "",
  insertionDate: new Date().toISOString().split("T")[0],
  page: "",
  mode: "",
  AdCaption: "",
  sizeW: "",
  sizeH: "",
  ratePerSqCM: "",
  ItemAmount: "",
};

const Invoice = () => {
  const [invoice, setInvoice] = useState(INITIAL_INVOICE_STATE);
  const [invoiceItems, setInvoiceItems] = useState([INITIAL_ITEM_STATE]);

  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const [amountInWords, setAmountInWords] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialInvoiceState, setInitialInvoiceState] = useState({});
  const [initialInvoiceItems, setInitialInvoiceItems] = useState([]);

  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef });

  const fetchInvoice = async () => {
    try {
      const { data } = await axios.get(`/api/gst-invoice/${id}`);
      // console.log(data);
      setInvoice(data);
      // Create new variables to store deep copies of the arrays
      const newInvoiceItems = data.items.map((item) => ({ ...item }));
      const newInitialInvoiceItems = data.items.map((item) => ({
        ...item,
      }));

      // Now set these new variables to the state
      setInvoiceItems(newInvoiceItems);
      setInitialInvoiceState(data);
      setInitialInvoiceItems(newInitialInvoiceItems);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error("Error fetching invoice data.");
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (index, field, value) => {
    const newItems = [...invoiceItems];
    newItems[index][field] = value;

    if (["sizeW", "sizeH", "ratePerSqCM"].includes(field)) {
      const width = parseFloat(newItems[index].sizeW) || 0;
      const height = parseFloat(newItems[index].sizeH) || 0;
      const rate = parseFloat(newItems[index].ratePerSqCM) || 0;
      // newItems[index].ItemAmount = (width * height * rate).toFixed(2);
      newItems[index].ItemAmount = width * height * rate;
    }

    setInvoiceItems(newItems);
  };

  const addRow = () => {
    setInvoiceItems((prevItems) => [
      ...prevItems,
      {
        ...INITIAL_ITEM_STATE,
        sno: prevItems.length + 1,
      },
    ]);
  };

  const removeRow = () => {
    const items = Object.values(invoiceItems);
    if (items.length > 1) {
      setInvoiceItems(
        items.filter((item, index) => index !== items.length - 1)
      );
    } else {
      toast.error("At least one row is required.");
    }
  };

  const convertToWords = (amount) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const convertGroup = (n) => {
      let word = "";

      // Handle hundreds
      if (n > 99) {
        word += ones[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }

      // Handle tens and ones
      if (n > 0) {
        if (n > 9 && n < 20) {
          word += teens[n - 10];
        } else {
          word += tens[Math.floor(n / 10)];
          if (n % 10 > 0) {
            word += " " + ones[n % 10];
          }
        }
      }

      return word.trim();
    };

    // Split amount into rupees and paise
    const [rupees, paise] = Number(amount).toFixed(2).split(".");
    let result = "";

    const num = parseInt(rupees);
    if (num === 0) return "Zero Rupees";

    // Handle crores
    const crore = Math.floor(num / 10000000);
    if (crore > 0) {
      result += convertGroup(crore) + " Crore ";
    }

    // Handle lakhs
    const lakh = Math.floor((num % 10000000) / 100000);
    if (lakh > 0) {
      result += convertGroup(lakh) + " Lakh ";
    }

    // Handle thousands
    const thousand = Math.floor((num % 100000) / 1000);
    if (thousand > 0) {
      result += convertGroup(thousand) + " Thousand ";
    }

    // Handle remaining hundreds, tens and ones
    const remaining = num % 1000;
    if (remaining > 0) {
      result += convertGroup(remaining);
    }

    result += " Rupees";

    // Add paise if present
    if (parseInt(paise) > 0) {
      result += " and " + convertGroup(parseInt(paise)) + " Paise";
    }

    return result;
  };

  const calculateTotals = () => {
    const itemTotal = invoiceItems.reduce(
      (sum, item) => sum + (parseFloat(item.ItemAmount) || 0),
      0
    );

    const discountAmount = parseFloat(invoice.discount) || 0;
    const netAmount = itemTotal - discountAmount;

    const gstRate = parseFloat(invoice.gstSlab) / 100;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (invoice.gstType === "local") {
      const halfGstRate = gstRate / 2;
      cgst = netAmount * halfGstRate;
      sgst = netAmount * halfGstRate;
    } else {
      igst = netAmount * gstRate;
    }

    const totalAmount = netAmount + cgst + sgst + igst;
    const roundedTotalAmount = Math.round(totalAmount); // Rounded to the nearest integer

    setInvoice((prev) => ({
      ...prev,
      AllItemAmountTotal: itemTotal.toFixed(2),
      NetAmount: netAmount.toFixed(2),
      C_GST: cgst.toFixed(2),
      S_GST: sgst.toFixed(2),
      I_GST: igst.toFixed(2),
      TotalAmount: roundedTotalAmount.toFixed(2), // Store the rounded total amount
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setInvoice(initialInvoiceState);
    setInvoiceItems(initialInvoiceItems);
    setIsEditing(false);
  };

  useEffect(() => {
    if (invoice.TotalAmount) {
      calculateTotals();
      const words = convertToWords(invoice.TotalAmount);
      setAmountInWords(words);
    }
  }, [
    invoice.discount,
    invoice.TotalAmount,
    invoice.gstType,
    invoice.gstSlab,
    invoiceItems,
  ]);

  const navigate = useNavigate();

  const refreshPage = () => {
    navigate(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    calculateTotals();
    setIsSubmitting(true);

    // If all fields are filled, prepare the data for submission
    const data = {
      ...invoice,
      items: invoiceItems,
    };

    // console.log("Submitting");
    // console.log("Invoice Data:", data);

    try {
      // Update existing invoice
      const response = await axios.put(`/api/gst-invoice/${id}`, data);
      // console.log(response);
      if (response.status === 200) {
        refreshPage();
        toast.success("Invoice updated successfully!");
        handleCancelClick();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving invoice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen flex flex-col items-center">
      <div ref={contentRef} className="max-w-6xl m-auto px-8 py-20 margin0">
        <form onSubmit={handleSubmit} id="invoice-form">
          <div className="bg-white p-6 rounded-lg print:p-4">
            <div className="mb-4">
              <InvoiceHeaderStatic />
            </div>

            <div className="grid grid-cols-[60%_40%] border border-gray-300 p-x-2">
              <div className="border-r border-gray-300">
                <div className="p-4 pb-0">
                  <div className="flex flex-col mb-4">
                    <label className="block text-sm font-medium pb-4 print:pb-0">
                      To,
                    </label>
                    <textarea
                      name="clientInfo"
                      value={invoice.clientInfo}
                      disabled={!isEditing}
                      onChange={handleInvoiceChange}
                      rows={6}
                      className="uppercase w-full px-2 p-2 border border-gray-300 focus:border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-none"
                      id="client-info"
                      placeholder="Enter Client Name
Enter GST Number
Enter Contact Number
Enter Address"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between p-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold pr-4">
                    Invoice_No.
                  </label>
                  <input
                    type="text"
                    name="GSTInvoiceNo"
                    value={invoice.GSTInvoiceNo}
                    readOnly
                    disabled
                    className="bg-white p-1 text-sm font-bold focus:outline-none text-end"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold pr-4">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={invoice.date}
                    disabled={!isEditing}
                    onChange={handleInvoiceChange}
                    className="p-1 text-sm text-end font-bold focus:outline-none focus:border border-gray-300"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold pr-4">
                    HSN/SAC_Code
                  </label>
                  <input
                    type="text"
                    name="sacCode"
                    value={invoice.sacCode}
                    disabled={!isEditing}
                    onChange={handleInvoiceChange}
                    className="uppercase p-1 text-sm text-end font-semibold focus:outline-none focus:border border-gray-300"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold pr-4">
                    PO No.
                  </label>
                  <input
                    type="text"
                    name="poNo"
                    value={invoice.poNo}
                    disabled={!isEditing}
                    onChange={handleInvoiceChange}
                    className="uppercase p-1 text-sm text-end font-semibold focus:outline-none focus:border border-gray-300"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold pr-4">
                    PO Date
                  </label>
                  <input
                    type="text"
                    name="poDate"
                    value={invoice.poDate}
                    disabled={!isEditing}
                    onChange={handleInvoiceChange}
                    className="uppercase p-1 text-sm text-end font-semibold focus:outline-none focus:border border-gray-300"
                  />
                </div>
              </div>
            </div>

            <div className="w-full rounded-lg">
              <table className="border-collapse">
                <thead className="rounded-sm">
                  <tr>
                    <th
                      className="w-4 border border-gray-300 p-2 text-xs font-semibold"
                      rowSpan="2"
                    >
                      {invoice.roNo ? "RO No" : "S.No."}
                    </th>
                    <th
                      className="w-56 border border-gray-300 p-2 text-xs font-semibold"
                      rowSpan="2"
                    >
                      Publication
                    </th>
                    <th
                      className="w-40 border border-gray-300 p-2 text-xs font-semibold"
                      rowSpan="2"
                    >
                      Edition
                    </th>
                    <th
                      className="w-20 border border-gray-300 p-2 text-xs font-semibold"
                      rowSpan="2"
                    >
                      Insertion_Date
                    </th>
                    <th
                      className="w-24 border border-gray-300 p-2 text-xs font-semibold"
                      rowSpan="2"
                    >
                      Page
                    </th>
                    <th
                      className="w-24 border border-gray-300 p-2 text-xs font-semibold"
                      rowSpan="2"
                    >
                      Mode
                    </th>
                    <th
                      className="w-40 border border-gray-300 p-2 text-xs font-semibold"
                      rowSpan="2"
                    >
                      Caption
                    </th>
                    <th
                      className="w-28 border border-gray-300 p-2 text-xs font-semibold text-center"
                      colSpan="2"
                    >
                      Size
                    </th>
                    <th
                      className="w-16 border border-gray-300 p-2 text-xs font-semibold"
                      rowSpan="2"
                    >
                      Rate per sq.cm.
                    </th>
                    <th
                      className="w-30 border border-gray-300 p-2 text-xs font-semibold"
                      rowSpan="2"
                    >
                      Amount
                    </th>
                  </tr>
                  <tr>
                    <th className="w-14 border border-gray-300 p-1 text-xs font-semibold">
                      W
                    </th>
                    <th className="w-14 border border-gray-300 p-1 text-xs font-semibold">
                      H
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-1 text-center">
                        {/* {item.sno} */}
                        {invoice.roNo ? invoice.roNo : item.sno}
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          disabled={!isEditing}
                          type="text"
                          value={item.publication}
                          onChange={(e) =>
                            handleChange(index, "publication", e.target.value)
                          }
                          className="uppercase w-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          disabled={!isEditing}
                          type="text"
                          value={item.edition}
                          onChange={(e) =>
                            handleChange(index, "edition", e.target.value)
                          }
                          className="uppercase w-full text-center p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          disabled={!isEditing}
                          type="date"
                          value={item.insertionDate}
                          onChange={(e) =>
                            handleChange(index, "insertionDate", e.target.value)
                          }
                          className="w-full text-center p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          disabled={!isEditing}
                          type="text"
                          value={item.page}
                          onChange={(e) =>
                            handleChange(index, "page", e.target.value)
                          }
                          className="uppercase w-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          disabled={!isEditing}
                          type="text"
                          value={item.mode}
                          onChange={(e) =>
                            handleChange(index, "mode", e.target.value)
                          }
                          className="uppercase w-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          disabled={!isEditing}
                          type="text"
                          value={item.AdCaption}
                          onChange={(e) =>
                            handleChange(index, "AdCaption", e.target.value)
                          }
                          className="uppercase w-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          disabled={!isEditing}
                          type="text"
                          value={item.sizeW}
                          onChange={(e) =>
                            handleChange(index, "sizeW", e.target.value)
                          }
                          className="uppercase w-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          disabled={!isEditing}
                          type="text"
                          value={item.sizeH}
                          onChange={(e) =>
                            handleChange(index, "sizeH", e.target.value)
                          }
                          className="uppercase w-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          disabled={!isEditing}
                          type="number"
                          value={item.ratePerSqCM}
                          onChange={(e) =>
                            handleChange(index, "ratePerSqCM", e.target.value)
                          }
                          className="uppercase w-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          disabled={!isEditing}
                          type="number"
                          value={item.ItemAmount}
                          onChange={(e) =>
                            handleChange(index, "ItemAmount", e.target.value)
                          }
                          className="uppercase w-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="py-4 space-x-4 flex items-center justify-start noPrint">
                <button
                  type="button"
                  onClick={addRow}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
                  disabled={!isEditing}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Row
                </button>
                {invoiceItems.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeRow()}
                    className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center space-x-2"
                    disabled={!isEditing}
                  >
                    <MinusCircle className="w-4 h-4 mr-2" />
                    Remove
                  </button>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-[60%_40%]">
              <div className="flex flex-col">
                <div className="text-sm font-medium mb-2 print:mt-2">
                  E & O.E.
                </div>
                <textarea
                  value={amountInWords}
                  readOnly
                  rows={2}
                  className="w-full rounded focus:outline-none"
                />
                <BankInfoStatic />
              </div>

              <div className="flex flex-col">
                <div className="rounded flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="noPrint margin0">
                      {/* GST Type */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                          GST Type:
                        </label>
                        <select
                          value={invoice.gstType}
                          disabled={!isEditing}
                          onChange={(e) => {
                            const value = e.target.value;
                            setInvoice((prev) => ({
                              ...prev,
                              gstType: value,
                            }));
                          }}
                          className="w-full p-1 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="local">Local (CGST + SGST)</option>
                          <option value="interstate">Interstate (IGST)</option>
                        </select>
                      </div>

                      {/* GST Slab */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                          GST Slab:
                        </label>
                        <select
                          value={invoice.gstSlab}
                          disabled={!isEditing}
                          onChange={(e) => {
                            const value = e.target.value;
                            setInvoice((prev) => ({
                              ...prev,
                              gstSlab: value,
                            }));
                          }}
                          className="w-full p-1 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="5">5%</option>
                          <option value="12">12%</option>
                          <option value="18">18%</option>
                          <option value="28">28%</option>
                        </select>
                      </div>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-between pt-2">
                      <span>All Item Total:</span>
                      <span>₹ {invoice.AllItemAmountTotal}</span>
                    </div>

                    {/* Discount */}
                    <div
                      className={`flex justify-between items-center ${
                        !invoice.discount && "noPrint margin0"
                      }`}
                    >
                      <span>(-) Less:</span>
                      <div className="flex items-center">
                        <span>₹</span>
                        <input
                          type="number"
                          min="0"
                          value={invoice.discount}
                          disabled={!isEditing}
                          onChange={(e) => {
                            const value = e.target.value;
                            setInvoice((prev) => ({
                              ...prev,
                              discount: value,
                            }));
                          }}
                          className="w-12 ml-1 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Net Amount */}
                    <div
                      className={`flex justify-between items-center ${
                        !invoice.discount && "noPrint margin0"
                      }`}
                    >
                      <span>Net Amount:</span>
                      <span>₹ {invoice.NetAmount}</span>
                    </div>

                    {/* GST Calculations */}
                    {invoice.gstType === "interstate" ? (
                      <div className="flex justify-between">
                        <span>(+) IGST ({invoice.gstSlab}%):</span>
                        <span>₹ {invoice.I_GST}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span>(+) CGST ({invoice.gstSlab / 2}%):</span>
                          <span>₹ {invoice.C_GST}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>(+) SGST ({invoice.gstSlab / 2}%):</span>
                          <span>₹ {invoice.S_GST}</span>
                        </div>
                      </>
                    )}

                    {/* Total Amount */}
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total Amount:</span>
                      <span>₹ {invoice.TotalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <NoteStatic />
          </div>

          <div className="flex gap-4 mt-10 mb-20 noPrint">
            {/* Edit Button */}
            {!isEditing && id && (
              <button
                type="button"
                onClick={handleEditClick}
                className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200 text-lg font-bold"
              >
                Edit
              </button>
            )}

            {/* Submit Button (only shows after Edit) */}
            {isEditing && id && (
              <>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed text-lg font-bold"
                >
                  {isSubmitting ? "Submitting..." : "Update & Save"}
                </button>

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 text-lg font-bold"
                >
                  Cancel
                </button>
              </>
            )}

            {id && (
              <button
                type="button"
                onClick={reactToPrintFn}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 text-lg font-bold"
              >
                Print Invoice
              </button>
            )}
            {/* Reset Button */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Invoice;
