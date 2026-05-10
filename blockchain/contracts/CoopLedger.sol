pragma solidity ^0.8.19;

/**
 * @title CoopLedger
 * @dev Registre financier et démocratique pour une coopérative agricole.
 */
contract CoopLedger {
    address public owner;
    uint256 public totalBalance;
    uint256 public voteThreshold;

    struct Transaction {
        uint256 amount;
        string description;
        uint256 timestamp;
        address initiator;
        bool isIncome; // true = income, false = expense
    }

    struct Proposal {
        string description;
        uint256 amount;
        uint256 voteCountYes;
        uint256 voteCountNo;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    mapping(address => bool) public members;
    Transaction[] public transactions;
    Proposal[] public proposals;

    event ContributionLogged(address indexed member, uint256 amount, uint256 timestamp);
    event ExpenseLogged(string description, uint256 amount, uint256 timestamp);
    event ProposalCreated(uint256 proposalId, string description, uint256 amount);
    event VoteCast(uint256 proposalId, address indexed member, bool support);
    event ProposalExecuted(uint256 proposalId, bool success);

    modifier onlyOwner() {
        require(msg.sender == owner, "Seul le createur peut executer cette action");
        _;
    }

    modifier onlyMember() {
        require(members[msg.sender], "Vous devez etre membre de la cooperative");
        _;
    }

    constructor(address _owner, uint256 _voteThreshold) {
        owner = _owner;
        voteThreshold = _voteThreshold;
        members[_owner] = true; // Le createur est membre par defaut
    }

    // --- Gestion des Membres ---

    function addMember(address _member) external onlyOwner {
        members[_member] = true;
    }

    function removeMember(address _member) external onlyOwner {
        members[_member] = false;
    }

    // --- Gestion Financiere ---

    function recordContribution(address _member, uint256 _amount) external onlyOwner {
        require(members[_member], "L'utilisateur doit etre membre pour cotiser");
        
        totalBalance += _amount;
        transactions.push(Transaction(_amount, "Cotisation membre", block.timestamp, _member, true));
        
        emit ContributionLogged(_member, _amount, block.timestamp);
    }

    function recordExpense(string memory _description, uint256 _amount) external onlyOwner {
        if (_amount > voteThreshold) {
            createProposal(_description, _amount);
        } else {
            require(totalBalance >= _amount, "Solde insuffisant");
            totalBalance -= _amount;
            transactions.push(Transaction(_amount, _description, block.timestamp, msg.sender, false));
            emit ExpenseLogged(_description, _amount, block.timestamp);
        }
    }

    // --- Système de Vote ---

    function createProposal(string memory _description, uint256 _amount) internal {
        Proposal storage newProposal = proposals.push();
        newProposal.description = _description;
        newProposal.amount = _amount;
        newProposal.executed = false;
        
        emit ProposalCreated(proposals.length - 1, _description, _amount);
    }

    function castVote(uint256 _proposalId, bool _support) external onlyMember {
        require(_proposalId < proposals.length, "Proposition inexistante");
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.executed, "La proposition a deja ete executee");
        require(!proposal.hasVoted[msg.sender], "Vous avez deja vote");

        if (_support) {
            proposal.voteCountYes++;
        } else {
            proposal.voteCountNo++;
        }

        proposal.hasVoted[msg.sender] = true;
        emit VoteCast(_proposalId, msg.sender, _support);
    }

    function executeProposal(uint256 _proposalId) external onlyOwner {
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.executed, "Deja executee");
        
        // Logique : La proposition passe si le OUI gagne (simplification pour MVP)
        if (proposal.voteCountYes > proposal.voteCountNo) {
            require(totalBalance >= proposal.amount, "Solde insuffisant pour executer");
            totalBalance -= proposal.amount;
            transactions.push(Transaction(proposal.amount, proposal.description, block.timestamp, msg.sender, false));
            proposal.executed = true;
            emit ProposalExecuted(_proposalId, true);
        } else {
            proposal.executed = true;
            emit ProposalExecuted(_proposalId, false);
        }
    }

    // --- Getters ---

    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }

    function getProposalCount() external view returns (uint256) {
        return proposals.length;
    }
}
