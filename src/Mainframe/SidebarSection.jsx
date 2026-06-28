import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaLightbulb, FaLink, FaCog, FaSignOutAlt, FaInfoCircle, FaExclamationTriangle, FaUser, FaCode, FaTerminal } from "react-icons/fa";
import { SiHomeassistant, SiZigbee2Mqtt } from "react-icons/si";
import { MdSettingsRemote } from "react-icons/md";
import { IoExtensionPuzzle } from "react-icons/io5";
import { PiUserListFill, PiGameControllerFill } from "react-icons/pi";
import { BsFillLightningFill } from "react-icons/bs";
import { ShDiyhueDark, ShPhilipsHueDark } from 'react-icons/sh';

import { Deconz } from "../static/icons/Deconz";
import { SubMenu } from "../components/MenuItem/MenuItem";
import { Tradfri } from "../static/icons/Tradfri";
import { Govee } from "../static/icons/Govee";
import logo from "../static/images/logo.svg";

import "./sidebarSection.scss";

const SidebarSection = ({ showSidebar, setShowSidebar, isMobile }) => {
  const [currentElement, setCurrentElement] = useState(
    "#" + window.location.hash.substring(1)
  );

  const itemClicked = (link) => {
    if (isMobile) {
      setShowSidebar(false);
    }
    setCurrentElement(link);
  };

  const menuItems = [
    { label: "Groups", icon: FaHome, link: "#" },
    { label: "Lights", icon: FaLightbulb, link: "#lights" },
    { label: "Devices", icon: MdSettingsRemote, link: "#devices" },
    { label: "Automations", icon: BsFillLightningFill, link: "#behaviors" },
    { label: "Entertainment", icon: PiGameControllerFill, link: "#entertainment" },
    {
      label: "DiyHue",
      icon: ShDiyhueDark,
      subItems: [
        { label: "Bridge", icon: ShDiyhueDark, link: "#bridge" },
        { label: "Link button", icon: FaLink, link: "#linkbutton" },
        { label: "App Users", icon: PiUserListFill, link: "#users" },
        { label: "Alarm", icon: FaExclamationTriangle, link: "#alarm" },
        { label: "Settings", icon: FaCog, link: "#settings" },
        { label: "Debug", icon: FaCode, link: "#debug" },
        { label: "Log Viewer", icon: FaTerminal, link: "#logviewer" },
      ],
    },
    {
      label: "Addons",
      icon: IoExtensionPuzzle,
      subItems: [
        { label: "MQTT", icon: SiZigbee2Mqtt, link: "#mqtt" },
        { label: "HA", icon: SiHomeassistant, link: "#ha" },
        { label: "Tradfri", icon: Tradfri, link: "#tradfri" },
        { label: "Deconz", icon: Deconz, link: "#deconz" },
        { label: "Phillips", icon: ShPhilipsHueDark, link: "#phillips" },
        { label: "Govee", icon: Govee, link: "#govee" },
      ],
    },
    { label: "Account", icon: FaUser, link: "#account" },
    { label: "About", icon: FaInfoCircle, link: "#about" },
    { label: "Logout", icon: FaSignOutAlt, link: "/logout" },
  ];
// #region HTML
  return (
    <AnimatePresence initial={false}>
      {showSidebar && (
        <motion.div
          className="columnLeft"
          animate={{ width: 180 }}
          initial={{ width: 1 }}
          exit={{ width: 0 }}
        >
          <div className="topbarLeft active">
            <div className="logo">
              <img src={logo} alt="diyHue Logo" />
            </div>
            <div className="headline">DiyHue</div>
          </div>
          <div className="sidebar">
            <SubMenu
              items={menuItems}
              currentElement={currentElement}
              itemClicked={itemClicked}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SidebarSection;
