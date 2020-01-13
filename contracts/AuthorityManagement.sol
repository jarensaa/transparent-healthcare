pragma solidity ^0.6.1;

contract AuthorityManagement {

  struct Proposal {
    uint proposalType;
    address target;
    uint votes;
    bool isClaimed;
    mapping (address => bool) hasVoted;
  }

  uint proposalCount;
  uint numAuthorities;
  mapping (address => bool) public authorities;
  mapping (uint => Proposal) proposals;
  mapping (address => uint ) public lastProposalSubmitted;

  modifier authorized() {
    require(authorities[msg.sender], "Unauthorized");
    _;
  }

  constructor() public {
    authorities[msg.sender] = true;
    numAuthorities = 1;
  }

  function addAuthority(address _address) private {
    authorities[_address] = true;
    numAuthorities++;
  }

  function removeAuthority(address _address) private {
    authorities[_address] = false;
    numAuthorities--;
  }

  function getLastProposalSubmitted(address _address) public view returns (uint) {
    return lastProposalSubmitted[_address];
  }

  function isAuthorized(address _address) public view returns (bool) {
    return authorities[_address];
  }

  function getNumAuthorities() public view returns (uint) {
    return numAuthorities;
  }

  function propose(uint proposalType, address targetAddress) public authorized {
    if(proposalType == 1) {
      require(authorities[targetAddress] == false, "Target is allready an authority");
    } else if(proposalType == 2) {
      require(authorities[targetAddress] == true, "Target is not an authority");
    } else revert("Unsupported proposal type");

    proposals[++proposalCount] = Proposal(proposalType, targetAddress, 0, false);
    proposals[proposalCount].hasVoted[msg.sender] = true;
    proposals[proposalCount].votes++;
    lastProposalSubmitted[msg.sender] = proposalCount;
  }

  function enactProposal(uint id) public {
    require(proposals[id].isClaimed == false, "Proposal does not exist or has been enacted");
    require(proposals[id].votes > (numAuthorities / 2), "Proposal does not have enough votes to be enacted");
    proposals[id].isClaimed = true;

    if(proposals[id].proposalType == 1) {
      addAuthority(proposals[id].target);
    }

    if(proposals[id].proposalType == 2) {
      removeAuthority(proposals[id].target);
    }
  }

  function voteOnProposal(uint id) public authorized {
    require(proposals[id].isClaimed == false, "Proposal has been enacted");
    require(proposals[id].hasVoted[msg.sender] == false, "Vote has allready been cast by sender");
    proposals[proposalCount].hasVoted[msg.sender] = true;
    proposals[proposalCount].votes++;
  }

  uint storedData;

  function set(uint x) public authorized {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
