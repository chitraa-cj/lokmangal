import { Link } from "react-router-dom";
import Grid3 from "../components/Grid3";

const Grid = () => {
  return (
    <div className="min-w-3xl max-w-3xl">
      <Link to="/" className="block">
        <Grid3 />
      </Link>
    </div>
  );
};
export default Grid;
