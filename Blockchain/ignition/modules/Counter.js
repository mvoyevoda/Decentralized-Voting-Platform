const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CounterModule", (m) => {
    const counter = m.contract("Counter"); // Define the Counter contract to be deployed
    return { counter };
});
