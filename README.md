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

https://www.postgresql.org/docs/8.3/static/datatype-uuid.html


Уникальный ключ в условиях распределенной БД
https://habrahabr.ru/post/135364/



https://zlob.in/2013/01/uuid-v-mysql/

в итоге мы получим что-то на подобии этого: c427934f-2adc-11e0-8aae-cf2343e5b2ce

первые три части генерируются по метке времени;
четвертая часть предохраняет темпоральную уникальность в случае, если значение временной метки теряет монотонность (например, в случае перехода на зимнее или летнее время);
пятая часть генерируется в FreeBSD и Linux по MAC-адресу, а в остальных операционных системах это случайное 48-битное число.
В MySQL UUID можно хранить в полях различного типа, например: