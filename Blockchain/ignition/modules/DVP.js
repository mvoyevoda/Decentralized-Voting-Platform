const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DecentralizedVotingProtocolModule", (m) => {
    const decentralizedVotingProtocol = m.contract("DecentralizedVotingProtocol");
    return { decentralizedVotingProtocol };
});