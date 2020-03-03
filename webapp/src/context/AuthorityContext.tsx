import React, {
  useState,
  FunctionComponent,
  useContext,
  useEffect
} from "react";
import StompContext from "./StompContext";
import ProposalEvent from "../dto/ProposalEvent";
import endpoints from "../config/endpoints";
import topics from "../config/topics";

type AuthorityContext = {
  proposalEvents: ProposalEvent[];
  proposalEventsMap: Map<number, ProposalEvent>;
};

type AuthorityContextUpdate = {
  proposalEvents?: ProposalEvent[];
};

const AuthorityContext = React.createContext<AuthorityContext>({
  proposalEvents: [],
  proposalEventsMap: new Map()
});

const AuthorityContextProvider: FunctionComponent = ({ children }) => {
  const [authorityState, setAuthorityState] = useState<AuthorityContext>({
    proposalEvents: [],
    proposalEventsMap: new Map()
  });
  const stomp = useContext(StompContext);

  const addToAuthorityState = (params: AuthorityContextUpdate) => {
    setAuthorityState(previousState => {
      let updatedProposalEvents = previousState.proposalEvents;
      let updatedProposalEventsMap = previousState.proposalEventsMap;

      if (params.proposalEvents) {
        updatedProposalEvents = [
          ...updatedProposalEvents,
          ...params.proposalEvents
        ];
        params.proposalEvents.forEach(proposal =>
          updatedProposalEventsMap.set(proposal.id!, proposal)
        );
      }

      return {
        proposalEvents: updatedProposalEvents,
        proposalEventsMap: updatedProposalEventsMap
      };
    });
  };

  useEffect(() => {
    fetch(endpoints.authority.proposals)
      .then(res => res.json())
      .then((res: ProposalEvent[]) => {
        addToAuthorityState({ proposalEvents: res });
      });
  }, []);

  useEffect(() => {
    stomp.watch(topics.proposals).subscribe(message => {
      const proposal: ProposalEvent = JSON.parse(message.body);
      addToAuthorityState({ proposalEvents: [proposal] });
    });
  }, [stomp]);

  return (
    <AuthorityContext.Provider value={authorityState}>
      {children}
    </AuthorityContext.Provider>
  );
};

export { AuthorityContextProvider };
export default AuthorityContext;
