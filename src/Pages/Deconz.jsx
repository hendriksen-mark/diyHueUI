import { useState, useEffect } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";

import FlipSwitch from "../components/FlipSwitch/FlipSwitch";
import GenericButton from "../components/GenericButton/GenericButton";
import GenericText from "../components/GenericText/GenericText";
import GlassContainer from "../components/GlassContainer/GlassContainer";
import PageContent from "../components/PageContent/PageContent";
import CardGrid from "../components/CardGrid/CardGrid";

const Deconz = ({ HOST_IP, API_KEY, CONFIG }) => {
  const [enable, setEnable] = useState(CONFIG.config.deconz?.enabled || false);
  const [deconzHost, setDeconzHost] = useState(CONFIG.config.deconz?.deconzHost || "192.168.x.x");
  const [deconzPort, setDeconzPort] = useState(CONFIG.config.deconz?.deconzPort || 80);
  const [deconzUser, setDeconzUser] = useState(CONFIG.config.deconz?.deconzUser || "");
  const [isModified, setIsModified] = useState(false); // Track user modifications

  useEffect(() => {
    if (!isModified) {
      setEnable(CONFIG.config.deconz?.enabled || false);
      setDeconzHost(CONFIG.config.deconz?.deconzHost || "192.168.x.x");
      setDeconzPort(CONFIG.config.deconz?.deconzPort || 80);
      setDeconzUser(CONFIG.config.deconz?.deconzUser || "");
    }
  }, [CONFIG, isModified]);

  const handleEnable = (value) => {
    setEnable(value);
    setIsModified(true); // Mark as modified
  };

  const handleDeconzHostChange = (value) => {
    setDeconzHost(value);
    setIsModified(true); // Mark as modified
  };

  const handleDeconzPortChange = (value) => {
    setDeconzPort(parseInt(value));
    setIsModified(true); // Mark as modified
  };

  const pairDeconz = () => {
    axios
      .post(
        `http://${deconzHost}:${deconzPort}/api`,
        { devicetype: "diyhue#bridge" },
        { timeout: 2000 }
      )
      .then((result) => {
        if ("success" in result.data[0]) {
          setDeconzUser(result.data[0]["success"]["username"]);
          axios
            .put(`${HOST_IP}/api/${API_KEY}/config`, {
              deconz: {
                enabled: enable,
                deconzHost: deconzHost,
                deconzPort: deconzPort,
                deconzUser: result.data[0]["success"]["username"],
              },
            })
            .then((fetchedData) => {
              //console.log(fetchedData.data);
              toast.success("Connected, service restart required.");
            });
        } else {
          toast.error(result.data[0]["error"]["description"]);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

// #region HTML
  return (
    <div className="inner">
      <CardGrid options="main">
        <GlassContainer>
          <PageContent>
            <div className="headline">Deconz Config</div>
            <form className="add-form">
              <FlipSwitch
                id="Deconz"
                value={enable}
                onChange={(e) => handleEnable(e)}
                checked={enable}
                label="Enable"
                position="right"
              />
              <div className="form-control">
                <GenericText
                  label="Deconz host"
                  type="text"
                  placeholder="Deconz host"
                  value={deconzHost}
                  onChange={(e) => handleDeconzHostChange(e)}
                />
              </div>
              <div className="form-control">
                <GenericText
                  label="Deconz port"
                  type="number"
                  placeholder="Deconz port"
                  value={deconzPort}
                  onChange={(e) => handleDeconzPortChange(e)}
                />
              </div>
              <div className="form-control">
                <GenericText
                  label="Deconz User"
                  type="text"
                  placeholder="Automatically populated"
                  readOnly={true}
                  value={deconzUser}
                />
              </div>
              <div className="form-control">
                <GenericButton
                  value={
                    typeof deconzUser === "string" && deconzUser.length > 0
                      ? "Pair again"
                      : "Pair"
                  }
                  color="blue"
                  size=""
                  type="submit"
                  onClick={() => pairDeconz()}
                />
              </div>
            </form>
          </PageContent>
        </GlassContainer>
      </CardGrid>
    </div>
  );
};

export default Deconz;
