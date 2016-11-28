# uuid.js
generate unique user id in javascript


Идея в том, чтобы генерировать уникальные идентификаторы посетителям без центра координации (сервера), и
хранить эти идентификаторы на стороне клиента, т.е. средствами браузера и JavaScript.

Для сохранения идентификаторов на стороне клиента используются следующие средства:
- Cookie
- localStorage
- openDatabase


Генерируемый идентификатор (UUID), по своей структуре, соответствует стандарту  RFC 4122 и  представляет собой 16-байтный (128-битный) номер. В шестнадцатеричной системе счисления UUID выглядит как:

`550e8400-e29b-41d4-a716-446655440000`




# Интересные ссылки

http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
https://github.com/broofa/node-uuid
https://javascript.ru/unsorted/Id#3rd-party-cookie
https://ru.wikipedia.org/wiki/UUID
