pragma solidity 0.6.1;
import "./IAuthorization.sol";
import "./ILicenseProviderManager.sol";

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

    constructor(address _address) public {
        authorityContract = IAuthorization(_address);
    }

    function isLicenseTrusted(address _licenseAddress)
        external
        view
        override
        returns (bool)
    {
        return
            (
                authorityContract.isAuthorized(
                    licenses[_licenseAddress].trustingIssuer
                )
            ) &&
            (
                authorityContract.isAuthorized(
                    licenses[_licenseAddress].trustingProvider
                )
            );
    }

    function registerSenderAsIssuer()
        external
        override
        addressIsNotIssuer(msg.sender)
    {
        isIssuer[msg.sender] = true;
    }

    function removeSenderAsIssuer()
        external
        override
        addressIsIssuer(msg.sender)
    {
        delete isIssuer[msg.sender];
        delete issuerTrustedByAuthority[msg.sender];
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
    }

    function issueLicenseToAddress(address _address)
        external
        override
        addressIsIssuer(msg.sender)
    {
        licenses[_address] = License(msg.sender, address(0x0));
    }

    function proposeMoveToLicenseIssuer(address _address)
        external
        override
        addressIsLicense(msg.sender)
        addressIsIssuer(_address)
    {
        issuerMoveProposed[msg.sender][_address] = true;
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
    }

    function registerProvider()
        external
        override
        addressIsNotProvider(msg.sender)
    {
        isProvider[msg.sender] = true;
    }

    function removeProvider() external override addressIsProvider(msg.sender) {
        delete isProvider[msg.sender];
        delete providerTrustedByAuthority[msg.sender];
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
    }

    function proposeLicenseMovement(address _toAddress)
        external
        override
        addressIsLicense(msg.sender)
        addressIsProvider(_toAddress)
    {
        providerMoveProposed[msg.sender][_toAddress] = true;
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

}
