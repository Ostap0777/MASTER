const { Basket, BasketDevice, Device } = require('../models');

// Додаємо товар в кошик
async function addToBasket(req, res) {
  try {
    const { deviceId } = req.body;
    const userId = req.user.id; 

    let basket = await Basket.findOne({ where: { userId } });
    if (!basket) {
      basket = await Basket.create({ userId });
    }

    const existingBasketDevice = await BasketDevice.findOne({
      where: { basketId: basket.id, deviceId },
    });

    if (existingBasketDevice) {
      return res.status(400).json({ message: 'Товар вже є в кошику' });
    }

    const basketDevice = await BasketDevice.create({
      basketId: basket.id,
      deviceId,
    });

    return res.status(201).json(basketDevice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка при додаванні товару в кошик' });
  }
}


async function removeFromBasket(req, res) {
  try {
    const { deviceId } = req.body;
    const userId = req.user.id; 

    const basket = await Basket.findOne({ where: { userId } });
    if (!basket) {
      return res.status(404).json({ message: 'Кошик не знайдено' });
    }

    const basketDevice = await BasketDevice.findOne({
      where: { basketId: basket.id, deviceId },
    });

    if (!basketDevice) {
      return res.status(404).json({ message: 'Товар не знайдено в кошику' });
    }

    await basketDevice.destroy();

    return res.status(200).json({ message: 'Товар видалено з кошика' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка при видаленні товару з кошика' });
  }
}

async function getBasket(req, res) {
  try {
    const userId = req.user.id;

    const basket = await Basket.findOne({ where: { userId } });
    if (!basket) {
      return res.status(404).json({ message: 'Кошик не знайдено' });
    }

    const basketDevices = await BasketDevice.findAll({
      where: { basketId: basket.id },
      include: {
        model: Device, 
        attributes: ['id', 'name', 'price'],
      },
    });

    if (basketDevices.length > 0) {
      return res.status(200).json(basketDevices);
    } else {
      return res.status(404).json({ message: 'Кошик порожній' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка при отриманні товарів з кошика' });
  }
}

module.exports = {
  addToBasket,
  removeFromBasket,
  getBasket,
};
