pragma solidity ^0.6.1;
import "./iface/IAuthorization.sol";

contract AuthorityManager is IAuthorization {
    struct Proposal {
        uint256 proposalType;
        address target;
        bool isActive;
        address[] voters;
        mapping(address => bool) hasVoted;
    }

    uint256 proposalCount;
    mapping(address => bool) public authorities;
    mapping(uint256 => Proposal) proposals;
    mapping(address => uint256) public lastProposalSubmitted;

    mapping(address => uint256) authorityToRegistryIndex;

    address[] authorityRegistry;

    modifier authorized() {
        require(authorities[msg.sender], "Unauthorized");
        _;
    }

    event ProposalEvent(
        address _proposer,
        address _proposalSubject,
        uint256 _proposalType,
        uint256 _proposalID
    );

    event ProposalVoteEvent(uint256 _proposalID, address _voter);

    event ProposalEnactedEvent(uint256 _proposalID);

    event NewAuthorityEvent(address _authority);

    event RemovedAuthorityEvent(address _authority);

    constructor() public {
        authorities[msg.sender] = true;
        authorityRegistry.push(msg.sender);
        authorityToRegistryIndex[msg.sender] = 0;
    }

    function addAuthority(address _address) private {
        authorities[_address] = true;
        authorityRegistry.push(_address);
        authorityToRegistryIndex[_address] = authorityRegistry.length - 1;
        emit NewAuthorityEvent(_address);
    }

    function removeAuthority(address _address) private {
        uint256 authorityIndex = authorityToRegistryIndex[_address];

        // Swap the trustee to remove with the last one.
        if (
            (authorityRegistry.length > 1) &&
            (authorityIndex != authorityRegistry.length - 1)
        ) {
            address lastAuthority = authorityRegistry[authorityRegistry.length -
                1];
            authorityRegistry[authorityIndex] = lastAuthority;
            authorityToRegistryIndex[lastAuthority] = authorityIndex;
        }

        authorityRegistry.pop();
        delete authorityToRegistryIndex[_address];
        delete authorities[_address];
        emit RemovedAuthorityEvent(_address);
    }

    function getLastProposalSubmitted(address _address)
        public
        view
        returns (uint256)
    {
        return lastProposalSubmitted[_address];
    }

    function isAuthorized(address _address)
        external
        view
        override
        returns (bool)
    {
        return authorities[_address];
    }

    function getNumAuthorities() external view returns (uint256) {
        return authorityRegistry.length;
    }

    function getAuthorities() external view returns (address[] memory) {
        return authorityRegistry;
    }

    function getProposal(uint256 _proposalID)
        external
        view
        returns (uint256, address, address[] memory)
    {
        require(proposals[_proposalID].isActive, "No active proposal");
        return (
            proposals[_proposalID].proposalType,
            proposals[_proposalID].target,
            proposals[_proposalID].voters
        );
    }

    function getProposalCount() external view returns (uint256) {
        return proposalCount;
    }

    function propose(uint256 _proposalType, address _targetAddress)
        public
        authorized
    {
        if (_proposalType == 1) {
            require(
                authorities[_targetAddress] == false,
                "Target is allready an authority"
            );
        } else if (_proposalType == 2) {
            require(
                authorities[_targetAddress] == true,
                "Target is not an authority"
            );
        } else revert("Unsupported proposal type");

        Proposal storage proposal = proposals[++proposalCount];
        proposal.proposalType = _proposalType;
        proposal.target = _targetAddress;
        proposal.isActive = true;

        voteOnProposal(proposalCount);
        lastProposalSubmitted[msg.sender] = proposalCount;
        emit ProposalEvent(
            msg.sender,
            _targetAddress,
            _proposalType,
            proposalCount
        );
    }

    function enactProposal(uint256 id) public {
        require(
            proposals[id].isActive,
            "Proposal does not exist or has been enacted"
        );

        uint256 votes;

        for (uint256 i = 0; i < proposals[id].voters.length; i++) {
            if (authorities[proposals[id].voters[i]]) {
                votes++;
            }
        }

        require(
            votes > (authorityRegistry.length / 2),
            "Proposal does not have enough votes to be enacted"
        );

        if (proposals[id].proposalType == 1) {
            addAuthority(proposals[id].target);
        } else if (proposals[id].proposalType == 2) {
            removeAuthority(proposals[id].target);
        }

        emit ProposalEnactedEvent(id);
        delete proposals[id]; //Delete refunds gas, making an enact call cheap if it's legitimate, and expensive if it's not.
    }

    function voteOnProposal(uint256 id) public authorized {
        require(
            proposals[id].isActive,
            "Proposal does not exist or has been enacted"
        );
        require(
            proposals[id].hasVoted[msg.sender] == false,
            "Vote has allready been cast by sender"
        );
        proposals[id].hasVoted[msg.sender] = true;
        proposals[id].voters.push(msg.sender);
        emit ProposalVoteEvent(id, msg.sender);
    }
}
