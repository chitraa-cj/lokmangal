import { useEffect, useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import {
  HandleReleaseOrderChange,
  HandleReleaseOrderItemChange,
  AddReleaseOrderItemRow,
  RemoveReleaseOrderItemRow,
  CalculateReleaseOrderTotals,
  ResetReleaseOrderForm,
  HandleReleaseOrderSubmit,
  FetchCurrentReleaseOrderNumber,
} from "../../Utils/MergedFunctions";
import {
  ReleaseOrderHeaderStatic,
  ReleaseOrderTHeadStatic,
} from "../../Utils/ReleaseOrder/Static";
import {
  ReleaseOrderItemsTable,
  ReleaseOrderMoney,
} from "../../Utils/ReleaseOrder/Dynamic";
import ClientInfoSelect from "./ClientInfo";

const INITIAL_RELEASE_ORDER_STATE = {
  clientInfo: "",
  clientName: "",
  publication: "",
  edition: "",
  roNo: "0000",
  date: new Date().toISOString().split("T")[0],
  gstType: "local",
  gstSlab: "5",
  AllItemAmountTotal: "",
  I_GST: "",
  C_GST: "",
  S_GST: "",
  TotalAmount: "",
  remark: "",
};

const INITIAL_RELEASE_ORDER_ITEM_STATE = {
  sno: "1",
  AdCaption: "",
  insertionDate: new Date().toISOString().split("T")[0],
  sizeW: "0",
  sizeH: "0",
  page: "",
  ratePerSqCM: "0",
  tradeDis: "",
  ItemAmount: "0.00",
};

const ReleaseOrderPage = ({
  invoice,
  setInvoice,
  invoiceItems,
  setInvoiceItems,
}) => {
  const [releaseOrder, setReleaseOrder] = useState(
    JSON.parse(JSON.stringify(INITIAL_RELEASE_ORDER_STATE))
  );
  const [releaseOrderItems, setReleaseOrderItems] = useState([
    JSON.parse(JSON.stringify(INITIAL_RELEASE_ORDER_ITEM_STATE)),
  ]);

  const [isReleaseOrderSubmitting, setIsSubmitting] = useState(false);

  const contentRef = useRef();
  const reactToPrintReleaseOrderFn = useReactToPrint({
    contentRef,
  });

  const handleReleaseOrderChange = (e) =>
    HandleReleaseOrderChange(
      e,
      setReleaseOrder,
      setInvoice,
      setInvoiceItems,
      invoiceItems
    );

  const handleReleaseOrderItemChange = (index, field, value) =>
    HandleReleaseOrderItemChange(
      index,
      field,
      value,
      releaseOrderItems,
      setReleaseOrderItems,
      releaseOrder,
      setInvoice,
      setInvoiceItems
    );

  const addReleaseOrderRow = () =>
    AddReleaseOrderItemRow(
      setReleaseOrderItems,
      INITIAL_RELEASE_ORDER_ITEM_STATE
    );

  const removeReleaseOrderRow = () =>
    RemoveReleaseOrderItemRow(releaseOrderItems, setReleaseOrderItems);

  const calculateReleaseOrderTotals = () =>
    CalculateReleaseOrderTotals(
      releaseOrderItems,
      releaseOrder,
      setReleaseOrder
    );

  const resetReleaseOrderForm = () =>
    ResetReleaseOrderForm(
      setReleaseOrder,
      setReleaseOrderItems,
      INITIAL_RELEASE_ORDER_STATE,
      INITIAL_RELEASE_ORDER_ITEM_STATE,
      FetchCurrentReleaseOrderNumber,
      releaseOrder
    );

  const handleReleaseOrderSubmit = (e) =>
    HandleReleaseOrderSubmit(
      e,
      setIsSubmitting,
      calculateReleaseOrderTotals,
      releaseOrder,
      releaseOrderItems,
      setReleaseOrder,
      setReleaseOrderItems,
      reactToPrintReleaseOrderFn,
      resetReleaseOrderForm,
      INITIAL_RELEASE_ORDER_STATE,
      INITIAL_RELEASE_ORDER_ITEM_STATE,
      FetchCurrentReleaseOrderNumber
    );

  useEffect(() => {
    FetchCurrentReleaseOrderNumber(setReleaseOrder);
  }, []);

  useEffect(() => {
    calculateReleaseOrderTotals();
  }, [
    JSON.stringify(releaseOrderItems),
    JSON.stringify(releaseOrder?.gstType),
    JSON.stringify(releaseOrder?.gstSlab),
  ]);

  return (
    <div className="bg-slate-200 min-h-screen flex flex-col items-center">
      <div className="max-w-6xl m-auto pt-[130px] pl-8 pr-0 pb-0 margin0">
        <form onSubmit={handleReleaseOrderSubmit}>
          <div className="bg-white p-6 rounded-lg" ref={contentRef}>
            <ReleaseOrderHeaderStatic />
            <div className="grid grid-cols-[63%_37%] border px-4 border-b-0 border-gray-300">
              <div className="flex flex-col pr-4 border-r border-gray-300">
                <div className="flex flex-col mb-4 noPrint margin0">
                  <label className="block text-sm font-medium py-4">To,</label>
                  <ClientInfoSelect
                    endpoint={"release-order"}
                    value={releaseOrder.clientInfo}
                    onChange={handleReleaseOrderChange}
                  />
                </div>

                <div className="flex items-center justify-between mb-4 print:pt-4">
                  <label className="block text-sm font-medium print:mr-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={releaseOrder?.clientName.toUpperCase()}
                    disabled
                    readOnly
                    className="bg-white w-[400px] print:w-[350px] p-2 border rounded uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Client Name"
                  />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium print:mr-2">
                    Publication
                  </label>
                  <input
                    type="text"
                    name="publication"
                    value={releaseOrder?.publication.toUpperCase()}
                    onChange={handleReleaseOrderChange}
                    className="w-[400px] print:w-[350px] p-2 border rounded uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Publication name"
                  />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium print:mr-2">
                    Edition
                  </label>
                  <input
                    type="text"
                    name="edition"
                    value={releaseOrder?.edition.toUpperCase()}
                    onChange={handleReleaseOrderChange}
                    className="w-[400px] print:w-[350px] p-2 border rounded uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Edition"
                  />
                </div>
              </div>

              <div className="flex flex-col ml-4 justify-center">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium">R.O._NO</label>
                  <input
                    name="roNo"
                    value={releaseOrder?.roNo}
                    readOnly
                    disabled
                    className="w-48 p-2 text-xl font-bold bg-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={releaseOrder?.date}
                    onChange={handleReleaseOrderChange}
                    className="w-60 ml2 p-2 text-xl text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="w-full rounded-lg">
              <table className="w-full border-collapse">
                <ReleaseOrderTHeadStatic />
                <tbody>
                  <ReleaseOrderItemsTable
                    releaseOrderItems={releaseOrderItems}
                    handleChange={handleReleaseOrderItemChange}
                  />
                </tbody>
              </table>
              <div className="py-4 space-x-4 flex items-center justify-start noPrint">
                <button
                  type="button"
                  onClick={addReleaseOrderRow}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Row
                </button>
                {releaseOrderItems?.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeReleaseOrderRow()}
                    className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center space-x-2"
                  >
                    <MinusCircle className="w-4 h-4 mr-2" />
                    Remove
                  </button>
                ) : null}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 px-4 printMargin">
              <div>
                <div
                  className={`flex flex-col ${
                    releaseOrder?.remark ? "" : "print:hidden"
                  }`}
                >
                  <label className="block text-sm font-medium my-2">
                    <h2 className="text-lg font-semibold">Remark :</h2>
                  </label>
                  <textarea
                    type="text"
                    name="remark"
                    rows={6}
                    value={releaseOrder?.remark}
                    onChange={handleReleaseOrderChange}
                    className="uppercase w-full p-2 print:border-none border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div className="mt-4 pr-2">
                  <h2 className="text-lg font-semibold mb-2">Note :</h2>
                  <ol className="space-y-2 uppercase font-light leading-normal text-xs w-[400px]">
                    <li>
                      Forward voucher copies to our client and this office on
                      the insertion date.
                    </li>
                    <li>Inform us immediately of any missed insertions.</li>
                    <li>
                      Send the bill with the voucher copy within 15 days of
                      insertion
                    </li>
                  </ol>
                </div>
              </div>
              <ReleaseOrderMoney
                releaseOrder={releaseOrder}
                setReleaseOrder={setReleaseOrder}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-10 mb-20 noPrint">
            <button
              type="submit"
              disabled={isReleaseOrderSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-blue-400 text-lg font-semibold disabled:cursor-not-allowed"
            >
              {isReleaseOrderSubmitting
                ? "Submitting..."
                : "Save & Print Release Order"}
            </button>
            <button
              type="button"
              onClick={reactToPrintReleaseOrderFn}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 text-lg font-semibold"
            >
              Print Invoice
            </button>
            <button
              type="button"
              onClick={resetReleaseOrderForm}
              disabled={isReleaseOrderSubmitting}
              className="px-4 py-2 border bg-white border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-gray-100 text-lg font-semibold disabled:cursor-not-allowed"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ReleaseOrderPage;
