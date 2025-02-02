import { useState, useEffect } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import {
  ResetForm,
  HandleInvoiceChange,
  HandleChange,
  AddRow,
  RemoveRow,
  ConvertToWords,
  CalculateTotals,
  HandleSubmit,
  FetchCurrentInvoiceNumber,
} from "../../Utils/Functions";
import { InvoiceItemsTable, Money } from "../../Utils/InvoicePage/Dynamic";
import {
  InvoiceHeaderStatic,
  InvoiceTHeadStatic,
  BankInfoStatic,
} from "../../Utils/InvoicePage/Static";

const INITIAL_INVOICE_STATE = {
  invoiceNo: "BC/24-25/",
  date: new Date().toISOString().split("T")[0],
  clientName: "",
  gstNo: "",
  address: "",
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
  particulars: "",
  insertionDate: new Date().toISOString().split("T")[0],
  sizeW: "",
  sizeH: "",
  ratePerSqCM: "",
  // ItemQuantity: "",
  ItemAmount: "",
};

const Invoice = () => {
  const [invoice, setInvoice] = useState(
    JSON.parse(JSON.stringify(INITIAL_INVOICE_STATE))
  );
  const [invoiceItems, setInvoiceItems] = useState([
    JSON.parse(JSON.stringify(INITIAL_ITEM_STATE)),
  ]);

  const [amountInWords, setAmountInWords] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef });

  const resetForm = () =>
    ResetForm(
      setInvoice,
      setInvoiceItems,
      setAmountInWords,
      INITIAL_INVOICE_STATE,
      INITIAL_ITEM_STATE,
      FetchCurrentInvoiceNumber
    );

  const handleInvoiceChange = (e) => HandleInvoiceChange(e, setInvoice);

  const handleChange = (index, field, value) =>
    HandleChange(index, field, value, invoiceItems, setInvoiceItems);

  const addRow = () => AddRow(setInvoiceItems, INITIAL_ITEM_STATE);

  const removeRow = () => RemoveRow(invoiceItems, setInvoiceItems);

  const convertToWords = (amount) => ConvertToWords(amount);

  const calculateTotals = () =>
    CalculateTotals(invoiceItems, invoice, setInvoice);

  const handleSubmit = (e) =>
    HandleSubmit(
      e,
      invoice,
      invoiceItems,
      setInvoice,
      setInvoiceItems,
      setAmountInWords,
      setIsSubmitting,
      resetForm,
      calculateTotals,
      reactToPrintFn,
      INITIAL_INVOICE_STATE,
      INITIAL_ITEM_STATE
    );

  useEffect(() => {
    FetchCurrentInvoiceNumber(setInvoice);
  }, []);

  useEffect(() => {
    if (invoice.TotalAmount) {
      const words = convertToWords(invoice.TotalAmount);
      setAmountInWords(words);
    }

    calculateTotals();
  }, [
    invoiceItems,
    invoice.discount,
    invoice.TotalAmount,
    invoice.gstType,
    invoice.gstSlab,
  ]);

  return (
    <div
      ref={contentRef}
      className="bg-slate-200 min-h-screen flex flex-col white"
    >
      <div className="max-w-4xl m-auto py-20 margin0">
        <form onSubmit={handleSubmit} id="invoice-form">
          <div className="bg-white p-8 rounded-lg">
            <div className="mb-4">
              <InvoiceHeaderStatic />

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
                    className="w-full p-2 text-md font-bold focus:outline-none"
                  />
                </div>

                <div className="flex items-center">
                  <label className="block text-lg font-semibold pr-4">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
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
                  value={invoice.address.toUpperCase()}
                  onChange={handleInvoiceChange}
                  rows={1}
                  className="w-full ml-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="w-full rounded-lg">
              <table className="w-full border-collapse">
                <InvoiceTHeadStatic />
                <tbody>
                  <InvoiceItemsTable
                    invoiceItems={invoiceItems}
                    handleChange={handleChange}
                  />
                </tbody>
              </table>
              <div className="py-4 space-x-4 flex items-center justify-start noPrint">
                <button
                  type="button"
                  onClick={addRow}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Row
                </button>
                {invoiceItems.length > 1 ? (
                  <button
                    type="button"
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
                <div className="text-sm font-medium mb-2">E & O.E.</div>
                <textarea
                  value={amountInWords}
                  readOnly
                  rows={3}
                  className="w-full rounded focus:outline-none"
                />
                <BankInfoStatic />
              </div>

              <Money invoice={invoice} setInvoice={setInvoice} />
            </div>
          </div>

          <div className="flex gap-4 mt-10 mb-20 noPrint">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Save & Print Invoice"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="px-4 py-2 border bg-white border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Invoice;
