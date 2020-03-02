const getStringFormatedProposalType = (type: number) => {
  switch (type) {
    case 1:
      return "Add authority";

    case 2:
      return "Remove authority";
  }
};

export default getStringFormatedProposalType;
