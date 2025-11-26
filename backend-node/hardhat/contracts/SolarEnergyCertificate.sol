// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * SolarEnergyCertificate.sol
 *
 * - Admins can register/remove producers & companies, set policies (min energy, default price).
 * - Producers (registered) can issue certificates.
 * - Producers set their own price (per certificate). Price used at issuance (snapshot).
 * - Companies can purchase certificates (transfer-on-purchase). Payment forwarded to seller.
 * - Contract emits rich events (issue, purchase, retire, register/remove) — off-chain code should
 *   collect `transactionHash` from the event receipts and build Merkle trees there.
 *
 * Notes:
 * - Security: purchase uses `call{value: ...}` with checks for success.
 * - Merkle tree generation and including labels like "P1_ID1" / "C1_ID1" should be built off-chain
 *   using the event tx hashes and metadata (owner mapping / producer index) the backend exposes.
 */

contract SolarEnergyCertificate {
    // ---------- Access / Roles ----------
    address public admin;                       // primary admin (deployer)
    mapping(address => bool) public isAdmin;    // multi-admin toggle
    mapping(address => bool) public isProducer;
    mapping(address => bool) public isCompany;

    // ---------- Configuration / Policies ----------
    uint256 public minEnergyWh = 1000;          // minimum energy in Wh required for 1 SEC (default 1 kWh = 1000 Wh)
    // (producers may set individual price; defaultPrice used when producer did not set)
    uint256 public defaultPriceWei = 0;         // default price in wei (0 means free/default)

    // ---------- Certificates ----------
    uint256 public nextId = 1;

    struct Certificate {
        uint256 id;
        address owner;          // current owner (producer initially, then company after purchase)
        uint256 energyWh;       // energy in Watt-hour (Wh)
        uint256 timestamp;
        bool retired;
        address issuer;         // producer who issued this cert
        uint256 priceWei;       // price set at issuance (snapshot of producer price)
    }

    mapping(uint256 => Certificate) public certificates;

    // Maintain owner -> certificate ids (simple dynamic array mapping)
    mapping(address => uint256[]) internal ownerToCerts;

    // ---------- Producer / Company registries ----------
    address[] public producerList;
    mapping(address => uint256) internal producerIndex; // 1-based index, 0 = not present

    address[] public companyList;
    mapping(address => uint256) internal companyIndex; // 1-based index, 0 = not present

    // Each producer can set a price (in wei) for their certificates
    mapping(address => uint256) public producerPriceWei;

    // ---------- Events ----------
    event AdminAdded(address indexed newAdmin, address indexed by);
    event ProducerRegistered(address indexed producer, address indexed by);
    event ProducerRemoved(address indexed producer, address indexed by);
    event CompanyRegistered(address indexed company, address indexed by);
    event CompanyRemoved(address indexed company, address indexed by);

    event CertificateIssued(
        uint256 indexed id,
        address indexed owner,
        uint256 energyWh,
        uint256 timestamp,
        address indexed issuer,
        uint256 priceWei
    );

    event CertificatePurchased(
        uint256 indexed id,
        address indexed from,
        address indexed to,
        uint256 priceWei,
        uint256 timestamp
    );

    event CertificateRetired(uint256 indexed id, address indexed by, uint256 timestamp);

    event MinEnergyUpdated(uint256 newMinEnergyWh, address indexed by);
    event DefaultPriceUpdated(uint256 newDefaultPriceWei, address indexed by);
    event ProducerPriceUpdated(address indexed producer, uint256 newPriceWei, address indexed by);

    // ---------- Modifiers ----------
    modifier onlyAdmin() {
        require(isAdmin[msg.sender] || msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyProducer() {
        require(isProducer[msg.sender], "Only registered producer");
        _;
    }

    modifier onlyCompany() {
        require(isCompany[msg.sender], "Only registered company");
        _;
    }

    // ---------- Constructor ----------
    constructor() {
        admin = msg.sender;
        isAdmin[msg.sender] = true;
    }

    // ---------- Admin functions ----------
    function addAdmin(address _addr) external onlyAdmin {
        require(_addr != address(0), "Invalid admin");
        isAdmin[_addr] = true;
        emit AdminAdded(_addr, msg.sender);
    }

    function registerProducer(address _producer) external onlyAdmin {
        require(_producer != address(0), "Invalid producer");
        if (!isProducer[_producer]) {
            isProducer[_producer] = true;
            producerList.push(_producer);
            producerIndex[_producer] = producerList.length; // 1-based
            // initialize price to default if not set
            if (producerPriceWei[_producer] == 0) producerPriceWei[_producer] = defaultPriceWei;
            emit ProducerRegistered(_producer, msg.sender);
        }
    }

    function removeProducer(address _producer) external onlyAdmin {
        require(isProducer[_producer], "Producer not registered");
        isProducer[_producer] = false;
        // remove from producerList (swap & pop)
        uint256 idx = producerIndex[_producer];
        if (idx != 0) {
            uint256 lastIdx = producerList.length;
            address lastAddr = producerList[lastIdx - 1];
            // swap
            producerList[idx - 1] = lastAddr;
            producerIndex[lastAddr] = idx;
            // pop
            producerList.pop();
            producerIndex[_producer] = 0;
        }
        emit ProducerRemoved(_producer, msg.sender);
    }

    function registerCompany(address _company) external onlyAdmin {
        require(_company != address(0), "Invalid company");
        if (!isCompany[_company]) {
            isCompany[_company] = true;
            companyList.push(_company);
            companyIndex[_company] = companyList.length;
            emit CompanyRegistered(_company, msg.sender);
        }
    }

    function removeCompany(address _company) external onlyAdmin {
        require(isCompany[_company], "Company not registered");
        isCompany[_company] = false;
        uint256 idx = companyIndex[_company];
        if (idx != 0) {
            uint256 lastIdx = companyList.length;
            address lastAddr = companyList[lastIdx - 1];
            companyList[idx - 1] = lastAddr;
            companyIndex[lastAddr] = idx;
            companyList.pop();
            companyIndex[_company] = 0;
        }
        emit CompanyRemoved(_company, msg.sender);
    }

    function setMinEnergyWh(uint256 _minEnergyWh) external onlyAdmin {
        minEnergyWh = _minEnergyWh;
        emit MinEnergyUpdated(_minEnergyWh, msg.sender);
    }

    function setDefaultPriceWei(uint256 _defaultPriceWei) external onlyAdmin {
        defaultPriceWei = _defaultPriceWei;
        emit DefaultPriceUpdated(_defaultPriceWei, msg.sender);
    }

    // ---------- Producer functions ----------
    /// set a producer-specific price (in wei). Admin must have registered the producer first.
    function setProducerPrice(uint256 _priceWei) external {
        require(isProducer[msg.sender], "Only producer");
        producerPriceWei[msg.sender] = _priceWei;
        emit ProducerPriceUpdated(msg.sender, _priceWei, msg.sender);
    }

    /// issue certificate (only producer)
    function issueCertificate(address _owner, uint256 _energyWh) external onlyProducer {
        require(_owner != address(0), "Invalid owner");
        require(_energyWh >= minEnergyWh, "energy below minimum");

        uint256 id = nextId;
        uint256 price = producerPriceWei[msg.sender];
        if (price == 0) price = defaultPriceWei;

        Certificate memory c = Certificate({
            id: id,
            owner: _owner,
            energyWh: _energyWh,
            timestamp: block.timestamp,
            retired: false,
            issuer: msg.sender,
            priceWei: price
        });

        certificates[id] = c;
        ownerToCerts[_owner].push(id);

        nextId++;

        emit CertificateIssued(id, _owner, _energyWh, block.timestamp, msg.sender, price);
    }

    // ---------- Purchase (transfer-on-purchase) ----------
    /**
     * purchaseCertificate:
     * - Buyer calls this payable function sending at least `priceWei`.
     * - Ownership of certificate is transferred to buyer.
     * - Contract forwards funds to current owner (seller).
     * - Event emits so off-chain can capture tx.hash and build Merkle tree etc.
     */
    function purchaseCertificate(uint256 _id) external payable {
        Certificate storage c = certificates[_id];
        require(c.id != 0, "Invalid certificate");
        require(!c.retired, "Certificate retired");
        address seller = c.owner;
        require(seller != address(0), "Invalid seller");
        require(msg.sender != seller, "Seller cannot buy own cert");

        uint256 price = c.priceWei;
        require(msg.value >= price, "Insufficient payment");

        // Transfer ownership to buyer
        address previousOwner = c.owner;
        c.owner = msg.sender;

        // Record ownership mapping: push to buyer list
        ownerToCerts[msg.sender].push(_id);

        // Forward funds to seller (use call)
        (bool sent, ) = payable(seller).call{value: price}("");
        require(sent, "Payment forwarding failed");

        // If buyer overpaid, refund difference
        if (msg.value > price) {
            uint256 refund = msg.value - price;
            (bool r, ) = payable(msg.sender).call{value: refund}("");
            require(r, "Refund failed");
        }

        emit CertificatePurchased(_id, previousOwner, msg.sender, price, block.timestamp);
    }

    // ---------- Retire ----------
    function retireCertificate(uint256 _id) external {
        Certificate storage c = certificates[_id];
        require(c.id != 0, "Invalid cert");
        require(!c.retired, "Already retired");
        // optional: only owner/company can retire
        require(msg.sender == c.owner || isCompany[msg.sender] || isAdmin[msg.sender] || msg.sender == admin, "Not permitted to retire");
        c.retired = true;
        emit CertificateRetired(_id, msg.sender, block.timestamp);
    }

    // ---------- Getters / Utilities ----------
    function getCertificate(uint256 _id) external view returns (
        uint256 id,
        address owner,
        uint256 energyWh,
        uint256 timestamp,
        bool retired,
        address issuer,
        uint256 priceWei
    ) {
        Certificate memory c = certificates[_id];
        require(c.id != 0, "Not found");
        return (c.id, c.owner, c.energyWh, c.timestamp, c.retired, c.issuer, c.priceWei);
    }

    function certificatesOfOwner(address _owner) external view returns (uint256[] memory) {
        return ownerToCerts[_owner];
    }

    function producers() external view returns (address[] memory) {
        return producerList;
    }

    function companies() external view returns (address[] memory) {
        return companyList;
    }

    /// helper to look up simple label suggestion off-chain — returns issuer and id
    function issuerOf(uint256 _id) external view returns (address) {
        Certificate memory c = certificates[_id];
        require(c.id != 0, "Not found");
        return c.issuer;
    }

    // Allow contract to receive ETH (not used otherwise)
    receive() external payable {}
    fallback() external payable {}
}
