const { Brand } = require('../models/models');
const ApiError = require('../error/ApiError');

class BrandController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      const existingBrand = await Brand.findOne({ where: { name } });
      if (existingBrand) {
        return next(ApiError.BadRequest('Такий бренд вже існує'));
      }

      const brand = await Brand.create({ name });

      return res.json(brand);
    } catch (e) {
      next(ApiError.BadRequest(e.message)); 
    }
  }

  async getAll(req, res) {
    try {
      const brands = await Brand.findAll();
      return res.json(brands);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
}

module.exports = new BrandController();
