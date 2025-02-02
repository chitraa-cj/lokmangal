/* eslint-disable react-hooks/exhaustive-deps */
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
  HandleGSTInvoiceSubmit,
  FetchCurrentGSTInvoiceNumber,
} from "../../Utils/Functions";
import { InvoiceItemsTable, Money } from "../../Utils/GSTInvoicePage/Dynamic";
import {
  InvoiceHeaderStatic,
  InvoiceTHeadStatic,
  BankInfoStatic,
  NoteStatic,
} from "../../Utils/GSTInvoicePage/Static";
import ClientInfoSelect from "../Merged_Invoice/ClientInfo";
import { useGSTInvoices } from "../../Hooks/GSTInvoice.js";

const INITIAL_INVOICE_STATE = {
  GSTInvoiceNo: "BC/24-25/000",
  date: new Date().toISOString().split("T")[0],
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
  const { useCreateInvoice } = useGSTInvoices();
  const { mutate: createInvoice, isPending: isSubmitting } = useCreateInvoice();

  const [invoice, setInvoice] = useState(
    JSON.parse(JSON.stringify(INITIAL_INVOICE_STATE))
  );
  const [invoiceItems, setInvoiceItems] = useState([
    JSON.parse(JSON.stringify(INITIAL_ITEM_STATE)),
  ]);

  const [amountInWords, setAmountInWords] = useState("");

  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef });

  const resetForm = () =>
    ResetForm(
      setInvoice,
      setInvoiceItems,
      setAmountInWords,
      INITIAL_INVOICE_STATE,
      INITIAL_ITEM_STATE,
      FetchCurrentGSTInvoiceNumber
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
    HandleGSTInvoiceSubmit(
      e,
      invoice,
      invoiceItems,
      setInvoice,
      setInvoiceItems,
      setAmountInWords,
      resetForm,
      calculateTotals,
      reactToPrintFn,
      INITIAL_INVOICE_STATE,
      INITIAL_ITEM_STATE,
      createInvoice
    );

  useEffect(() => {
    FetchCurrentGSTInvoiceNumber(setInvoice);
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
    <div className="bg-slate-200 min-h-screen flex flex-col items-center">
      <div
        ref={contentRef}
        className="max-w-6xl m-auto p-4 py-20 print:p-0 print:m-0"
      >
        <form onSubmit={handleSubmit} id="invoice-form">
          <div className="bg-white p-6 rounded-lg">
            <InvoiceHeaderStatic />

            <div className="grid grid-cols-[60%_40%] border border-gray-300 border-b-0 p-x-2">
              <div className="border-r border-gray-300">
                <div className="p-4 pb-0">
                  <div className="flex flex-col mb-4">
                    <label className="block text-sm font-medium pb-4">
                      To,
                    </label>
                    <ClientInfoSelect
                      endpoint={"gst-invoice"}
                      value={invoice.clientInfo}
                      onChange={handleInvoiceChange}
                      noPrint={true}
                    />
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
                    onChange={handleInvoiceChange}
                    className="p-1 text-sm text-end font-bold focus:outline-none focus:border border-gray-300"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold pr-4">
                    HSN/SAC Code
                  </label>
                  <input
                    type="text"
                    name="sacCode"
                    value={invoice.sacCode}
                    onChange={handleInvoiceChange}
                    className="p-1 text-sm text-end font-semibold focus:outline-none focus:border border-gray-300 uppercase"
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
                    onChange={handleInvoiceChange}
                    className="p-1 text-sm text-end font-semibold focus:outline-none focus:border border-gray-300 uppercase"
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
                    onChange={handleInvoiceChange}
                    className="p-1 text-sm text-end font-semibold focus:outline-none focus:border border-gray-300 uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="w-full rounded-lg">
              <table className="border-collapse">
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

              <Money invoice={invoice} setInvoice={setInvoice} />
            </div>

            <NoteStatic />
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
