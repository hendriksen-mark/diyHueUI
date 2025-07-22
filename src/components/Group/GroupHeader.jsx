import React, { useCallback, useEffect, useState } from "react";

import axios from "axios";
import { AnimatePresence } from "framer-motion";

import BrightnessSlider from "../BrightnessSlider/BrightnessSlider";
import FlipSwitch from "../FlipSwitch/FlipSwitch";
import GradientIndicator from "../GradientIndicator/GradientIndicator";


const GroupHeader = ({ HOST_IP, api_key, id, group, lights }) => {
  const [groupState, setGroupState] = useState(group.state);

  useEffect(() => {
    setGroupState(group.state);
  }, [group]);

  const handleToggleChange = (state) => {
    const newState = {
      on: state,
    };
    setGroupState((prevState) => ({ ...prevState, any_on: state }));
    axios.put(`${HOST_IP}/api/${api_key}/groups/${id}/action`, newState);
  };

  const handleBriChange = (state) => {
    setGroupState((prevAction) => ({ ...prevAction, bri: state }));
    const newState = {
      bri: state,
    };
    axios.put(`${HOST_IP}/api/${api_key}/groups/${id}/action`, newState);
  };

  const statusLights = () => {
    let onLights = 0;
    let offLights = 0;
    for (const light of group.lights) {
      if (lights[light]["state"]["on"] === true) onLights = onLights + 1;
      else offLights = offLights + 1;
    }
    if (onLights === 0) {
      return "All lights off";
    } else if (offLights === 0) {
      return "All lights on";
    } else {
      return onLights + " lights on";
    }
  };
// #region HTML
  return (
    <>
      <div className="row top">
        <GradientIndicator group={group} lights={lights} />
        <div className="text">
          <p className="name"> {group.name} </p>
          <p className="subtext">{statusLights()}</p>
        </div>
        <div className="flipSwitch">
          <FlipSwitch
            id={"group " + id}
            value={groupState["any_on"]}
            onChange={(e) => handleToggleChange(e)}
            checked={groupState["any_on"]}
          />
        </div>
      </div>
      <div className="row background">
        <AnimatePresence initial={false}>
          {groupState["any_on"] && (
            <BrightnessSlider
              defaultValue={groupState["avr_bri"]}
              onChange={(e) => {handleBriChange(e)}}
              max={100}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default GroupHeader;
