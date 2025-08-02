import { useState, useEffect } from "react";

import axios from "axios";
import { FaBars } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import FlipSwitch from "../components/FlipSwitch/FlipSwitch";

import "./headerSection.scss";
import NotificationCenter from "../components/NotificationCenter/NotificationCenter";

const HeaderSection = ({ HOST_IP, showSidebar, setShowSidebar, API_KEY, CONFIG, isLoading }) => {
  //console.log("HeaderSection: ", HOST_IP, API_KEY, CONFIG);
  const [group0State, setGroup0State] = useState(false);

  useEffect(() => {
    if (!isLoading && CONFIG.groups[0]?.state) {
      setGroup0State(CONFIG.groups[0].state.any_on);
    }
  }, [isLoading, CONFIG.groups]);

  const iconVariants = {
    opened: {
      rotate: 90,
      //scale: 2
    },
    closed: {
      rotate: 0,
      //scale: 1
    },
  };

  const handleToggleChange = (state) => {
    const newState = { on: state };
    //console.log("Apply state " + JSON.stringify(newState));
    axios
      .put(`${HOST_IP}/api/${API_KEY}/groups/0/action`, newState)
      .then((response) => {
        // Only update the state if the request was successful
        setGroup0State(state);
      })
      .catch((error) => {
        console.error("Error updating state: ", error);
      });
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading indicator while CONFIG is loading
  }
// #region HTML
  return (
    <div className="topbarRight">
      <motion.div
        className="hamburger"
        initial={false}
        variants={iconVariants}
        animate={showSidebar ? "opened" : "closed"}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <FaBars />
      </motion.div>

      <div className="cpuTemp">
        <p>CPU Temperature: {CONFIG?.info.pi_temp}°C</p>
      </div>

      <NotificationCenter
        notifications={true}
        updating={true}
        HOST_IP={HOST_IP}
        API_KEY={API_KEY}
        CONFIG={CONFIG}
      />

      <div className="onbtn">
        <FlipSwitch
          id="onbtn"
          value={group0State}
          onChange={(e) => handleToggleChange(e)}
          checked={group0State}
          label={`Turn all lights ${group0State ? "off" : "on"}`}
        />
      </div>
    </div>
  );
};

export default HeaderSection;
