[![Tests](../../actions/workflows/tests-13-sprint.yml/badge.svg)](../../actions/workflows/tests-13-sprint.yml) [![Tests](../../actions/workflows/tests-14-sprint.yml/badge.svg)](../../actions/workflows/tests-14-sprint.yml)
# Проект Mesto фронтенд + бэкенд
### Ссылка на проект: [https://github.com/ground-aero/express-mesto-gha.git](https://github.com/ground-aero/express-mesto-gha.git)

## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки  
  
Остальные директории вспомогательные, создаются при необходимости разработчиком.

## Routes/end-points

`/users` — папка с файлами роутера  
`/cards` — папка с файлами контроллеров пользователя и карточки   

`POST /signup` — регистрация пользователя;  
`POST /signin` — авторизация пользователя;  
`GET /users/me` — возвращает информацию о текущем пользователе  

```
Все роуты, кроме /signin и /signup - защищены авторизацией  

NB: файл .env (переменные окружения) конфиденциальные ключи/пароли в версии production спрятаны
```
### Валидация данных:
```
Поле `email` пользователя валидируется на соответствие паттерну почты 

Тела запросов и, где необходимо, параметры запроса и заголовки валидируются по определённым
схемам с помощью celebrate  

Если запрос не соответствует схеме, обработка не передается контроллеру, клиент получает ошибку
валидации;  

Поля `avatar` и `link` проверяются регулярным выражением.
```

### Обработка ошибок в приложении:
```angular2html
- Реализована централизованная обработка ошибок в единой `middleware`
- Для ошибок созданы классы конструкторы ошибок, наследуемые от `Error`
- Если в любом из запросов что-то идёт не так, сервер возвращает ответ с ошибкой и соответствующим ей
статусом.

401 — передан неверный логин или пароль. Также эту ошибку возвращает авторизационный middleware,
если передан неверный JWT;
403 — попытка удалить чужую карточку;
409 — при регистрации указан email, который уже существует на сервере;
```

---
## Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload

#### При запуске приложение подключается к серверу mongo по адресу: mongodb://0.0.0.0:27017/mestodb ;

#### Check-List №13: [https://code.s3.yandex.net/web-developer/checklists-pdf/new-program/checklist_13.pdf](https://code.s3.yandex.net/web-developer/checklists-pdf/new-program/checklist_13.pdf)
#### Check-List №14: [https://code.s3.yandex.net/web-developer/checklists-pdf/new-program/checklist_14.pdf](https://code.s3.yandex.net/web-developer/checklists-pdf/new-program/checklist_14.pdf)
