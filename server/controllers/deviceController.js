const uuid = require('uuid');
const path = require('path');
const { Device, DeviceInfo } = require('../models/models');
const ApiError = require('../error/ApiError');

class deviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;

      if (!img) {
        return next(ApiError.BadRequest("Image file is required"));
      }

      const fileName = uuid.v4() + '.jpg';
      img.mv(path.resolve(__dirname, '..', 'static', fileName));

      const device = await Device.create({
        name, 
        price, 
        brandId, 
        typeId, 
        img: fileName,
        info
      });

      if (info) {
        info = JSON.parse(info); 
        info.forEach(i => {
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id
          });
        });
      }

      return res.json(device);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const { brandId, typeId } = req.query;
      let devices;

      if (!brandId && !typeId) {
        devices = await Device.findAll();
      } else if (brandId && !typeId) {
        devices = await Device.findAll({ where: { brandId } });
      } else if (!brandId && typeId) {
        devices = await Device.findAll({ where: { typeId } });
      } else if (brandId && typeId) {
        devices = await Device.findAll({ where: { typeId, brandId } });
      }

      return res.json(devices);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const device = await Device.findOne({
        where: { id },
        include: [{ model: DeviceInfo, as: 'info' }]
      });

      if (!device) {
        return next(ApiError.NotFound('Device not found'));
      }

      return res.json(device);
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }


  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const device = await Device.findOne({ where: { id } });

      if (!device) {
        return next(ApiError.NotFound('Device not found'));
      }

      await Device.destroy({
        where: { id }
      });

      await DeviceInfo.destroy({
        where: { deviceId: id }
      });

      return res.json({ message: 'Device deleted successfully' });
    } catch (e) {
      next(ApiError.BadRequest(e.message));
    }
  }
}

module.exports = new deviceController();
