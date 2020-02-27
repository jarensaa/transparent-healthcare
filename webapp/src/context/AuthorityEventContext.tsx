import React, {
  useState,
  FunctionComponent,
  useContext,
  useEffect
} from "react";
import StompContext from "./StompContext";
import ProposalEvent from "../dto/ProposalEvent";

type AuthorityEventContext = {
  proposalEvents: ProposalEvent[];
};

const AuthorityEventContext = React.createContext<AuthorityEventContext>({
  proposalEvents: []
});

const AuthorityEventContextProvider: FunctionComponent = ({ children }) => {
  const [proposalEvents, setProposalEvents] = useState<ProposalEvent[]>([]);
  const stomp = useContext(StompContext);

  useEffect(() => {
    stomp.watch("/authority/proposal").subscribe(message => {
      const propsal: ProposalEvent = JSON.parse(message.body);
      setProposalEvents(previousProposals => [...previousProposals, propsal]);
    });
  }, []);

  return (
    <AuthorityEventContext.Provider value={{ proposalEvents: proposalEvents }}>
      {children}
    </AuthorityEventContext.Provider>
  );
};

export { AuthorityEventContextProvider };
export default AuthorityEventContext;
