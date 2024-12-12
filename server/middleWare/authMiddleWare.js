const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    if (req.method === "OPTIONS") {
        return next();  // Уникаємо подальшої обробки для OPTIONS запитів
    }

    try {
        const token = req.headers.authorization.split(' ')[1]; // Виправлено на правильний доступ
        if (!token) {
            return res.status(401).json({ message: "Не авторизований" });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;  // Виправлено помилку в назві
        next();
    } catch (e) {
        return res.status(401).json({ message: "Не авторизований" });
    }
};
