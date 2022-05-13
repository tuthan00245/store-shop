export const sumMoneyProduct = (productCart, key) => {
    if (key.length > 0) {
        let sum = key.reduce((sum, acc, index) => {
            if (productCart[acc].selected === true) {
                return sum + ((productCart[acc].price - productCart[acc].price * productCart[acc].sale / 100)* productCart[acc].quantity)
            }
            return sum
        }, 0)
        return sum
    }
    return 0
}

export const sumMoneyShip = (productCart, key) => {
    if (key.length > 0) {
        let sum = key.reduce((sum, acc, index) => {
            if (productCart[acc].selected === true) {
                return sum + productCart[acc].moneyShip
            }
            return sum
        }, 0)
        return sum
    }
    return 0
}

export const checkProductSelected = (productCart, key) => {
    if (key.length > 0) {
        let sum = key.reduce((sum, acc, index) => {
            if (productCart[acc].selected === true) {
                return sum + productCart[acc].quantity
            }
            return sum
        }, 0)
        return sum
    }
    return 0
}