
const express = require('express');
const models = require('./models/models')
require('dotenv').config();
const cors = require('cors')
const router = require('./routes/index')
const fileUpload = require('express-fileupload')
const path = require('path')
const errorHandler = require('./middleWare/errorHandlirMiddleware')



const PORT = process.env.PORT || 5001;
const sequelize = require('./bd')



const app = express();
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)


app.use(errorHandler)




const start = async () => {
	try {
		 await sequelize.authenticate();
		 await sequelize.sync()
		app.listen(PORT, () => console.log(`Server work on ${PORT} PORT`))
	}
	catch (e) {
		console.log(e)
	}
}


start()



