pragma solidity 0.6.1;
import "./IAuthorization.sol";
import "./ITreatmentProviderManager.sol";

contract TreatmentProvider is ITreatmentProviderManager {
    IAuthorization authorityContract;
    string stringStore;

    mapping(address => bool) isProvider;
    mapping(address => address[]) providerTrustees;
    mapping(address => mapping(address => uint256)) providerTrusteesIndex;
    mapping(address => mapping(address => bool)) isProviderTrustee;

    modifier senderIsAuthority() {
        require(
            authorityContract.isAuthorized(msg.sender),
            "Sender not trusted by Authority"
        );
        _;
    }

    modifier targetIsTrustedBySender(address _target) {
        require(
            isProviderTrustee[_target][msg.sender],
            "Provider is not a trusted by the sender"
        );
        _;
    }

    modifier targetIsNotTrustedBySender(address _target) {
        require(
            !isProviderTrustee[_target][msg.sender],
            "Provider is allready trusted by the sender"
        );
        _;
    }

    modifier targetIsProvider(address _target) {
        require(isProvider[_target], "Target is not a provider");
        _;
    }

    modifier targetIsNotProvider(address _target) {
        require(!isProvider[_target], "Target is a provider");
        _;
    }

    constructor(address _address) public {
        authorityContract = IAuthorization(_address);
    }

    function isTrustedProvider(address _address)
        external
        view
        override
        returns (bool)
    {
        if (!isProvider[_address]) {
            return false;
        }

        uint256 numTrustees = providerTrustees[_address].length;

        for (uint256 i = 0; i < numTrustees; i++) {
            if (authorityContract.isAuthorized(providerTrustees[_address][i])) {
                return true;
            }
        }

        return false;
    }

    function addSenderAsProvider()
        external
        override
        targetIsNotProvider(msg.sender)
    {
        isProvider[msg.sender] = true;
    }

    function removeSenderAsProvider()
        external
        override
        targetIsProvider(msg.sender)
    {
        delete isProvider[msg.sender];
        for (uint256 i = 0; i < providerTrustees[msg.sender].length; i++) {
            address trustee = providerTrustees[msg.sender][i];
            delete providerTrusteesIndex[msg.sender][trustee];
            delete isProviderTrustee[msg.sender][trustee];
        }
        delete providerTrustees[msg.sender];
    }

    function addTrustInProvider(address _address)
        external
        override
        targetIsProvider(_address)
        senderIsAuthority
        targetIsNotTrustedBySender(_address)
    {
        uint256 trusteeNumber = providerTrustees[_address].length;
        providerTrustees[_address].push(msg.sender);
        isProviderTrustee[_address][msg.sender] = true;
        providerTrusteesIndex[_address][msg.sender] = trusteeNumber;
    }

    function removeTrustInProvider(address _address)
        external
        override
        targetIsProvider(_address)
        targetIsTrustedBySender(_address)
    {
        uint256 indexOfTrustee = providerTrusteesIndex[_address][msg.sender];
        uint256 numTrustees = providerTrustees[_address].length;

        // Swap the trustee to remove with the last one.
        if ((numTrustees > 1) && (indexOfTrustee != numTrustees - 1)) {
            address lastTrustee = providerTrustees[_address][numTrustees - 1];
            providerTrustees[_address][indexOfTrustee] = lastTrustee;
            providerTrusteesIndex[_address][lastTrustee] = indexOfTrustee;
        }

        providerTrustees[_address].pop();
        delete isProviderTrustee[_address][msg.sender];
        delete providerTrusteesIndex[_address][msg.sender];
    }

}
