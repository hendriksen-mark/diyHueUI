import { useState, useEffect } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";

import FlipSwitch from "../components/FlipSwitch/FlipSwitch";
import GenericButton from "../components/GenericButton/GenericButton";
import GenericText from "../components/GenericText/GenericText";
import GlassContainer from "../components/GlassContainer/GlassContainer";
import PageContent from "../components/PageContent/PageContent";
import CardGrid from "../components/CardGrid/CardGrid";

const Govee = ({ HOST_IP, API_KEY, CONFIG }) => {
  const [enable, setEnable] = useState(false);
  const [goveeAPI_KEY, setGoveeAPI_KEY] = useState("");
  const [isModified, setIsModified] = useState(false); // Track user modifications

  useEffect(() => {
    if (!isModified) {
      setEnable(CONFIG.config.govee?.enabled || false);
      setGoveeAPI_KEY(CONFIG.config.govee?.api_key || "");
    }
  }, [CONFIG, isModified]);

  const handleEnableChange = (value) => {
    setEnable(value);
    setIsModified(true); // Mark as modified
  };

  const handleGoveeAPIKeyChange = (value) => {
    setGoveeAPI_KEY(value);
    setIsModified(true); // Mark as modified
  };

  const onSubmit = () => {
    axios
      .put(`${HOST_IP}/api/${API_KEY}/config`, {
        govee: {
          enabled: enable,
          api_key: goveeAPI_KEY,
        },
      })
      .then((fetchedData) => {
        //console.log(fetchedData.data);
        toast.success("Successfully saved, now scan for lights");
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Error occurred: ${error.message}`);
      });
  };
// #region HTML
  return (
    <div className="inner">
      <CardGrid options="main">
        <GlassContainer>
          <PageContent>
            <div className="headline">Govee config</div>
            <form className="add-form">
              <FlipSwitch
                id="govee"
                value={enable}
                onChange={(e) => handleEnableChange(e)}
                checked={enable}
                label="Enable"
                position="right"
              />
              <div className="form-control">
                <GenericText
                  label="Govee API key"
                  type="text"
                  placeholder="API key"
                  value={goveeAPI_KEY}
                  onChange={(e) => handleGoveeAPIKeyChange(e)}
                />
              </div>
              <div className="form-control">
                <GenericButton
                  value="Save"
                  color="blue"
                  size=""
                  type="submit"
                  onClick={() => onSubmit()}
                />
              </div>
            </form>
          </PageContent>
        </GlassContainer>
      </CardGrid>
    </div>
  );
};

export default Govee;
