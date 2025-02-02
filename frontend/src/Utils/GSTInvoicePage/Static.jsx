export const InvoiceHeaderStatic = () => {
  return (
    <>
      <div className="grid grid-cols-3 mb-2 space-2">
        <div>
          <p className="text-sm text-gray-600">
            GSTIN Number -{" "}
            <span className="text-md font-bold tracking-wider">
              23ATYPM9127H1Z4
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Pan Number -
            <span className="text-md font-bold tracking-wider">ATYPM9127H</span>
          </p>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl uppercase font-semibold text-red-500">
            GST Invoice
          </h2>
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

      <div className="mb-3 flex flex-col items-center mt-[-5px] print:mb-2 ">
        <p className="text-md bg-gray-400 inline px-4 py-1 rounded-sm mt-3 print:mt-[-10px]">
          Print | TV | Radio | Creative | Digital | OOH
        </p>
        <p className="text-md text-gray-600 mt-3 print:mt-2">
          Regd. Office: 1563, 2nd Floor, Vidya Height, Dr. Barat Road, Russel
          Chowk, Jabalpur (M.P.) 482002
        </p>
      </div>
    </>
  );
};

export const InvoiceTHeadStatic = (isMerged = false) => {
  return (
    <thead className="rounded-sm">
      <tr>
        <th
          className="w-4 border border-gray-300 p-2 text-xs font-semibold"
          rowSpan="2"
        >
          {isMerged ? "RO No" : "S.No."}
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
  );
};

export const BankInfoStatic = () => {
  return (
    <div className="border border-gray-500 p-3 rounded w-96">
      <div className="space-y-2 text-sm">
        <div className="font-bold tracking-widest">
          Cheque / DD in Favour of BUSINESS CULTURE
        </div>
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
  );
};

export const NoteStatic = () => {
  return (
    <div className="grid grid-cols-[75%_25%] mt-8 print:mt-0">
      <div className="mt-4 border-gray-300">
        <p className="text-xs text-gray-800">
          <strong>NOTE:</strong>
          {/* Bill should be paid strictly within 7 days on
          submission by crossed cheque or DD only. No receipt given on this
          invoice for cash is valid. Please obtain a separate official stamped
          receipt. */}{" "}
          Payment must be made within 7 days by crossed cheque or DD. Cash
          payments require an official stamped receipt
        </p>
        <p className="text-xs text-gray-800">
          {/* Relative voucher copies have already been supplied to you directly by
          the respective publication. Missing voucher copies and disputes, if
          any, regarding this bill will be entertained within 7 days on
          submission of this bill. */}
          Voucher copies have been provided by the respective publication.
          Disputes or missing copies must be reported within 7 days of bill
          submission.
        </p>
        <p className="text-xs text-gray-800">
          Interest @2% per month will be charged if not paid on the due date.
        </p>
        <p className="text-xs text-gray-800">
          <strong>Subject to Jabalpur Jurisdiction.</strong>
        </p>
      </div>
      <div className="text-right">
        <div>For : Business Culture</div>
        <div className="mt-16">Authorised Signatory</div>
      </div>

      <div className="text-xs">
        <div>Enclosed : Voucher Copy / Copies</div>
        {/* <div>Prepared by</div> */}
      </div>
    </div>
  );
};
