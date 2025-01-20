import { useLocation } from "react-router";

const Detected = () => {
  const { state } = useLocation();
  console.log('state', state);
  return (
    <div>Detected</div>
  )
};

export default Detected;