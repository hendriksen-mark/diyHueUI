import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { toast } from "react-hot-toast";

import ContentSection from "./ContentSection";
import SidebarSection from "./SidebarSection";
import HeaderSection from "./HeaderSection";
import Loading from "../components/Loader/Loader";

import "./layout.scss";
import "./scrollbar.scss";

const Layout = ({ HOST_IP, API_KEY }) => {
  //console.log("Layout: ", HOST_IP, API_KEY, CONFIG);

  const isMobile = useMediaQuery({ query: `(max-width: 750px)` });
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [CONFIG, setConfig] = useState({
    config: {},
    lights: {},
    groups: {},
    scenes: {},
    rules: {},
    resourcelinks: {},
    schedules: {},
    sensors: {},
    behavior_instance: {},
    smart_scene: {},
    lightTypes: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = (api_key) => {
      //console.log("Fetching CONFIG data...", apiKey ? apiKey : "undefined");
      axios
        .get(`${HOST_IP}/api/${api_key}/all_data`)
        .then((fetchedData) => {
          if (fetchedData.data) {
            //console.log("CONFIG data fetched!", fetchedData.data);
            setConfig(fetchedData.data);
            setIsLoading(false); // Set loading to false once data is fetched
          } else {
            console.error("Incomplete CONFIG data fetched!", api_key, fetchedData.data);
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error(`Error occurred: ${error.message}`);
        });
    };

    if (API_KEY.length === 32) {
      fetchConfig(API_KEY); // Call fetchConfig immediately
    } else {
      console.error("API_KEY is missing: " + (API_KEY ? API_KEY : "undefined"));
    }

    const interval = setInterval(() => {
      if (API_KEY.length === 32) {
        fetchConfig(API_KEY);
      } else {
        console.error("API_KEY is missing: " + (API_KEY ? API_KEY : "undefined"));
      }
    }, 2000); // <<-- ⏱ 1000ms = 1s

    return () => clearInterval(interval);
  }, [API_KEY]);

  if (isLoading) {
    return <Loading additionalText="Config" />; // Show loading spinner while fetching CONFIG data
  }
// #region HTML
  return (
    <>
      <SidebarSection
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        isMobile={isMobile}
      />
      <div className="columnRight">
        <HeaderSection
          HOST_IP={HOST_IP}
          API_KEY={API_KEY}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          CONFIG={CONFIG}
          isLoading={isLoading} // Pass loading state to HeaderSection
        />
        <ContentSection
          HOST_IP={HOST_IP}
          API_KEY={API_KEY}
          CONFIG={CONFIG}
        />
      </div>
    </>
  );
};

export default Layout;
