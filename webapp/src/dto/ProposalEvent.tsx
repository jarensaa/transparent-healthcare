type ProposalEvent = {
  proposer: string;
  subject: string;
  type: number;
  id?: number;
  voters?: string[];
  isActive?: boolean;
};

export default ProposalEvent;
