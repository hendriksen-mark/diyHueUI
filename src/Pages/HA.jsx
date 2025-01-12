import { useState, useEffect } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";

import FlipSwitch from "../components/FlipSwitch/FlipSwitch";
import GenericButton from "../components/GenericButton/GenericButton";
import GenericText from "../components/GenericText/GenericText";
import GlassContainer from "../components/GlassContainer/GlassContainer";
import PageContent from "../components/PageContent/PageContent";
import CardGrid from "../components/CardGrid/CardGrid";

const HA = ({ HOST_IP, API_KEY, CONFIG }) => {
  const [enable, setEnable] = useState(CONFIG.config.homeassistant?.enabled || false);
  const [homeAssistantIp, setHomeAssistantIp] = useState(CONFIG.config.homeassistant?.homeAssistantIp || "192.168.x.x");
  const [homeAssistantPort, setHomeAssistantPort] = useState(CONFIG.config.homeassistant?.homeAssistantPort || 8123);
  const [homeAssistantToken, setHomeAssistantToken] = useState (CONFIG.config.homeassistant?.homeAssistantToken || "");
  const [homeAssistantIncludeByDefault, setHomeAssistantIncludeByDefault] = useState(CONFIG.config.homeassistant?.homeAssistantIncludeByDefault || false);
  const [homeAssistantUseHttps, setHomeAssistantUseHttps] = useState(CONFIG.config.homeassistant?.homeAssistantUseHttps || false);

  const onSubmit = () => {
    axios
      .put(`${HOST_IP}/api/${API_KEY}/config`, {
        homeassistant: {
          enabled: enable,
          homeAssistantIp: homeAssistantIp,
          homeAssistantPort: homeAssistantPort,
          homeAssistantToken: homeAssistantToken,
          homeAssistantIncludeByDefault: homeAssistantIncludeByDefault,
          homeAssistantUseHttps: homeAssistantUseHttps,
        },
      })
      .then((fetchedData) => {
        //console.log(fetchedData.data);
        toast.success("Successfully saved, please restart the service");
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Error occurred: ${error.message}`);
      });
  };

  return (
    <div className="inner">
      <CardGrid options="main">
        <GlassContainer>
          <PageContent>
            <div className="headline">Home Assistant config</div>
            <form className="add-form">
              <FlipSwitch
                id="ha"
                value={enable}
                onChange={(e) => setEnable(e)}
                checked={enable}
                label="Enable"
                position="right"
              />
              <div className="form-control">
                <GenericText
                  label="Home Assistant IP"
                  type="text"
                  placeholder="IP or hostname"
                  value={homeAssistantIp}
                  onChange={(e) => setHomeAssistantIp(e)}
                />
              </div>
              <div className="form-control">
                <GenericText
                  label="Home Assistant port"
                  type="number"
                  placeholder="8123"
                  value={homeAssistantPort}
                  onChange={(e) => setHomeAssistantPort(e)}
                />
              </div>
              <div className="form-control">
                <GenericText
                  label="Home Assistant token"
                  type="password"
                  placeholder="Token"
                  value={homeAssistantToken}
                  onChange={(e) => setHomeAssistantToken(e)}
                />
              </div>
              <FlipSwitch
                value={homeAssistantIncludeByDefault}
                onChange={(e) => setHomeAssistantIncludeByDefault(e)}
                checked={homeAssistantIncludeByDefault}
                label="Included by default"
                position="right"
              />

              <FlipSwitch
                value={homeAssistantUseHttps}
                onChange={(e) => setHomeAssistantUseHttps(e)}
                checked={homeAssistantUseHttps}
                label="Enable HTTPS"
                position="right"
              />
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

export default HA;
