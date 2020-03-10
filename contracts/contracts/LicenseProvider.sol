pragma solidity ^0.6.1;
import "./iface/IAuthorization.sol";
import "./iface/ILicenseProviderManager.sol";

contract LicenseProvider is ILicenseProviderManager {
    struct License {
        address trustingIssuer;
        address trustingProvider;
    }

    IAuthorization authorityContract;

    mapping(address => License) licenses;
    mapping(address => bool) isIssuer;
    mapping(address => bool) isProvider;
    mapping(address => address) issuerTrustedByAuthority;
    mapping(address => address) providerTrustedByAuthority;
    mapping(address => mapping(address => bool)) issuerMoveProposed;
    mapping(address => mapping(address => bool)) providerMoveProposed;

    address[] licenseAddresses;
    address[] licenseIssuers;
    address[] licenseProvider;

    modifier addressIsLicense(address _address) {
        require(
            licenses[_address].trustingIssuer != address(0x0),
            "Target address does not have a license"
        );
        _;
    }

    modifier addressIsIssuer(address _address) {
        require(isIssuer[_address], "Target is not an issuer");
        _;
    }

    modifier addressIsNotIssuer(address _address) {
        require(!isIssuer[_address], "Target is allready a registed issuer");
        _;
    }

    modifier addressIsProvider(address _address) {
        require(isProvider[_address], "Target is not a provider");
        _;
    }

    modifier addressIsNotProvider(address _address) {
        require(
            !isProvider[_address],
            "Target is allready a registed provider"
        );
        _;
    }

    modifier addressIsAuthority(address _address) {
        require(authorityContract.isAuthorized(msg.sender));
        _;
    }

    event NewLicense(address _license, address _issuer);
    event RemovedLicense(address _license);
    event NewLicenseIssuer(address _issuer);
    event RemovedLicenseIssuer(address _issuer);
    event TrustInIssuerAdded(address _issuer, address _authority);
    event TrustInIssuerRemoved(address _issuer, address _authority);
    event IssuerMoveProposalAdded(address _license, address _issuer);
    event IssuerMoveApproved(address _license, address _issuer);
    event ProviderRegistered(address _provider);
    event ProviderRemoved(address _provider);
    event TrustInProviderAdded(address _provider, address _authority);
    event TrustInProviderRemoved(address _provider, address _authority);
    event ProviderMoveProposalAdded(address _license, address _provider);
    event ProviderMoveApproved(address _license, address _provider);

    constructor(address _address) public {
        authorityContract = IAuthorization(_address);
    }

    function isLicenseTrusted(address _licenseAddress)
        external
        view
        override
        returns (bool)
    {
        address provider = licenses[_licenseAddress].trustingProvider;
        address issuer = licenses[_licenseAddress].trustingIssuer;

        if (!isIssuer[issuer]) return false;
        if (!authorityContract.isAuthorized(issuerTrustedByAuthority[issuer]))
            return false;

        if (!isProvider[provider]) return false;
        if (
            !authorityContract.isAuthorized(
                providerTrustedByAuthority[provider]
            )
        ) return false;

        return true;
    }

    function registerSenderAsIssuer()
        external
        override
        addressIsNotIssuer(msg.sender)
    {
        isIssuer[msg.sender] = true;
        licenseIssuers.push(msg.sender);
        emit NewLicenseIssuer(msg.sender);
    }

    function removeSenderAsIssuer()
        external
        override
        addressIsIssuer(msg.sender)
    {
        delete isIssuer[msg.sender];
        delete issuerTrustedByAuthority[msg.sender];
        emit RemovedLicenseIssuer(msg.sender);
    }

    function isLicenseIssuer(address _address) external view returns (bool) {
        return isIssuer[_address];
    }

    function isTrustedLicenseIssuer(address _address)
        external
        view
        override
        returns (bool)
    {
        if (!isIssuer[_address]) return false;
        if (!authorityContract.isAuthorized(issuerTrustedByAuthority[_address]))
            return false;
        return true;
    }

    function addTrustInLicenseIssuer(address _address)
        external
        override
        addressIsAuthority(msg.sender)
        addressIsIssuer(_address)
    {
        issuerTrustedByAuthority[_address] = msg.sender;
        emit TrustInIssuerAdded(_address, msg.sender);
    }

    function removeTrustInLicenseIssuer(address _address)
        external
        override
        addressIsAuthority(msg.sender)
    {
        require(
            issuerTrustedByAuthority[_address] == msg.sender,
            "issuer is not trusted by sending authority"
        );
        delete issuerTrustedByAuthority[_address];
        emit TrustInIssuerRemoved(_address, msg.sender);
    }

    function issueLicenseToAddress(address _address)
        external
        override
        addressIsIssuer(msg.sender)
    {
        licenses[_address] = License(msg.sender, address(0x0));
        licenseAddresses.push(_address);
        emit NewLicense(_address, msg.sender);
    }

    function proposeMoveToLicenseIssuer(address _address)
        external
        override
        addressIsLicense(msg.sender)
        addressIsIssuer(_address)
    {
        issuerMoveProposed[msg.sender][_address] = true;
        emit IssuerMoveProposalAdded(msg.sender, _address);
    }

    function approveMoveToLicenseIssuer(address _address)
        external
        override
        addressIsLicense(_address)
        addressIsIssuer(msg.sender)
    {
        require(
            issuerMoveProposed[_address][msg.sender],
            "Move has not been proposed by license holder."
        );
        licenses[_address].trustingIssuer = msg.sender;
        delete issuerMoveProposed[_address][msg.sender];
        emit IssuerMoveApproved(_address, msg.sender);
    }

    function registerProvider()
        external
        override
        addressIsNotProvider(msg.sender)
    {
        isProvider[msg.sender] = true;
        licenseProvider.push(msg.sender);
        emit ProviderRegistered(msg.sender);
    }

    function removeProvider() external override addressIsProvider(msg.sender) {
        delete isProvider[msg.sender];
        delete providerTrustedByAuthority[msg.sender];
        emit ProviderRemoved(msg.sender);
    }

    function isLicenseProvider(address _address) external view returns (bool) {
        return isProvider[_address];
    }

    function isTrustedProvider(address _address)
        external
        view
        override
        returns (bool)
    {
        if (!isProvider[_address]) return false;
        if (
            !authorityContract.isAuthorized(
                providerTrustedByAuthority[_address]
            )
        ) return false;
        return true;
    }

    function addTrustInProvider(address _address)
        external
        override
        addressIsProvider(_address)
        addressIsAuthority(msg.sender)
    {
        providerTrustedByAuthority[_address] = msg.sender;
        emit TrustInProviderAdded(_address, msg.sender);
    }

    function removeTrustInProvider(address _address)
        external
        override
        addressIsProvider(_address)
    {
        require(
            providerTrustedByAuthority[_address] == msg.sender,
            "Provider is not trusted by sending authority"
        );
        delete providerTrustedByAuthority[_address];
        emit TrustInProviderRemoved(_address, msg.sender);
    }

    function proposeLicenseMovement(address _toAddress)
        external
        override
        addressIsLicense(msg.sender)
        addressIsProvider(_toAddress)
    {
        providerMoveProposed[msg.sender][_toAddress] = true;
        emit ProviderMoveProposalAdded(msg.sender, _toAddress);
    }

    function approveLicenseMovement(address _licenseAddress)
        external
        override
        addressIsLicense(_licenseAddress)
        addressIsProvider(msg.sender)
    {
        require(
            providerMoveProposed[_licenseAddress][msg.sender],
            "Provider movement has not been proposed by license holder"
        );
        licenses[_licenseAddress].trustingProvider = msg.sender;
        delete providerMoveProposed[_licenseAddress][msg.sender];
        emit ProviderMoveApproved(_licenseAddress, msg.sender);
    }

    function isLicenseRegisteredWithProvider(
        address _license,
        address _provider
    )
        external
        view
        override
        addressIsLicense(_license)
        addressIsProvider(_provider)
        returns (bool)
    {
        return licenses[_license].trustingProvider == _provider;
    }

    function getIsserOfLicense(address _licenseAddress)
        external
        view
        override
        addressIsLicense(_licenseAddress)
        returns (address)
    {
        return licenses[_licenseAddress].trustingIssuer;
    }

    function getProviderForLicense(address _licenseAddress)
        external
        view
        override
        addressIsLicense(_licenseAddress)
        returns (address)
    {
        return licenses[_licenseAddress].trustingProvider;
    }

    function getLicenses()
        external
        view
        returns (address[] memory, address[] memory, address[] memory)
    {
        uint256 licenseCount = 0;

        for (uint256 i = 0; i < licenseAddresses.length; i++) {
            address licenseAddress = licenseAddresses[i];
            if (licenses[licenseAddress].trustingIssuer != address(0x0)) {
                licenseCount++;
            }
        }

        uint256 returnCount = 0;
        address[] memory returnLicenseAddresses = new address[](licenseCount);
        address[] memory returnTrustingIssuers = new address[](licenseCount);
        address[] memory returnTrustingProviders = new address[](licenseCount);

        for (uint256 i = 0; i < licenseAddresses.length; i++) {
            address licenseAddress = licenseAddresses[i];
            if (licenses[licenseAddress].trustingIssuer != address(0x0)) {
                returnLicenseAddresses[returnCount] = licenseAddress;
                returnTrustingIssuers[returnCount] = licenses[licenseAddress]
                    .trustingIssuer;
                returnTrustingProviders[returnCount] = licenses[licenseAddress]
                    .trustingProvider;
                returnCount++;
            }
        }
        return (
            returnLicenseAddresses,
            returnTrustingIssuers,
            returnTrustingProviders
        );
    }

    function getIssuers() external view returns (address[] memory) {
        uint256 issuerCount = 0;

        for (uint256 i = 0; i < licenseIssuers.length; i++) {
            address issuer = licenseIssuers[i];
            if (isIssuer[issuer]) {
                issuerCount++;
            }
        }

        address[] memory returnArray = new address[](issuerCount);
        uint256 returnCount = 0;

        for (uint256 i = 0; i < licenseIssuers.length; i++) {
            address issuer = licenseIssuers[i];
            if (isIssuer[issuer]) {
                returnArray[returnCount] = issuer;
                returnCount++;
            }
        }

        return returnArray;
    }

    function getLicenseProviders() external view returns (address[] memory) {
        uint256 providerCount = 0;

        for (uint256 i = 0; i < licenseProvider.length; i++) {
            address provider = licenseProvider[i];
            if (isProvider[provider]) {
                providerCount++;
            }
        }

        address[] memory returnArray = new address[](providerCount);
        uint256 returnCount = 0;

        for (uint256 i = 0; i < licenseProvider.length; i++) {
            address provider = licenseProvider[i];
            if (isProvider[provider]) {
                returnArray[returnCount] = provider;
                returnCount++;
            }
        }

        return returnArray;

    }

    function getAuthorityTrustingLicenseIssuer(address _license)
        external
        view
        returns (address)
    {
        return issuerTrustedByAuthority[_license];
    }

    function getAuthorityTrustingLicenseProvider(address _provider)
        external
        view
        returns (address)
    {
        return providerTrustedByAuthority[_provider];
    }

}
