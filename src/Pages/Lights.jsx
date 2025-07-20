import React, { useEffect, useState } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";
import { BsPlusCircle } from "react-icons/bs";

import AddLight from "../components/AddLight/AddLight";
import CardGrid from "../components/CardGrid/CardGrid";
import { ScanIcon } from "../static/icons/scan";
import Light from "../components/Light/Light";
import Wizard from "../components/Wizard/Wizard";
import IconButton from "../components/IconButton/IconButton";
import confirmAlert from "../components/reactConfirmAlert/reactConfirmAlert";

export default function Lights({ HOST_IP, API_KEY, CONFIG }) {
  const modelIds = CONFIG.lightTypes;
  const [lights, setLights] = useState(CONFIG.lights);
  const [lightsCatalog, setlightsCatalog] = useState({});
  const [WizardIsOpen, setWizardIsOpen] = useState(false);

  const openWizard = () => {
    setWizardIsOpen(true);
  };

  const closeWizard = (save = false) => {
      if (save) {
        setWizardIsOpen(false);
      } else {
        confirmAlert({
          title: "Confirm to close",
          message: "You have unsaved changes. Are you sure you want to close?",
          buttons: [
            {
              label: "Yes",
              onClick: () => setWizardIsOpen(false),
            },
            {
              label: "No",
              onClick: () => {},
            },
          ],
        });
      }
    };

  const searchForLights = () => {
    if (API_KEY !== undefined) {
      axios
        .post(`${HOST_IP}/api/${API_KEY}/lights`, "")
        .then((fetchedData) => {
          //console.log(fetchedData.data);
          toast.success("Searching for new lights...");
        })
        .catch((error) => {
          console.error(error);
          toast.error(`Error occurred: ${error.message}`);
        });
    }
  };

  useEffect(() => {
    setLights(CONFIG.lights);

    const fetchLightsCatalog = () => {
      axios
        .get(
          `https://raw.githubusercontent.com/diyhue/Lights/master/catalog.json`
        )
        .then((fetchedData) => {
          //console.log(fetchedData.data);
          setlightsCatalog(fetchedData.data);
        })
        .catch((error) => {
          console.error(error);
          toast.error(`Error occurred: ${error.message}`);
        });
    };
    fetchLightsCatalog();
  }, [CONFIG]);
// #region HTML
  return (
    <div className="content">
      <div className="inner">
        <CardGrid>
          <IconButton
            iconName={BsPlusCircle}
            title="Add light"
            size="big"
            color="btn"
            label="Add light"
            onClick={() => openWizard()}
          />

          <IconButton
            iconName={ScanIcon}
            title="Scan for lights"
            size="big"
            color="btn"
            label="Scan for lights"
            onClick={() => searchForLights()}
          />
        </CardGrid>

        <CardGrid>
          {Object.entries(lights).map(([id, light]) => (
            <Light
              key={id}
              HOST_IP={HOST_IP}
              api_key={API_KEY}
              id={id}
              light={light}
              modelIds={modelIds}
              lightsCatalog={lightsCatalog}
            />
          ))}
        </CardGrid>
      </div>

      <Wizard
        isOpen={WizardIsOpen}
        closeWizard={() => closeWizard(false)}
        headline="Add Light"
      >
        <AddLight HOST_IP={HOST_IP} API_KEY={API_KEY} closeWizard={closeWizard}></AddLight>
      </Wizard>
    </div>
  );
}
