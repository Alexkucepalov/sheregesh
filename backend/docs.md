## Авторизация и регистрация

### Регистрация

`/users/register/`
Необходимо отправить в теле:

```json
{
  "email": "email@mail.ru",
  "password": "passwrdo#rc"
}
```

### Авторизация

`/users/login/`
Происходит при отправке в теле:

```json 
{
  "email": "email@mail.ru",
  "password": "passwrdo#rc"
}
```

В ответ приходит токен

```json
{
  "token": "4c91eda070d33b0ce3ffbe2de3a70eebe04b914e"
}
```

Который необходимо использовать в заголовке
`Authorization: Token <token>`

## Работа с постами

### Загрузка поста

`/posts/create/`
Необходимо отправить картинку через `multipart formData`
Получим на выходе

```json
{
  "author": 1,
  "image": "/media/images/111.jpg",
  "likes": 0,
  "views": 0
}
```

Если у фотографии нет в метаданных широты и долготы, то они будут установлены в null 