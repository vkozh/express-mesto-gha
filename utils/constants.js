module.exports.ERRORS = {
  UNCORRECT: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERR: 500,
};

module.exports.MESSAGES = {
  userNotFound: 'Пользователь по указанному _id не найден.',
  errorAvatarUpdate: 'Переданы некорректные данные при обновлении аватара.',
  errorUserCreate: 'Переданы некорректные данные при создании пользователя.',
  errorProfileUpdate: 'Переданы некорректные данные при обновлении профиля.',
  cardNotFound: 'Карточка с указанным _id не найдена.',
  errorSetLike: 'Переданы некорректные данные для постановки лайка.',
  errorRemoveLike: 'Переданы некорректные данные для снятия лайка.',
  errorCardCreate: 'Переданы некорректные данные при создании карточки.',
  wrongPath: 'Такого пути не существует.',
  wrongUserData: 'Неправильные почта или пароль.',
  needAuth: 'Необходима авторизация.',
  alreadyExist: 'Пользователь с таким email уже существует.',
};
