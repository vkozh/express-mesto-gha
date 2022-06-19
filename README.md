[![Tests](https://github.com/vkozh/express-mesto-gha/actions/workflows/tests-13-sprint.yml/badge.svg)](https://github.com/vkozh/express-mesto-gha/actions/workflows/tests-13-sprint.yml) [![Tests](https://github.com/vkozh/express-mesto-gha/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/vkozh/express-mesto-gha/actions/workflows/tests-14-sprint.yml)

# Проект Mesto фронтенд + бэкенд

Проект представляет собой сервис Mesto: интерактивную страницу, где можно редактировать информацию в профиле, а также добавлять фотографии, удалять их и ставить лайки. На сайте есть шапка с логотипом, профиль с аватаркой и информацией, галерея с карточками красивых мест, подвал и pop-up окна.

## Бэкенд проекта Место

Технологии:

- Node.js - среда для JS
- Express - фреймворк для разработки сервера
- MongoDB - NoSQL база данных
- Mongoose - интерфейс для MongoDB
- Запросы тестировались на Postman

## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки  
`/models` — папка с файлами описания схем пользователя и карточки

## Запуск проекта

`npm run start` — запускает сервер  
`npm run dev` — запускает сервер с hot-reload
