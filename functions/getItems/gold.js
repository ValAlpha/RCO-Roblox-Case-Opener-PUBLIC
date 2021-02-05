const getItems = require("../../utils/crates/gold")
const randomn = require("random-n");

const getGoldItems = () => {

    const item = getItems.getItems()
    let json = require("./data/gold.json");
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

const getAmountItems = (amount) => {
    const IDList = require("./data/gold.json");
    let getAmountItems = randomn(IDList, amount)
    let items = []

    getAmountItems.forEach(i => {
        items.push(i)
    })


    return {
        items
    }
}

module.exports = {
    getGoldItems, 
    getAmountItems
}
