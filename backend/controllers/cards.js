const { mongoose } = require('mongoose');
const Card = require('../models/card');
const {
  InaccurateData,
  NotFound,
  NotPermission,
} = require('../utils/errors/errors');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.ValidationError) {
        return next(
          new InaccurateData(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с указанным _id не найдена');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new NotPermission('Нет прав на удаление чужой картчоки');
      }
      return card.deleteOne().then(() => res.send({ message: 'Карточка удалена' })).catch(next);
    })
    .catch((err) => {
      if (err instanceof mongoose.CastError) {
        return next(new InaccurateData('Некорректный id карточки'));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  const setType = req.method === 'PUT' ? '$addToSet' : '$pull';
  Card.findByIdAndUpdate(
    req.params.cardId,
    { [setType]: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Карточка с указанным _id не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.CastError) {
        return next(new InaccurateData('Некорректный id карточки'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
};
