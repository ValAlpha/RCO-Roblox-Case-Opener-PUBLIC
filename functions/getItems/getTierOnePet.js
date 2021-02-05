const tierOnePet = require("../../utils/crates/tierOnePet")

const getPets = async () => {

    const pet = tierOnePet.getPet()

    return {
       pet
    }
}

module.exports = getPets