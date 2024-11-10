// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title DecentralizedVotingProtocol
 * @dev An open protocol for creating polls, verifying voters, and casting votes with reliable associations between polls and votes.
 */
contract DecentralizedVotingProtocol {

    struct Poll {
        uint pollId;
        string pollName;
        string pollDesc;
        address creator;
        uint startTime;
        uint endTime;
        string[] options; 
        string[] imageURLs; // Corresponds to order of options array above
        mapping(uint => uint) voteCounts; // option -> count
        mapping(address => uint) votes; // voterID -> choice
    }

    struct Voter {
        address pubKey;
        uint age;
        string gender;
        string country;
    }

    mapping(uint => Poll) private polls; // pollID -> poll
    mapping(address => Voter) public verifiedVoters; // pubKey -> Voter 
    uint public pollCounter;

    event PollCreated(string pollName);
    event VoterVerified(address indexed voter);
    event VoteCast(address indexed voter, uint pollId, uint optionId);
    event PollEnded(uint pollId);

    modifier onlyVerifiedVoter() {
        require(verifiedVoters[msg.sender].pubKey != address(0), "Not a verified voter.");
        _;
    }

    modifier pollExists(uint _pollId) {
        require(_pollId > 0 && _pollId <= pollCounter, "Poll does not exist.");
        _;
    }



    // --------------------------------- POLL FUNCTIONS ---------------------------------



    /**
     * @dev Retrieves the total number of polls created.
     * @return The total poll count.
     */
    function getTotalPolls() external view returns (uint) {
        return pollCounter;
    }



    /**
     * @dev Creates a new poll with specified options, name, description, and images.
     * @param _pollName Name of the poll.
     * @param _pollDesc Description of the poll.
     * @param _startTime Unix timestamp when voting starts.
     * @param _endTime Unix timestamp when voting ends.
     * @param _options Array of strings representing the poll options.
     * @param _imageURLs Array of strings representing the image URLs corresponding to each option.
     */
    function createPoll(
        string calldata _pollName,
        string calldata _pollDesc,
        uint _startTime,
        uint _endTime,
        string[] calldata _options,
        string[] calldata _imageURLs
    ) external {
        require(_options.length >= 2, "At least two options required.");
        require(_startTime < _endTime, "Start time must be before end time.");
        require(_startTime > block.timestamp, "Start time must be in the future.");
        require(_options.length <= 5, "Cannot have more than 5 options");
        require(_options.length == _imageURLs.length, "Options and images must have the same length.");

        pollCounter++;
        Poll storage newPoll = polls[pollCounter];
        newPoll.pollId = pollCounter;
        newPoll.pollName = _pollName;
        newPoll.pollDesc = _pollDesc;
        newPoll.creator = msg.sender;
        newPoll.startTime = _startTime;
        newPoll.endTime = _endTime;

        for (uint i = 0; i < _options.length; i++) {
            require(bytes(_options[i]).length > 0, "Option cannot be empty.");
            require(bytes(_imageURLs[i]).length > 0, "Image URL cannot be empty.");

            for (uint j = 0; j < newPoll.options.length; j++) {
                require(keccak256(bytes(_options[i])) != keccak256(bytes(newPoll.options[j])), "Duplicate options are not allowed.");
            }

            newPoll.options.push(_options[i]);
            newPoll.imageURLs.push(_imageURLs[i]);
        }

        emit PollCreated(_pollName);
    }



    /**
     * @dev Retrieves details of a specific poll.
     * @param _pollId ID of the poll.
     * @return pollId, pollName, pollDesc, creator, startTime, endTime, isActive, options, images
     */
    function getPoll(uint _pollId) external view pollExists(_pollId) returns (
        uint,
        string memory,
        string memory,
        address,
        uint,
        uint,
        bool,
        string[] memory,
        string[] memory
    ) {
        Poll storage poll = polls[_pollId];
        bool isActive = (block.timestamp >= poll.startTime && block.timestamp <= poll.endTime);

        return (
            poll.pollId,
            poll.pollName,
            poll.pollDesc,
            poll.creator,
            poll.startTime,
            poll.endTime,
            isActive,
            poll.options,
            poll.imageURLs
        );
    }



    /**
     * @dev Retrieves previews of all polls.
     * @return An array of poll titles, isActive statuses, and total votes.
     */
    function getPollPreviews() external view returns (
        string[] memory,
        bool[] memory,
        uint[] memory
    ) {
        uint pollCount = pollCounter;

        string[] memory pollTitles = new string[](pollCount);
        bool[] memory isActives = new bool[](pollCount);
        uint[] memory totalVotes = new uint[](pollCount);

        for (uint i = 1; i <= pollCount; i++) {
            Poll storage poll = polls[i];
            bool isActive = (block.timestamp >= poll.startTime && block.timestamp <= poll.endTime);

            uint votesCount = 0;
            for (uint j = 0; j < poll.options.length; j++) {
                votesCount += poll.voteCounts[j];
            }

            pollTitles[i - 1] = poll.pollName;
            isActives[i - 1] = isActive;
            totalVotes[i - 1] = votesCount;
        }

        return (pollTitles, isActives, totalVotes);
    }



    // --------------------------------- VOTING FUNCTIONS ---------------------------------



    /**
     * @dev Verifies a voter by storing their details. Any user can call this to verify themselves.
     * @param _age Age of the voter.
     * @param _gender Gender of the voter.
     * @param _country Country of the voter.
     */
    function verifyVoter(uint _age, string calldata _gender, string calldata _country) external {
        require(verifiedVoters[msg.sender].pubKey == address(0), "Voter already verified.");

        verifiedVoters[msg.sender] = Voter({
            pubKey: msg.sender,
            age: _age,
            gender: _gender,
            country: _country
        });

        emit VoterVerified(msg.sender);
    }



    /**
     * @dev Allows a verified voter to cast a vote for a specific poll option.
     * @param _pollId ID of the poll to vote in.
     * @param _optionId The ID of the option the voter chooses.
     */
    function castVote(uint _pollId, uint _optionId) external onlyVerifiedVoter pollExists(_pollId) {
        Poll storage poll = polls[_pollId];

        require(block.timestamp >= poll.startTime && block.timestamp <= poll.endTime, "Poll is not within the voting period.");
        require(_optionId < poll.options.length, "Invalid option.");
        require(poll.votes[msg.sender] == 0, "Voter has already voted.");

        poll.votes[msg.sender] = _optionId + 1;
        poll.voteCounts[_optionId]++;

        emit VoteCast(msg.sender, _pollId, _optionId);
    }



    /**
     * @dev Retrieves the total vote count for a specific poll option.
     * @param _pollId ID of the poll.
     * @param _optionId The ID of the option to retrieve vote count for.
     * @return The number of votes the option has received.
     */
    function getOptionVoteCount(uint _pollId, uint _optionId) external view pollExists(_pollId) returns (uint) {
        Poll storage poll = polls[_pollId];
        require(_optionId < poll.options.length, "Invalid option.");
        return poll.voteCounts[_optionId];
    }



    /**
     * @dev Retrieves the details of a voter's vote in a specific poll.
     * @param _pollId ID of the poll.
     * @param _voter Address of the voter.
     * @return hasVoted Indicates whether the voter has voted.
     * @return pubKey The voter's public key.
     * @return pollId The ID of the poll.
     * @return selectedOption The option selected by the voter.
     */
    function getVote(uint _pollId, address _voter) external view pollExists(_pollId) returns (
        bool hasVoted,
        address pubKey,
        uint pollId,
        string memory selectedOption
    ) {
        Poll storage poll = polls[_pollId];
        uint votedOption = poll.votes[_voter];
        if (votedOption > 0) {
            return (
                true,
                _voter,
                _pollId,
                poll.options[votedOption - 1]
            );
        } else {
            return (false, address(0), 0, "");
        }
    }


}