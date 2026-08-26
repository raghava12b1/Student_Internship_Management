import "./BackButton.css";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="back-btn"
      onClick={() => navigate(-1)}
    >
      <IoArrowBack />
      <span>Back</span>
    </button>
  );
};

export default BackButton;