import axios from "axios";
import { toast } from "react-toastify";

// !Below Functions for Invoice
export const ResetForm = (
  setInvoice,
  setInvoiceItems,
  setAmountInWords,
  INITIAL_INVOICE_STATE,
  INITIAL_ITEM_STATE,
  FetchCurrentInvoiceNumber
) => {
  setInvoice(JSON.parse(JSON.stringify(INITIAL_INVOICE_STATE)));
  setInvoiceItems([JSON.parse(JSON.stringify(INITIAL_ITEM_STATE))]);
  // setInvoiceItems(
  //   Array(6)
  //     .fill()
  //     .map((_, index) => ({
  //       ...JSON.parse(JSON.stringify(INITIAL_ITEM_STATE)),
  //       sno: (index + 1).toString(),
  //     }))
  // );
  setAmountInWords("");

  setTimeout(() => {
    FetchCurrentInvoiceNumber(setInvoice);
  }, 100);
};

export const HandleInvoiceChange = (e, setInvoice) => {
  const { name, value } = e.target;
  setInvoice((prev) => ({
    ...prev,
    [name]: value,
  }));
};

export const HandleChange = (
  index,
  field,
  value,
  invoiceItems,
  setInvoiceItems
) => {
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

export const AddRow = (setInvoiceItems, INITIAL_ITEM_STATE) => {
  setInvoiceItems((prevItems) => [
    ...prevItems,
    {
      ...INITIAL_ITEM_STATE,
      sno: prevItems.length + 1,
    },
  ]);
};

export const RemoveRow = (invoiceItems, setInvoiceItems) => {
  const items = [...invoiceItems];
  if (items.length > 1) {
    setInvoiceItems(items.slice(0, -1));
  } else {
    toast.error("At least one row is required.");
  }
};

export const ConvertToWords = (amount) => {
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

    if (n > 99) {
      word += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }

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

  const [rupees, paise] = Number(amount).toFixed(2).split(".");
  let result = "";

  const num = parseInt(rupees);
  if (num === 0) return "Zero Rupees";

  const crore = Math.floor(num / 10000000);
  if (crore > 0) {
    result += convertGroup(crore) + " Crore ";
  }

  const lakh = Math.floor((num % 10000000) / 100000);
  if (lakh > 0) {
    result += convertGroup(lakh) + " Lakh ";
  }

  const thousand = Math.floor((num % 100000) / 1000);
  if (thousand > 0) {
    result += convertGroup(thousand) + " Thousand ";
  }

  const remaining = num % 1000;
  if (remaining > 0) {
    result += convertGroup(remaining);
  }

  result += " Rupees";

  if (parseInt(paise) > 0) {
    result += " and " + convertGroup(parseInt(paise)) + " Paise";
  }

  return result;
};

export const CalculateTotals = (invoiceItems, invoice, setInvoice) => {
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

export const HandleSubmit = async (
  e,
  invoice,
  invoiceItems,
  setInvoice,
  setInvoiceItems,
  setAmountInWords,
  setIsSubmitting,
  resetFormFn,
  calculateTotalsFn,
  reactToPrintFn,
  INITIAL_INVOICE_STATE,
  INITIAL_ITEM_STATE,
  FetchCurrentInvoiceNumber
) => {
  e.preventDefault();
  calculateTotalsFn(invoiceItems, invoice, setInvoice);
  setIsSubmitting(true);

  // Filter out empty rows
  const filledItems = invoiceItems.filter(
    (item) =>
      item.particulars.trim() !== "" ||
      item.sizeW.trim() !== "" ||
      item.sizeH.trim() !== "" ||
      item.ratePerSqCM.trim() !== ""
  );

  // Check if at least one item exists
  if (filledItems.length === 0) {
    toast.error("Please add at least one item to the invoice");
    setIsSubmitting(false);
    return;
  }

  // Prepare the data for submission with filtered items
  const data = {
    ...invoice,
    items: filledItems,
  };

  // console.log("Submitting");
  // console.log("Invoice Data:", data);

  try {
    const response = await axios.post("/api/invoices/", data);
    if (response.status === 201) {
      toast.success("Invoice saved successfully!");
    }

    reactToPrintFn();

    setTimeout(() => {
      resetFormFn(
        setInvoice,
        setInvoiceItems,
        setAmountInWords,
        INITIAL_INVOICE_STATE,
        INITIAL_ITEM_STATE,
        FetchCurrentInvoiceNumber
      );
    }, 100);
  } catch (error) {
    console.error("Error saving data:", error);
    toast.error(
      error.response?.data?.message || "Error saving invoice. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

export const FetchCurrentInvoiceNumber = async (setInvoice) => {
  try {
    // /api/invoices/current-number;
    const { data } = await axios.get("/api/invoices/current-number");
    setInvoice((prev) => ({
      ...prev,
      invoiceNo: data.invoiceNo,
    }));
  } catch (error) {
    console.error("Error fetching current invoice number", error);
  }
};

// !Below Functions for Release Order
// Function for Release Order Page
// handleReleaseOrderChange function
export const HandleReleaseOrderChange = (e, setReleaseOrder) => {
  const { name, value } = e.target;

  setReleaseOrder((prev) => {
    // If `clientInfo` is updated, extract the first line for `clientName`
    if (name === "clientInfo") {
      const firstLine = value.split("\n")[0]; // Get the first line of the input
      return {
        ...prev,
        clientInfo: value,
        clientName: firstLine,
      };
    }

    // Default update for other fields
    return {
      ...prev,
      [name]: value,
    };
  });
};

// handleChange function
export const HandleReleaseOrderItemChange = (
  index,
  field,
  value,
  releaseOrderItems,
  setReleaseOrderItems
) => {
  const newItems = [...releaseOrderItems];
  newItems[index][field] = value;

  if (["sizeW", "sizeH", "ratePerSqCM", "tradeDis"].includes(field)) {
    const width = parseFloat(newItems[index].sizeW) || 0;
    const height = parseFloat(newItems[index].sizeH) || 0;
    const rate = parseFloat(newItems[index].ratePerSqCM) || 0;
    let itemTotal = width * height * rate;

    const tradeDis = newItems[index].tradeDis;
    if (tradeDis) {
      if (tradeDis.includes("%")) {
        let percent = parseFloat(tradeDis) / 100 || 0;
        percent = Math.min(percent, 0.5); // Cap the discount at 50%
        itemTotal -= itemTotal * percent;
      } else {
        const discount = parseFloat(tradeDis) || 0;
        itemTotal -= discount;
      }
    }

    // newItems[index].ItemAmount = itemTotal.toFixed(2);
    newItems[index].ItemAmount = itemTotal;
  }

  setReleaseOrderItems(newItems);
};

// addRow function
export const AddReleaseOrderItemRow = (
  setReleaseOrderItems,
  INITIAL_ITEM_STATE
) => {
  setReleaseOrderItems((prevItems) => [
    ...prevItems,
    {
      ...INITIAL_ITEM_STATE,
      sno: prevItems.length + 1,
    },
  ]);
};

// removeRow function
export const RemoveReleaseOrderItemRow = (
  releaseOrderItems,
  setReleaseOrderItems
) => {
  const items = [...releaseOrderItems];
  if (items?.length > 1) {
    setReleaseOrderItems(
      items.filter((item, index) => index !== items.length - 1)
    );
  } else {
    toast.error("At least one row is required.");
  }
};

// calculateTotals function
export const CalculateReleaseOrderTotals = (
  releaseOrderItems,
  releaseOrder,
  setReleaseOrder
) => {
  const itemTotal = releaseOrderItems?.reduce(
    (sum, item) => sum + (parseFloat(item.ItemAmount) || 0),
    0
  );

  const gstRate = parseFloat(releaseOrder?.gstSlab) / 100;

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (releaseOrder?.gstType === "local") {
    const halfGstRate = gstRate / 2;
    cgst = itemTotal * halfGstRate;
    sgst = itemTotal * halfGstRate;
  } else {
    igst = itemTotal * gstRate;
  }

  const totalAmount = itemTotal + cgst + sgst + igst;
  const roundedTotalAmount = Math.round(totalAmount); // Rounded to the nearest integer

  setReleaseOrder((prev) => ({
    ...prev,
    AllItemAmountTotal: itemTotal?.toFixed(2),
    C_GST: cgst?.toFixed(2),
    S_GST: sgst?.toFixed(2),
    I_GST: igst?.toFixed(2),
    TotalAmount: roundedTotalAmount?.toFixed(2),
  }));
};

// resetForm function
export const resetReleaseOrderForm = (
  setReleaseOrder,
  setReleaseOrderItems,
  INITIAL_RELEASE_ORDER_STATE,
  INITIAL_ITEM_STATE,
  FetchCurrentReleaseOrderNumber,
  releaseOrder
) => {
  // console.log("DEBUG: Resetting release order form state");
  // console.log("DEBUG: Release order state before reset:", releaseOrder);
  // console.log("DEBUG: Initial state:", INITIAL_RELEASE_ORDER_STATE);

  setReleaseOrder(JSON.parse(JSON.stringify(INITIAL_RELEASE_ORDER_STATE)));

  // console.log("DEBUG: Release order state after reset:", releaseOrder);
  // console.log("DEBUG: After Reset state:", INITIAL_RELEASE_ORDER_STATE);

  // console.log("DEBUG: Resetting release order items state");
  // console.log("DEBUG: Initial item state:", INITIAL_ITEM_STATE);
  setReleaseOrderItems([JSON.parse(JSON.stringify(INITIAL_ITEM_STATE))]);
  // setReleaseOrderItems(
  //   Array(8)
  //     .fill()
  //     .map((_, index) => ({
  //       ...JSON.parse(JSON.stringify(INITIAL_ITEM_STATE)),
  //       sno: (index + 1).toString(),
  //     }))
  // );

  setTimeout(() => {
    // console.log("DEBUG: Fetching current release order number after reset");
    FetchCurrentReleaseOrderNumber(setReleaseOrder);
    // console.log(
    //   "DEBUG: Release order state after fetching current number:",
    //   releaseOrder
    // );
  }, 100);
};

// handleSubmit function
export const HandleReleaseOrderSubmit = async (
  e,
  setIsSubmitting,
  calculateReleaseOrderTotals,
  releaseOrder,
  releaseOrderItems,
  setReleaseOrder,
  setReleaseOrderItems,
  reactToPrintFn,
  resetForm,
  INITIAL_RELEASE_ORDER_STATE,
  INITIAL_ITEM_STATE,
  FetchCurrentReleaseOrderNumber
) => {
  e.preventDefault();
  setIsSubmitting(true);
  calculateReleaseOrderTotals(releaseOrderItems, releaseOrder, setReleaseOrder);

  // Filter out empty rows
  const filledItems = releaseOrderItems.filter(
    (item) =>
      item.AdCaption.trim() !== "" ||
      item.insertionDate.trim() !== "" ||
      item.sizeW.trim() !== "" ||
      item.sizeH.trim() !== "" ||
      item.ratePerSqCM.trim() !== ""
  );

  // Check if at least one item exists
  if (filledItems.length === 0) {
    toast.error("Please add at least one item to the release order");
    setIsSubmitting(false);
    return;
  }

  // Exclude clientName from releaseOrder

  const { clientName, ...restReleaseOrder } = releaseOrder;

  // Prepare the data for submission with filtered items

  const data = {
    ...restReleaseOrder,
    items: filledItems,
  };

  // console.log(data);
  // reactToPrintFn();
  try {
    const response = await axios.post("/api/release-order/", data);
    if (response.status === 201) {
      toast.success("Release Order saved successfully!");
      reactToPrintFn();
    }
    setTimeout(() => {
      resetForm(
        setReleaseOrder,
        setReleaseOrderItems,
        INITIAL_RELEASE_ORDER_STATE,
        INITIAL_ITEM_STATE,
        FetchCurrentReleaseOrderNumber
      );
    }, 100);
  } catch (error) {
    console.error("Error saving data:", error);
    toast.error(
      error.response?.data?.message ||
        "Error saving Release Order. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

export const FetchCurrentReleaseOrderNumber = async (setReleaseOrder) => {
  try {
    const { data } = await axios.get("/api/release-order/current-number");

    setTimeout(() => {
      setReleaseOrder((prev) => ({
        ...prev,
        roNo: data.roNo,
      }));
    }, 100);
  } catch (error) {
    console.error("Error fetching current releaseOrder number", error);
  }
};

// !Below Functions for GST Invoice
export const HandleGSTInvoiceSubmit = async (
  e,
  invoice,
  invoiceItems,
  setInvoice,
  setInvoiceItems,
  setAmountInWords,
  resetFormFn,
  calculateTotalsFn,
  reactToPrintFn,
  INITIAL_INVOICE_STATE,
  INITIAL_ITEM_STATE,
  createInvoice,
  FetchCurrentInvoiceNumber
) => {
  e.preventDefault();
  calculateTotalsFn(invoiceItems, invoice, setInvoice);

  // Filter out empty rows
  const filledItems = invoiceItems.filter(
    (item) =>
      item.publication.trim() !== "" ||
      item.edition.trim() !== "" ||
      item.page.trim() !== "" ||
      item.mode.trim() !== "" ||
      item.sizeW.trim() !== "" ||
      item.sizeH.trim() !== "" ||
      item.ratePerSqCM.trim() !== ""
  );

  // Check if at least one item exists
  if (filledItems.length === 0) {
    toast.error("Please add at least one item to the invoice");
    return;
  }

  // Prepare the data for submission with filtered items
  const data = {
    ...invoice,
    items: filledItems,
  };

  // console.log("Submitting");
  // console.log("Invoice Data:", data);

  // const response = await axios.post("/api/gst-invoice/", data);
  await createInvoice(data, {
    onSuccess: () => {
      toast.success("Invoice created successfully!");
      setTimeout(() => {
        resetFormFn(
          setInvoice,
          setInvoiceItems,
          setAmountInWords,
          INITIAL_INVOICE_STATE,
          INITIAL_ITEM_STATE,
          FetchCurrentInvoiceNumber
        );
      }, 100);
      reactToPrintFn();
    },
    onError: (error) => {
      console.error("Error saving data:", error);
      toast.error("Error saving invoice. Please try again.");
    },
  });
};

export const FetchCurrentGSTInvoiceNumber = async (setInvoice) => {
  try {
    // /api/invoices/current-number;
    const { data } = await axios.get("/api/gst-invoice/current-number");
    setInvoice((prev) => ({
      ...prev,
      GSTInvoiceNo: data.GSTInvoiceNo,
    }));
  } catch (error) {
    console.error("Error fetching current invoice number", error);
  }
};
