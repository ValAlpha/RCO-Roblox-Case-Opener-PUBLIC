const getItems = require("../../utils/crates/spooky")

const getSpookyItems = () => {

    const item = getItems.getItems()
    let json = require("./data/spooky.json");
    let find = json.find(c => c.itemID === item);
    if(!find) return null;
    let data = {
        PriceInRobux: find.itemWorth,
        Name: find.name,
        AssetId: find.itemID
    }
    return {
        data,
        img: find.img,
        type: find.itemType,
        item,
        isLimited: find.limited,
        searchQuery: item.name
    }
}

module.exports = getSpookyItems
