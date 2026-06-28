import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import FlipSwitch from "../components/FlipSwitch/FlipSwitch";
import GenericButton from "../components/GenericButton/GenericButton";
import GenericText from "../components/GenericText/GenericText";
import GlassContainer from "../components/GlassContainer/GlassContainer";
import PageContent from "../components/PageContent/PageContent";
import CardGrid from "../components/CardGrid/CardGrid";

const Settings = ({ HOST_IP, API_KEY, CONFIG }) => {
  const [isModified, setIsModified] = useState(false); // Track user modifications

  // Grouped state variables
  const [portConfig, setPortConfig] = useState({
    enabled: CONFIG.config.port.enabled,
    ports: CONFIG.config.port.ports,
  });

  const [protocols, setProtocols] = useState({
    yeelight: CONFIG.config.yeelight.enabled,
    native_multi: CONFIG.config.native_multi.enabled,
    tasmota: CONFIG.config.tasmota.enabled,
    wled: CONFIG.config.wled.enabled,
    shelly: CONFIG.config.shelly.enabled,
    esphome: CONFIG.config.esphome.enabled,
    hyperion: CONFIG.config.hyperion.enabled,
    tpkasa: CONFIG.config.tpkasa.enabled,
    elgato: CONFIG.config.elgato.enabled,
  });

  const [ipRange, setIpRange] = useState({
    IP_RANGE_START: CONFIG.config.IP_RANGE.IP_RANGE_START,
    IP_RANGE_END: CONFIG.config.IP_RANGE.IP_RANGE_END,
    SUB_IP_RANGE_START: CONFIG.config.IP_RANGE.SUB_IP_RANGE_START,
    SUB_IP_RANGE_END: CONFIG.config.IP_RANGE.SUB_IP_RANGE_END,
  });

  const [entertainment_fps, setEntertainmentFps] = useState(CONFIG.config.entertainment_fps);
  const [scanOnHostIP, setScanOnHostIP] = useState(CONFIG.config.scanonhostip);
  const [ip, setIp] = useState(CONFIG.config.ipaddress.replace("http://", ""));

  useEffect(() => {
    if (!isModified) {
      setPortConfig({
        enabled: CONFIG.config.port.enabled,
        ports: CONFIG.config.port.ports,
      });
      setProtocols({
        yeelight: CONFIG.config.yeelight.enabled,
        native_multi: CONFIG.config.native_multi.enabled,
        tasmota: CONFIG.config.tasmota.enabled,
        wled: CONFIG.config.wled.enabled,
        shelly: CONFIG.config.shelly.enabled,
        esphome: CONFIG.config.esphome.enabled,
        hyperion: CONFIG.config.hyperion.enabled,
        tpkasa: CONFIG.config.tpkasa.enabled,
        elgato: CONFIG.config.elgato.enabled,
      });
      setIpRange({
        IP_RANGE_START: CONFIG.config.IP_RANGE.IP_RANGE_START,
        IP_RANGE_END: CONFIG.config.IP_RANGE.IP_RANGE_END,
        SUB_IP_RANGE_START: CONFIG.config.IP_RANGE.SUB_IP_RANGE_START,
        SUB_IP_RANGE_END: CONFIG.config.IP_RANGE.SUB_IP_RANGE_END,
      });
      setEntertainmentFps(CONFIG.config.entertainment_fps);
      setScanOnHostIP(CONFIG.config.scanonhostip);
      setIp(CONFIG.config.ipaddress.replace("http://", ""));
    }
  }, [CONFIG, isModified]);

  // Handlers
  const handlePortConfigChange = (key, value) => {
    setPortConfig((prev) => ({ ...prev, [key]: value }));
    setIsModified(true); // Mark as modified
  };

  const handleProtocolChange = (key, value) => {
    setProtocols((prev) => ({ ...prev, [key]: value }));
    setIsModified(true);
  };

  const handleIpRangeChange = (value, type) => {
    const [sub, ip] = value.split(".").slice(2).map(Number);
    setIpRange((prev) => ({
      ...prev,
      [type === "start" ? "SUB_IP_RANGE_START" : "SUB_IP_RANGE_END"]: sub,
      [type === "start" ? "IP_RANGE_START" : "IP_RANGE_END"]: ip,
    }));
    setIsModified(true);
  };

  // Modularized submit functions
  const submitConfig = (data, successMessage) => {
    axios
      .put(`${HOST_IP}/api/${API_KEY}/config`, data)
      .then(() => toast.success(successMessage))
      .catch((error) => toast.error(`Error occurred: ${error.message}`));
  };

  const onSubmitPort = () => {
    submitConfig(
      { port: { enabled: portConfig.enabled, ports: portConfig.ports.toString().match(/\d+/g).map(Number) } },
      "Port configuration saved successfully"
    );
  };

  const onSubmitProtocols = () => {
    submitConfig(
      { ...Object.keys(protocols).reduce((acc, key) => ({ ...acc, [key]: { enabled: protocols[key] } }), {}) },
      "Protocol configuration saved successfully"
    );
  };

  const onSubmitIpRange = () => {
    submitConfig(
      { IP_RANGE: ipRange },
      "IP range configuration saved successfully"
    );
  };

  const onSubmitEntertainmentFps = () => {
    submitConfig(
      { entertainment_fps: entertainment_fps },
      "Entertainment FPS configuration saved successfully"
    );
  }

  const onSubmitScanOnHostIP = () => {
    submitConfig(
      { scanonhostip: scanOnHostIP },
      "Scan on host IP configuration saved successfully"
    );
  };

  // Render
  return (
    <div className="inner">
      <CardGrid options="main">
        <GlassContainer options="spacer">
          <PageContent>
            <div className="headline">Add extra port for searching</div>
            <p>This wil make the bridge search on other ports.</p>
            <p>If disabled the bridge wil only search on port 80.</p>
            <p>The standard port is 80, always include port 80.</p>
            <p>To add ports separate the ports with "," ex: 80,81,82</p>
            <form className="add-form">
              <div className="form-control">
                <FlipSwitch
                  id="ports"
                  value={portConfig.enabled}
                  onChange={(e) => handlePortConfigChange("enabled", e)}
                  checked={portConfig.enabled}
                  label="Enable"
                  position="right"
                />
              </div>
              <div className="form-control">
                <GenericText
                  label="Port"
                  type="text"
                  placeholder="Additional ports"
                  value={portConfig.ports}
                  onChange={(e) => handlePortConfigChange("ports", e)}
                />
              </div>
              <div className="form-control">
                <GenericButton
                  value="Save"
                  color="blue"
                  size=""
                  type="submit"
                  onClick={onSubmitPort}
                />
              </div>
            </form>
          </PageContent>
        </GlassContainer>

        <GlassContainer options="spacer">
          <PageContent>
            <div className="headline">Search IP Range Config</div>
            <p>Set IP range for light search.</p>
            <GenericText
              label={`IP Range Start (you can change ${ip.split(".")[0]}.${ip.split(".")[1]}.xxx.yyy)`}
              type="text"
              value={`${ip.split(".")[0]}.${ip.split(".")[1]}.${ipRange.SUB_IP_RANGE_START}.${ipRange.IP_RANGE_START}`}
              onChange={(e) => handleIpRangeChange(e, "start")}
            />
            <GenericText
              label={`IP Range End (you can change ${ip.split(".")[0]}.${ip.split(".")[1]}.XXX.YYY)`}
              type="text"
              value={`${ip.split(".")[0]}.${ip.split(".")[1]}.${ipRange.SUB_IP_RANGE_END}.${ipRange.IP_RANGE_END}`}
              onChange={(e) => handleIpRangeChange(e, "end")}
            />
            <div className="form-control">
              <GenericButton
                value="Save"
                color="blue"
                size=""
                type="submit"
                onClick={onSubmitIpRange}
              />
            </div>
          </PageContent>
        </GlassContainer>

        <GlassContainer options="spacer">
          <PageContent>
            <div className="headline">Search Protocol Config</div>
            <p>Set which protocol to find.</p>
            <form className="add-form">
              {Object.keys(protocols).map((key) => (
                <FlipSwitch
                  key={key}
                  id={key}
                  value={protocols[key]}
                  onChange={(e) => handleProtocolChange(key, e)}
                  checked={protocols[key]}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  position="right"
                />
              ))}
            </form>
            <div className="form-control">
              <GenericButton
                value="Save"
                color="blue"
                size=""
                type="submit"
                onClick={onSubmitProtocols}
              />
            </div>
          </PageContent>
        </GlassContainer>

        <GlassContainer options="spacer">
          <PageContent>
            <div className="headline">Search on host IP</div>
            <form className="add-form">
              <FlipSwitch
                id="ScanOnHostIP"
                value={scanOnHostIP}
                onChange={(e) => setScanOnHostIP(e)}
                checked={scanOnHostIP}
                label="Enable"
                position="right"
              />
              <GenericButton
                value="Save"
                color="blue"
                size=""
                type="submit"
                onClick={onSubmitScanOnHostIP}
              />
            </form>
          </PageContent>
        </GlassContainer>

        <GlassContainer options="spacer">
          <PageContent>
            <div className="headline">Entertainment FPS</div>
            <p>Set the FPS for entertainment mode.</p>
            <GenericText
              label="FPS"
              type="number"
              value={entertainment_fps}
              onChange={(e) => setEntertainmentFps(e)}
            />
            <div className="form-control">
              <GenericButton
                value="Save"
                color="blue"
                size=""
                type="submit"
                onClick={onSubmitEntertainmentFps}
              />
            </div>
          </PageContent>
        </GlassContainer>
      </CardGrid>
    </div>
  );
};

export default Settings;
