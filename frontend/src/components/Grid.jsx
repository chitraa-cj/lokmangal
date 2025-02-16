import { Link } from "react-router-dom";
import Grid3 from "../components/Grid3";

const Grid = ({ redText = "Lorem ipsum", text = "dolor sit amet" }) => {
  return (
    <Link to="/" className="block">
      <div className="mb-2">
        <h2 className="mb-4 text-xl font-bold">
          <span className="text-2xl font-semibold text-red-600">{redText}</span>{" "}
          {text}
        </h2>
        <Grid3 />
      </div>
    </Link>
  );
};
export default Grid;
