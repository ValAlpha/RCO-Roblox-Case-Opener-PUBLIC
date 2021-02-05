const getItems = require("../../utils/crates/iron")
const randomn = require("random-n");

const getIronItems = () => {

    const item = getItems.getItems()
    let json = require("./data/iron.json");
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
    const IDList = require("./data/iron.json");
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
    getIronItems, 
    getAmountItems
}
