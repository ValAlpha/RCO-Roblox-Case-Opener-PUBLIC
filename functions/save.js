const saveFunction = async (data, userID) => {

    const mongoose = require("mongoose")

    const Profile = require("../models/profile")

    const p = await Profile.findOne({ id: userID })

    if (!p) {
        new Profile({
            id: userID,
            value: data.price,
            inventory: [
                {
                    name: data.name,
                    amount: 1,
                    totalValue: data.price,
                    itemType: type,
                    limited: isLimited
                }
            ]

        }).save().catch(err => console.log(err))
    } else {

        if (p.inventory.length === 0) {
            p.inventory.push({
                name: data.name,
                amount: 1,
                totalValue: data.price,
                itemType: type,
                limited: isLimited
            })
        } else {
            p.inventory.forEach(obj => {
                if (obj.name === data.name) {
                    obj.amount++;
                    obj.totalValue = data.price * obj.amount,
                        obj.itemType = type,
                        obj.limited = isLimited
                } else {
                    if (!p.inventory.find(c => (c.name || "") === data.name)) {
                        p.inventory.push({
                            name: data.name,
                            amount: 1,
                            totalValue: data.price,
                            itemType: type,
                            limited: isLimited
                        })
                    }
                }
            })
        }

        p.save().catch(err => console.log(err))

    }

}

const save = saveFunction()

module.exports = save