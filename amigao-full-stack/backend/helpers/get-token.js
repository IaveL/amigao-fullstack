
const getToken = (req) => {
    const authHeader = req.headers.authorization
    const token = authHeader.split(" ")[1] //splita a string (Bearer blabla) em seu espaço após o bearer, [1] acessa o array só com o token
    return token
}


module.exports = getToken
