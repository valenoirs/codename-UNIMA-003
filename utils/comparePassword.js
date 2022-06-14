const comparePassword = (input, password) => {
    if(input === password) {
        return true
    }
    return false
}

module.exports = comparePassword