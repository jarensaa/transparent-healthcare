pragma solidity 0.6.1;
import "./IAuthorization.sol";


contract AuthorityManager is IAuthorization {

  struct Proposal {
    uint proposalType;
    address target;
    bool isActive;
    address[] voters;
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
    delete authorities[_address];
    numAuthorities--;
  }

  function getLastProposalSubmitted(address _address) public view returns (uint) {
    return lastProposalSubmitted[_address];
  }

  function isAuthorized(address _address) external override view returns (bool) {
    return authorities[_address];
  }

  function getNumAuthorities() public view returns (uint) {
    return numAuthorities;
  }

  function propose(uint _proposalType, address _targetAddress) public authorized {
    if(_proposalType == 1) {
      require(authorities[_targetAddress] == false, "Target is allready an authority");
    } else if(_proposalType == 2) {
      require(authorities[_targetAddress] == true, "Target is not an authority");
    } else revert("Unsupported proposal type");

    Proposal storage proposal = proposals[++proposalCount];
    proposal.proposalType = _proposalType;
    proposal.target = _targetAddress;
    proposal.isActive = true;

    voteOnProposal(proposalCount);
    lastProposalSubmitted[msg.sender] = proposalCount;
  }

  function enactProposal(uint id) public {
    require(proposals[id].isActive, "Proposal does not exist or has been enacted");

    uint votes;

    for (uint i = 0; i < proposals[id].voters.length; i++) {
      if(authorities[proposals[id].voters[i]]) {
        votes++;
      }
    }

    require(votes > (numAuthorities / 2), "Proposal does not have enough votes to be enacted");

    if(proposals[id].proposalType == 1) {
      addAuthority(proposals[id].target);
    }
    else if(proposals[id].proposalType == 2) {
      removeAuthority(proposals[id].target);
    }

    delete proposals[id]; //Delete refunds gas, making an enact call cheap if it's legitimate, and expensive if it's not.
  }

  function voteOnProposal(uint id) public authorized {
    require(proposals[id].isActive, "Proposal does not exist or has been enacted");
    require(proposals[id].hasVoted[msg.sender] == false, "Vote has allready been cast by sender");
    proposals[id].hasVoted[msg.sender] = true;
    proposals[id].voters.push(msg.sender);
  }
}
