const jwt = require('jsonwebtoken');
module.exports = function(role) {
	return  function(req, res, next) {
		if (req.method === "OPTIONS") {
			 return next();  // Уникаємо подальшої обробки для OPTIONS запитів
		}
  
		try {
			 const token = req.headers.authorization.split(' ')[1]; // Виправлено на правильний доступ
			 if (!token) {
				  return res.status(401).json({ message: "Не авторизований" });
			 }
			 const decoded = jwt.verify(token, process.env.SECRET_KEY);
			 if(decoded.role !== role) {
				return res.status(403).json({ message: "Немає доступу" });
			 }// Виправлено помилку в назві
			 next();
		} catch (e) {
			 return res.status(401).json({ message: "Не авторизований" });
		}
  };
}


