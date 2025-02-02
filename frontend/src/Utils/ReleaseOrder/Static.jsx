export const ReleaseOrderHeaderStatic = () => {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        <img src="./logo.png" alt="Business Culture" width={500} />

        <div className="text-center flex flex-col items-center justify-between print:ml-2">
          <h2 className="text-2xl uppercase font-semibold mb-2">
            Release Order
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            GSTIN Number-
            <span className="text-md font-bold ml-1 tracking-wider">
              23ATYPM9127H1Z4
            </span>
          </p>
        </div>
      </div>
      <p className="text-md font-semibold my-4 text-center text-gray-600">
        Regd. Office: 1563, 2nd Floor, Vidya Height, Dr. Barat Road, Russel
        Chowk, Jabalpur (M.P.) 482002
      </p>
    </div>
  );
};

export const ReleaseOrderTHeadStatic = () => {
  return (
    <thead className="rounded-sm">
      <tr>
        <th
          className="border border-gray-300 p-2 text-sm font-semibold w-8"
          rowSpan="2"
        >
          S.No.
        </th>
        <th
          className="border border-gray-300 p-2 text-sm font-semibold w-56"
          rowSpan="2"
        >
          Ad Caption
        </th>
        <th
          className="border border-gray-300 p-2 text-sm font-semibold w-8"
          rowSpan="2"
        >
          Insertions Date
        </th>
        <th
          className="border border-gray-300 p-2 text-sm font-semibold w-10 text-center"
          colSpan="2"
        >
          Size
        </th>
        <th
          className="border border-gray-300 p-2 text-sm font-semibold w-8"
          rowSpan="2"
        >
          Page
        </th>
        <th
          className="border border-gray-300 p-2 text-sm font-semibold w-8"
          rowSpan="2"
        >
          Rate per sq.cm.
        </th>
        <th
          className="border border-gray-300 p-2 text-sm font-semibold w-8"
          rowSpan="2"
        >
          Trade Dis
        </th>
        <th
          className="border border-gray-300 p-2 text-sm font-semibold w-28"
          rowSpan="2"
        >
          Amount
        </th>
      </tr>
      <tr>
        <th className="border border-gray-300 p-1 text-sm font-semibold w-10">
          W
        </th>
        <th className="border border-gray-300 p-1 text-sm font-semibold w-10">
          H
        </th>
      </tr>
    </thead>
  );
};
