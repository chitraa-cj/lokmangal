export const InvoiceHeaderStatic = () => {
  return (
    <>
      <div className="grid grid-cols-3 mb-2 space-2">
        <div>
          <p className="text-sm text-gray-600">
            GSTIN Number -{" "}
            <span className="text-md font-bold">23ATYPM9127H1Z4</span>
          </p>
          <p className="text-sm text-gray-600">
            Pan Number -<span className="text-md font-bold">ATYPM9127H</span>
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
          Regd. Office: 1563, 2nd Floor, Vidya Height, Dr. Barat Road, Russel
          Chowk, Jabalpur (M.P.) 482002
        </p>
      </div>
    </>
  );
};

export const InvoiceTHeadStatic = () => {
  return (
    <thead className="rounded-sm">
      <tr>
        <th
          className="border border-gray-300 p-2 text-sm font-semibold"
          rowSpan="2"
          style={{ maxWidth: "28px" }}
        >
          S.No.
        </th>
        <th
          className="border border-gray-300 p-2 text-sm font-semibold"
          rowSpan="2"
          style={{ maxWidth: "180px" }}
        >
          Particulars
        </th>
        <th
          className="border border-gray-300  text-sm font-semibold w-16"
          rowSpan="2"
        >
          Insertion Date
        </th>
        <th
          className="border border-gray-300 p-2 text-sm font-semibold text-center"
          colSpan="2"
        >
          Size
        </th>
        <th
          className="border border-gray-300 p-2 text-sm font-semibold w-8"
          rowSpan="2"
        >
          Rate per sq.cm.
        </th>
        <th
          className="border border-gray-300 p-2 text-sm font-semibold w-28"
          rowSpan="2"
        >
          Amount
        </th>
      </tr>
      <tr>
        <th className="border border-gray-300 p-1 text-sm font-semibold w-14">
          W
        </th>
        <th className="border border-gray-300 p-1 text-sm font-semibold w-14">
          H
        </th>
      </tr>
    </thead>
  );
};

export const BankInfoStatic = () => {
  return (
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
  );
};
