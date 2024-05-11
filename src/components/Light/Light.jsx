import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import Select from "react-select";
import { toast } from "react-hot-toast";

import GlassContainer from "../GlassContainer/GlassContainer";
import { HueIcons } from "../../static/icons/hass-hue-icons";
import IconButton from "../IconButton/IconButton";
import LightUpdate from "../LightUpdate/LightUpdate";

import "react-confirm-alert/src/react-confirm-alert.css";

import "./light.scss";

const Light = ({ HOST_IP, api_key, id, light, modelIds, lightsCatalog }) => {
  const deleteAlert = () => {
    confirmAlert({
      title: "Delete light " + light["name"],
      message: "Are you sure to do this?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteLight(),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const deleteLight = () => {
    axios
      .delete(`${HOST_IP}/api/${api_key}/lights/${id}`)
      .then((fetchedData) => {
        console.log(fetchedData.data);
        toast.success("Light successfully deleted");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error occured, check browser console");
      });
  };

  const alertLight = () => {
    axios
      .put(`${HOST_IP}/api/${api_key}/lights/${id}/state`, { alert: "select" })
      .then((fetchedData) => {
        console.log(fetchedData.data);
        toast.success("Light alerted");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error occured, check browser console");
      });
  };

  const setModelId = (modelid) => {
    console.log({ [id]: modelid });
    axios
      .post(`${HOST_IP}/light-types`, { [id]: modelid })
      .then((fetchedData) => {
        console.log(fetchedData.data);
        toast.success("Modelid updated");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error occured, check browser console");
      });
  };

  let options = modelIds.map(function (modelid) {
    return { value: modelid, label: modelid };
  });

  return (
    <GlassContainer>
      <div className="light">
        <div className="row1">
          <div className="icon">
            <HueIcons
              type={"light-" + light["config"]["archetype"]}
              color="#eeeeee"
              onClick={() => alertLight()}
            />
          </div>

          <div className="text">{light["name"]} </div>
        </div>
        <div className="row2">
          <div className="form-control">
            <Select
              defaultValue={{ value: light["modelid"], label: light["modelid"] }}
              options={options}
              placeholder={light["modelid"]}
              onChange={(e) => setModelId(e.value)}
              menuPortalTarget={document.body}
              menuPosition={"fixed"}
            />
          </div>
          <LightUpdate light={light} lightsCatalog={lightsCatalog} />
        </div>
        <div className="row3">
          <ul>
            <li>Protocol: {light["protocol"]}</li>
            {[
              "native",
              "native_multi",
              "native_single",
              "wled",
              "esphome",
            ].includes(light["protocol"]) ? (
              <li
                style={{ cursor: "pointer" }}
                onClick={() =>
                  window.open("http://" + light["protocol_cfg"]["ip"], "_blank")
                }
              >
                IP: {light["protocol_cfg"]["ip"]}
              </li>
            ) : (
              <li>IP: {light["protocol_cfg"]["ip"]}</li>
            )}
          </ul>
          <IconButton
            iconName="MdDeleteForever"
            title="Delete"
            color="red"
            onClick={() => deleteAlert()}
          />
        </div>

        {light["state"]["reachable"] || <div className="label">Offline</div>}
      </div>
    </GlassContainer>
  );
};

export default Light;
