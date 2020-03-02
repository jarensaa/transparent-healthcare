type ProposalEvent = {
  proposer: string;
  subject: string;
  type: number;
  id?: number;
  voters?: string[];
};

export default ProposalEvent;
