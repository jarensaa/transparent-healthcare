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
  authorities: string[];
  proposalEvents: ProposalEvent[];
  proposalEventsMap: Map<number, ProposalEvent>;
};

type AuthorityContextUpdate = {
  proposalEvents?: ProposalEvent[];
  authorities?: string[];
};

const AuthorityContext = React.createContext<AuthorityContext>({
  authorities: [],
  proposalEvents: [],
  proposalEventsMap: new Map()
});

const AuthorityContextProvider: FunctionComponent = ({ children }) => {
  const [authorityState, setAuthorityState] = useState<AuthorityContext>({
    authorities: [],
    proposalEvents: [],
    proposalEventsMap: new Map()
  });
  const stomp = useContext(StompContext);

  const addToAuthorityState = (params: AuthorityContextUpdate) => {
    setAuthorityState(previousState => {
      const updatedState: AuthorityContext = {
        authorities: previousState.authorities,
        proposalEvents: previousState.proposalEvents,
        proposalEventsMap: previousState.proposalEventsMap
      };

      if (params.authorities) {
        updatedState.authorities = [
          ...updatedState.authorities,
          ...params.authorities
        ];
      }

      if (params.proposalEvents) {
        updatedState.proposalEvents = [
          ...updatedState.proposalEvents,
          ...params.proposalEvents
        ];
        params.proposalEvents.forEach(proposal =>
          updatedState.proposalEventsMap.set(proposal.id!, proposal)
        );
      }

      return updatedState;
    });
  };

  useEffect(() => {
    fetch(endpoints.authority.base)
      .then(res => res.json())
      .then((res: string[]) => addToAuthorityState({ authorities: res }));
  }, []);

  useEffect(() => {
    fetch(endpoints.authority.proposals)
      .then(res => res.json())
      .then((res: ProposalEvent[]) =>
        addToAuthorityState({ proposalEvents: res })
      );
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
