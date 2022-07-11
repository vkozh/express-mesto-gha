module.exports.ERRORS = {
  UNCORRECT: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERR: 500,
};

module.exports.MESSAGES = {
  userNotFound: 'Пользователь с указанным _id не найден.',
  cardNotFound: 'Карточка с указанным _id не найдена.',
  // errorUserCreate: 'Переданы некорректные данные при создании пользователя.',
  errorCardData: 'Переданы некорректные данные при создании карточки.',
  emailUncorrect: 'Некорректный email.',
  uncorrectData: 'Переданы некорректные данные.',
  errorAvatarUpdate: 'Переданы некорректные данные при обновлении аватара.',
  errorProfileUpdate: 'Переданы некорректные данные при обновлении профиля.',
  errorSetLike: 'Переданы некорректные данные для постановки лайка.',
  errorRemoveLike: 'Переданы некорректные данные для снятия лайка.',
  wrongPath: 'Такого пути не существует.',
  wrongUserData: 'Неправильные почта или пароль.',
  needAuth: 'Необходима авторизация.',
  alreadyExist: 'Пользователь с таким email уже существует.',
  invalidURL: 'Некорректная ссылка',
};
