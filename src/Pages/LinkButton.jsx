import axios from "axios";
import { toast } from "react-hot-toast";

import GlassContainer from "../components/GlassContainer/GlassContainer";
import PageContent from "../components/PageContent/PageContent";
import GenericButton from "../components/GenericButton/GenericButton";
import CardGrid from "../components/CardGrid/CardGrid";

export default function LinkButton({ HOST_IP, API_KEY }) {
  //console.log(API_KEY)

  const pushLinkButton = () => {
    axios
      .get(`${HOST_IP}/api/${API_KEY}/config`)
      .then((result) => {
        axios
          .put(`${HOST_IP}/api/${API_KEY}/config`, {
            linkbutton: { lastlinkbuttonpushed: ((new Date(result.data["localtime"]).getTime() / 1000).toFixed(0)) | 0 },
          })
          .then((fetchedData) => {
            //console.log(fetchedData.data);
            toast.success("Pairing is allowed for 30 seconds");
          })
          .catch((error) => {
            console.error(error);
            toast.error(`Error occurred: ${error.message}`);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="inner">
      <CardGrid options="main">
        <GlassContainer>
          <PageContent>
            <div className="headline">Link Button</div>
            <p>Push this button to accept the pairing of the requested app</p>
            <div className="form-control">
              <GenericButton
                value="Link App"
                color="blue"
                size=""
                onClick={() => pushLinkButton()}
              />
            </div>
          </PageContent>
        </GlassContainer>
      </CardGrid>
    </div>
  );
}
