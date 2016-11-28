

(function () {


  function generateUUID () {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  // new Date().getTime() or new Date().valueOf()
  //                         1480370496972
  // xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx

  // 2480370496972 - 1480370496972 = 1000000000000 ms = 1000000000 s = 31.7 лет

  // new Date(9999999999999)
  // Sat Nov 20 2286 20:46:39 GMT+0300 (MSK)

  var generateUid = function () {
    var id = (new Date).valueOf() - 1000000000000;
    return id.toString();
  };


  /**
   * Database
   * 
   * http://blog.darkcrimson.com/2010/05/local-databases/
   */
  var Database = (function () {

    if (window.openDatabase) {
      var db = openDatabase("LP_HUB_DB", "1.0", "Users Info Database", 100000);
    }

    return {
      setId: function (id) {
        if (window.openDatabase) {
          // Удаление таблицы
          db.transaction(function (transaction) {
            transaction.executeSql("DROP TABLE users;", []);
          });
          // Создание таблицы
          db.transaction(function (transaction) {
            transaction.executeSql("CREATE TABLE IF NOT EXISTS users (id INTEGER NOT NULL PRIMARY KEY);", []);
          });
          // Сохранение идентификатора
          db.transaction(function (transaction) {
            transaction.executeSql("INSERT INTO users (id) VALUES (?)", [id]);
          });
        }
      },
      getId: function (callback) {
        if (window.openDatabase) {
          db.transaction(function (transaction) {
            transaction.executeSql("SELECT * FROM users", [], function (transaction, results) {
              if (results.rows.length) {
                callback(results.rows[0].id.toString());
              } else {
                callback();
              }
            }, function (transaction, error) {
              callback();
            });
          });
        } else {
          callback();
        }
      }
    }

  })();

  // https://learn.javascript.ru/cookie
  var Cookie = (function () {

    // возвращает cookie с именем name, если есть, если нет, то undefined
    function getCookie(name) {
      var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function setCookie(name, value, options) {
      options = options || {};

      var expires = options.expires;

      if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
      }
      if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
      }

      value = encodeURIComponent(value);

      var updatedCookie = name + "=" + value;

      for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
          updatedCookie += "=" + propValue;
        }
      }

      document.cookie = updatedCookie;
    }

    return {
        setId: function (id) {
          setCookie("id", id, {expires: 3600*24*365*10, path: "/"});
        }
      , getId: function () {
        return getCookie("id");
      }
    }

  })();

  // http://javascript.ru/unsorted/storage - FLASH

  Database.getId(function (databaseId) {
    var id, storageId, cookieId = Cookie.getId();

    if (window.localStorage) {
      storageId =localStorage.getItem("id");
    }

    if (databaseId) id = databaseId;
    if (storageId) id = storageId;
    if (cookieId) id = cookieId;

    console.log("databaseId:", databaseId);
    console.log("storageId:", storageId);
    console.log("cookieId:", cookieId);
    console.log('id:', id);

    if (!id) {
      id = generateUid();
    }
    
    Database.setId(id);
    Cookie.setId(id);
    localStorage.setItem("id", id);
  })

})()


