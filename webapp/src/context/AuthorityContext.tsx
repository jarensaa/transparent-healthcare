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
import ProposalEnactedEvent from "../dto/ProposalEnactedEvent";

type AuthorityContext = {
  authorities: string[];
  proposalEvents: ProposalEvent[];
  proposalEventsMap: Map<number, ProposalEvent>;
};

type AuthorityContextUpdate = {
  proposalEvents?: ProposalEvent[];
  authoritiesToAdd?: string[];
  authoritiesToSet?: string[];
  proposalVoteUpdate?: {
    id: number;
    voters: string[];
  };
  proposalEnactedUpdate?: number;
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

      if (params.authoritiesToAdd) {
        updatedState.authorities = [
          ...updatedState.authorities,
          ...params.authoritiesToAdd
        ];
      }

      if (params.authoritiesToSet) {
        updatedState.authorities = params.authoritiesToSet;
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

      if (params.proposalVoteUpdate) {
        const proposalPrevState = updatedState.proposalEventsMap.get(
          params.proposalVoteUpdate.id
        );
        if (proposalPrevState) {
          proposalPrevState.voters = params.proposalVoteUpdate.voters;
          updatedState.proposalEventsMap.set(
            params.proposalVoteUpdate.id,
            proposalPrevState
          );
        }
      }

      if (params.proposalEnactedUpdate) {
        const prevState = updatedState.proposalEventsMap.get(
          params.proposalEnactedUpdate
        );

        if (prevState) {
          prevState.isActive = false;
          updatedState.proposalEventsMap.set(
            params.proposalEnactedUpdate,
            prevState
          );
        }
      }

      return updatedState;
    });
  };

  useEffect(() => {
    fetch(endpoints.authority.base)
      .then(res => res.json())
      .then((res: string[]) => addToAuthorityState({ authoritiesToSet: res }));
  }, []);

  useEffect(() => {
    fetch(endpoints.authority.proposals)
      .then(res => res.json())
      .then(res => {
        return res;
      })
      .then((res: ProposalEvent[]) =>
        addToAuthorityState({ proposalEvents: res })
      );
  }, []);

  useEffect(() => {
    stomp.watch(topics.proposals.new).subscribe(message => {
      const proposal: ProposalEvent = JSON.parse(message.body);
      addToAuthorityState({ proposalEvents: [proposal] });
    });
    stomp.watch(topics.proposals.vote).subscribe(message => {
      const proposal: ProposalEvent = JSON.parse(message.body);
      addToAuthorityState({
        proposalVoteUpdate: { id: proposal.id!, voters: proposal.voters! }
      });
    });
    stomp.watch(topics.proposals.enacted).subscribe(message => {
      const proposalEnactedEvent: ProposalEnactedEvent = JSON.parse(
        message.body
      );
      addToAuthorityState({
        proposalEnactedUpdate: proposalEnactedEvent.proposalId
      });

      fetch(endpoints.authority.base)
        .then(res => res.json())
        .then((res: string[]) =>
          addToAuthorityState({ authoritiesToSet: res })
        );
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
