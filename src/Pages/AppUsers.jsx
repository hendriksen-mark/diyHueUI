import CardGrid from "../components/CardGrid/CardGrid";
import User from "../components/User/User";

const Config = ({ HOST_IP, API_KEY, CONFIG }) => {
  const whitelist = CONFIG.apiUsers;
// #region HTML
  return (
      <div className="inner">
        <CardGrid>
          {Object.entries(whitelist).map(([id, user]) => (
            <User
              key={id}
              HOST_IP={HOST_IP}
              api_key={API_KEY}
              id={id}
              user={user}
              whitelist={whitelist}
            />
          ))}
        </CardGrid>
      </div>
  );
};

export default Config;
