import React, {
  useState,
  FunctionComponent,
  useContext,
  useEffect
} from "react";
import StompContext from "./StompContext";
import ProposalEvent from "../dto/ProposalEvent";
import endpoints from "../config/endpoints";

type AuthorityEventContext = {
  proposalEvents: ProposalEvent[];
  proposalEventsMap: Map<number, ProposalEvent>;
};

const AuthorityEventContext = React.createContext<AuthorityEventContext>({
  proposalEvents: [],
  proposalEventsMap: new Map()
});

const AuthorityEventContextProvider: FunctionComponent = ({ children }) => {
  const [proposalEvents, setProposalEvents] = useState<ProposalEvent[]>([]);
  const [proposalEventsMap, setProposalEventsMap] = useState<
    Map<number, ProposalEvent>
  >(new Map());
  const stomp = useContext(StompContext);

  useEffect(() => {
    fetch(endpoints.authority.proposals)
      .then(res => res.json())
      .then((res: ProposalEvent[]) => {
        const proposalMap: Map<number, ProposalEvent> = res.reduce(
          (accumulator, proposal) => accumulator.set(proposal.id!, proposal),
          new Map()
        );
        setProposalEventsMap(proposalMap);
        setProposalEvents(res);
      });

    stomp.watch("/authority/proposal").subscribe(message => {
      const proposal: ProposalEvent = JSON.parse(message.body);
      setProposalEvents(previousProposals => [...previousProposals, proposal]);
      setProposalEventsMap(previousMap =>
        previousMap.set(proposal.id!, proposal)
      );
    });
  }, [stomp]);

  return (
    <AuthorityEventContext.Provider
      value={{
        proposalEvents: proposalEvents,
        proposalEventsMap: proposalEventsMap
      }}
    >
      {children}
    </AuthorityEventContext.Provider>
  );
};

export { AuthorityEventContextProvider };
export default AuthorityEventContext;
