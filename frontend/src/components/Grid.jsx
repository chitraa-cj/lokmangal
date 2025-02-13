import { Link } from "react-router-dom";
import Grid3 from "../components/Grid3";

const Grid = ({ redText = "Lorem ipsum", text = "dolor sit amet" }) => {
  return (
    <Link to="/" className="block">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">
          <span className="text-red-600 font-semibold text-2xl">{redText}</span>{" "}
          {text}
        </h2>
        <Grid3 />
      </div>
    </Link>
  );
};
export default Grid;
