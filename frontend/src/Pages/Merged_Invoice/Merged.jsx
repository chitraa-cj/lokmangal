import { useState } from "react";
import GSTInvoicePage from "./GSTInvoicePage";
import ReleaseOrderPage from "./ReleaseOrderPage";

const INITIAL_INVOICE_STATE = {
  GSTInvoiceNo: "BC/24-25/000",
  roNo: "0000",
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

const INITIAL_INVOICE_ITEM_STATE = {
  sno: "1",
  publication: "",
  edition: "",
  insertionDate: new Date().toISOString().split("T")[0],
  page: "",
  mode: "",
  AdCaption: "",
  sizeW: "0",
  sizeH: "0",
  ratePerSqCM: "0",
  ItemAmount: "0.00",
};

const Merged = () => {
  const [invoice, setInvoice] = useState(
    JSON.parse(JSON.stringify(INITIAL_INVOICE_STATE))
  );

  const [invoiceItems, setInvoiceItems] = useState([
    JSON.parse(JSON.stringify(INITIAL_INVOICE_ITEM_STATE)),
  ]);

  return (
    <div className="bg-slate-200 min-h-screen flex items-center justify-center">
      <ReleaseOrderPage
        invoice={invoice}
        setInvoice={setInvoice}
        invoiceItems={invoiceItems}
        setInvoiceItems={setInvoiceItems}
      />

      <GSTInvoicePage
        invoice={invoice}
        setInvoice={setInvoice}
        invoiceItems={invoiceItems}
        setInvoiceItems={setInvoiceItems}
      />
    </div>
  );
};

export default Merged;
