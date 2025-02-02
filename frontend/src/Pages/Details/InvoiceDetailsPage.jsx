import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { PlusCircle, MinusCircle } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

const INITIAL_INVOICE_STATE = {
  invoiceNo: "",
  date: "",
  clientName: "",
  gstNo: "",
  address: "",
  AllItemAmountTotal: "",
  discount: "",
  NetAmount: "",
  I_GST: "",
  C_GST: "",
  S_GST: "",
  gstType: "",
  gstSlab: "",
  TotalAmount: "",
};

const INITIAL_ITEM_STATE = {
  sno: "",
  particulars: "",
  insertionDate: "",
  sizeW: "",
  sizeH: "",
  ratePerSqCM: "",
  ItemQuantity: "",
  ItemAmount: "",
};

const InvoiceDetailsPage = () => {
  const [invoice, setInvoice] = useState(INITIAL_INVOICE_STATE);
  const [invoiceItems, setInvoiceItems] = useState([INITIAL_ITEM_STATE]);

  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const [amountInWords, setAmountInWords] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialInvoiceState, setInitialInvoiceState] = useState({});
  const [initialInvoiceItems, setInitialInvoiceItems] = useState([]);

  // console.log(invoice.clientName);
  // console.log(initialInvoiceState.clientName);

  // console.log(invoiceItems[0]?.particulars);
  // console.log(initialInvoiceItems[0]?.particulars);

  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef });

  const fetchInvoice = async () => {
    try {
      const { data } = await axios.get(`/api/invoices/${id}`);
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
      newItems[index].ItemAmount = (width * height * rate).toFixed(2);
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
    // Calculate total amount from all items
    const itemTotal = invoiceItems.reduce(
      (sum, item) => sum + (parseFloat(item.ItemAmount) || 0),
      0
    );

    // Get discount amount
    const discountAmount = parseFloat(invoice.discount) || 0;

    // Calculate net amount after discount
    const netAmount = itemTotal - discountAmount;

    // Get GST rate from selected slab
    const gstRate = parseFloat(invoice.gstSlab) / 100;

    // Initialize GST values
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    // Calculate GST based on type and slab
    if (invoice.gstType === "local") {
      // For local: Split the GST rate equally between CGST and SGST
      const halfGstRate = gstRate / 2;
      cgst = netAmount * halfGstRate;
      sgst = netAmount * halfGstRate;
    } else {
      // For interstate: Apply full GST rate as IGST
      igst = netAmount * gstRate;
    }

    // Calculate final total
    const totalAmount = netAmount + cgst + sgst + igst;

    // Update all values in invoice state
    setInvoice((prev) => ({
      ...prev,
      AllItemAmountTotal: itemTotal.toFixed(2),
      NetAmount: netAmount.toFixed(2),
      C_GST: cgst.toFixed(2),
      S_GST: sgst.toFixed(2),
      I_GST: igst.toFixed(2),
      TotalAmount: totalAmount.toFixed(2),
    }));

    const words = convertToWords(totalAmount);
    setAmountInWords(words);
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
      const response = await axios.put(`/api/invoices/${id}`, data);
      console.log(response);
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
    <div
      ref={contentRef}
      className="bg-slate-200 min-h-screen flex flex-col white"
    >
      <div className="max-w-4xl m-auto py-20 margin0">
        <form onSubmit={handleSubmit} id="invoice-form">
          <div className="bg-white p-8 rounded-lg">
            <div className="mb-4">
              <div className="grid grid-cols-3 mb-2 space-2">
                <div>
                  <p className="text-sm text-gray-600">
                    GSTIN Number -{" "}
                    <span className="text-md font-bold">23ATYPM9127H1Z4</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Pan Number -
                    <span className="text-md font-bold">ATYPM9172H</span>
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <h2 className="text-2xl uppercase font-semibold">Invoice</h2>
                  <img src="./logo.png" alt="Business Culture" width={500} />
                </div>

                <div className="flex flex-col items-end font-semibold text-md">
                  <a href="tel:9602523456" className="hover:text-blue-600">
                    9602523456
                  </a>
                  <a href="tel:9827007227" className="hover:text-blue-600">
                    9827007227
                  </a>
                  <a href="tel:0761-2627285" className="hover:text-blue-600">
                    0761-2627285
                  </a>
                  <a
                    href="mailto:deepakdd123@gmail.com"
                    className="hover:text-blue-600"
                  >
                    deepakdd123@gmail.com
                  </a>
                </div>
              </div>

              <div className="mb-4 flex flex-col items-center space-y-2 mt-[-5px]">
                <p className="text-md bg-gray-400 inline px-4 py-1 rounded-sm">
                  Print | TV | Radio | Creative | Digital | OOH
                </p>
                <p className="text-md text-gray-600">
                  Regd. Office: 1563, 2nd Floor, Vidya Height, Dr. Barat Road,
                  Russel Chowk, Jabalpur (M.P.) 482002
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <label className="block text-md font-semibold pr-4">
                    Invoice_No.
                  </label>
                  <input
                    type="text"
                    name="invoiceNo"
                    value={invoice.invoiceNo}
                    readOnly
                    disabled
                    className="w-full p-2 text-md font-bold rounded bg-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center">
                  <label className="block text-lg font-semibold pr-4">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    disabled={!isEditing}
                    value={invoice.date}
                    onChange={handleInvoiceChange}
                    className="w-full p-2 text-center text-md font-bold border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4 gap-4">
              <div className="grid grid-cols-2">
                <div className="flex items-center mb-4">
                  <label className="block text-sm font-medium">
                    Client_Name
                  </label>
                  <input
                    required
                    type="text"
                    name="clientName"
                    disabled={!isEditing}
                    value={invoice.clientName.toUpperCase()}
                    onChange={handleInvoiceChange}
                    className="w-full ml-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center mb-4 ml-4">
                  <label className="block text-sm font-medium">GST_No.</label>
                  <input
                    required
                    type="text"
                    name="gstNo"
                    disabled={!isEditing}
                    value={invoice.gstNo.toUpperCase()}
                    onChange={handleInvoiceChange}
                    className="w-full ml-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center mb-4">
                <label className="block text-sm font-medium">Address</label>
                <textarea
                  name="address"
                  disabled={!isEditing}
                  value={invoice.address.toUpperCase()}
                  onChange={handleInvoiceChange}
                  rows={1}
                  className="w-full ml-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="w-full rounded-lg">
              <table className="w-full border-collapse">
                <thead className="rounded-sm">
                  <tr>
                    <th
                      className="border border-gray-300 p-1 text-sm font-semibold"
                      rowSpan="2"
                    >
                      S.No.
                    </th>
                    <th
                      className="border border-gray-300 p-2 text-sm font-semibold"
                      rowSpan="2"
                    >
                      Particulars
                    </th>
                    <th
                      className="border border-gray-300 p-2 text-sm font-semibold"
                      rowSpan="2"
                    >
                      Date of Insertions
                    </th>
                    <th
                      className="border border-gray-300 p-2 text-sm font-semibold text-center"
                      colSpan="2"
                    >
                      Size
                    </th>
                    <th
                      className="border border-gray-300 p-2 text-sm font-semibold"
                      rowSpan="2"
                    >
                      Rate per sq.cm.
                    </th>
                    <th
                      className="border border-gray-300 p-2 text-sm font-semibold"
                      rowSpan="2"
                    >
                      Amount
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-gray-300 p-1 text-sm font-semibold">
                      W
                    </th>
                    <th className="border border-gray-300 p-1 text-sm font-semibold">
                      H
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-1 text-center">
                        {item.sno}
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          type="text"
                          disabled={!isEditing}
                          value={item.particulars}
                          onChange={(e) =>
                            handleChange(index, "particulars", e.target.value)
                          }
                          className="w-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          type="date"
                          disabled={!isEditing}
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
                          type="text"
                          disabled={!isEditing}
                          value={item.sizeW}
                          onChange={(e) =>
                            handleChange(index, "sizeW", e.target.value)
                          }
                          className="w-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          type="text"
                          disabled={!isEditing}
                          value={item.sizeH}
                          onChange={(e) =>
                            handleChange(index, "sizeH", e.target.value)
                          }
                          className="w-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          type="number"
                          disabled={!isEditing}
                          value={item.ratePerSqCM}
                          onChange={(e) =>
                            handleChange(index, "ratePerSqCM", e.target.value)
                          }
                          className="w-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          type="number"
                          value={item.ItemAmount}
                          // onChange={(e) =>
                          //   handleChange(index, "ItemAmount", e.target.value)
                          // }
                          readOnly
                          disabled
                          className="w-full p-1 bg-white font-bold text-center"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="py-4 mt-2 space-x-4 flex items-center justify-start noPrint">
                <button
                  type="button"
                  onClick={addRow}
                  disabled={!isEditing}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Row
                </button>
                {invoiceItems.length > 1 ? (
                  <button
                    type="button"
                    disabled={!isEditing}
                    onClick={() => removeRow()}
                    className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center space-x-2"
                  >
                    <MinusCircle className="w-4 h-4 mr-2" />
                    Remove
                  </button>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-2 p-4 pt-2">
              <div className="flex flex-col">
                <div className="text-sm font-medium mb-2">Rupees In Words</div>
                <textarea
                  value={amountInWords}
                  readOnly
                  rows={3}
                  className="w-full rounded focus:outline-none"
                />
                <div className="border border-gray-500 p-4 rounded mt-4">
                  <div className="space-y-2 text-sm">
                    <div>Cheque / DD in Favour of BUSINESS CULTURE.</div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="font-medium">Bank</span>
                      <span className="col-span-2">: Bank of Baroda</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="font-medium">Branch</span>
                      <span className="col-span-2">: Jabalpur</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="font-medium">Account No.</span>
                      <span className="col-span-2">: 78510200002293</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="font-medium">IFSC Code</span>
                      <span className="col-span-2">: BARB0VJJABA</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="rounded flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="noPrint margin0">
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
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="local">Local (CGST + SGST)</option>
                          <option value="interstate">Interstate (IGST)</option>
                        </select>
                      </div>

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
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="5">5%</option>
                          <option value="12">12%</option>
                          <option value="18">18%</option>
                          <option value="28">28%</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <span>All Item Amount Total:</span>
                      <span>₹ {invoice.AllItemAmountTotal || 0}</span>
                    </div>

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
                          disabled={!isEditing}
                          value={invoice.discount}
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

                    <div className="flex justify-between">
                      <span>Net Amount:</span>
                      <span>₹ {invoice.NetAmount}</span>
                    </div>

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

                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total Amount:</span>
                      <span>₹ {invoice.TotalAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right mt-4 pt-4">
                  <div>For : Business Culture</div>
                  <div className="mt-16">Authorised Signatory</div>
                </div>
              </div>
            </div>
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

export default InvoiceDetailsPage;
