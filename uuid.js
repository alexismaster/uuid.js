/**
 * UUID
 */





var UUID = (function () {

  if (UUID) throw new Error("UUID already exist");

  var _STORAGE_KEY = "UUID", _DEBUG = false;

  // Функция генерации UUID
  function generateUUID () {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now(); // use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    // ***
    var time = (new Date).valueOf().toString(16);
    uuid = uuid.substr(0, 36-time.length) + time;
    // ***
    return uuid;
  }

  // var _uuid = generateUUID();
  // // var _time = (new Date).valueOf().toString(16);

  // console.log(_uuid);
  // console.log(_time);
  // _uuid = _uuid.substr(0, 36-_time.length) + _time;
  // console.log(_uuid.substr(25));
  // _time = parseInt(_uuid.substr(25), 16);
  // console.log(new Date(_time));

  // new Date().getTime() or new Date().valueOf()
  //                         1480370496972
  // xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  // e18ef9e8-b1c1-4857-a8c8-615928ce928f

  // 2480370496972 - 1480370496972 = 1000000000000 ms = 1000000000 s = 31.7 лет

  // new Date(9999999999999)
  // Sat Nov 20 2286 20:46:39 GMT+0300 (MSK)

  // (new Date).valueOf().toString(16)
  // 
  // UUID согласно стандарту RFC 4122
  // 
  // https://www.famkruithof.net/uuid/uuidgen?typeReq=-1
  // 
  // UUID записывается как последовательность строчных шестнадцатеричных цифр, в нескольких группах, 
  // разделенных дефисом, в частности, группа из 8 цифр следуют три группы из 4 цифр, за которыми следует 
  // группа из 12 цифр, в общей сложности 32 цифр, представляющих 128 бит. Примером UUID в этой стандартной форме:
  // 
  // http://www.ietf.org/rfc/rfc4122.txt
  // 
  // Общее количество уникальных ключей UUID составляет 2128 = 25616 или около 3,4 × 1038. Это означает, что 
  // генерируя 1 триллион ключей каждую наносекунду, перебрать все возможные значения удастся лишь за 10 миллиардов лет.
  // 
  // https://ru.wikipedia.org/wiki/UUID
  // 
  // 
  // 

  /*var generateLiteUUID = function () {
    var id = (new Date).valueOf() - 1000000000000;
    return id.toString();
  };*/


  //var request = indexedDB.open("UUID", 1);


  /**
   * Database
   * 
   * http://blog.darkcrimson.com/2010/05/local-databases/
   */
  var Database = (function () {

    if (window.openDatabase) {
      var db = openDatabase("UUID", "1.0", "UUID Database", 100000);
    }

    var success = function (t, r) { if (_DEBUG) console.log('success:', t, r) };
    var failure = function (t, r) { if (_DEBUG) console.log('failure:', t, r) };

    // Удаление таблицы
    var remove = function () {
      db.transaction(function (transaction) {
        transaction.executeSql("DROP TABLE users;", [], success, failure);
      });
    };

    return {
      setId: function (id) {
        if (window.openDatabase) {
          remove();
          // Создание таблицы
          db.transaction(function (transaction) {
            transaction.executeSql("CREATE TABLE IF NOT EXISTS users (id CHAR(36) NOT NULL PRIMARY KEY);", [], success, failure);
          });
          // Сохранение идентификатора
          db.transaction(function (transaction) {
            transaction.executeSql("INSERT INTO users (id) VALUES (?)", [id], success, failure);
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
      },
      remove: remove
    }

  })();

  // https://learn.javascript.ru/cookie
  var CookieStorage = {
    setId: function (id) {
      Cookie("id", id, {expires: 3600*24*365*10, path: "/"});
    },
    getId: function () {
      return Cookie("id");
    }
  };

  // http://javascript.ru/unsorted/storage - FLASH

  var id = undefined, onGetHandler;

  /**
   * Поиск UUID в хранилищах, и генерация нового значения если UUID не найден
   */
  Database.getId(function (databaseId) {
    var storageId, cookieId = CookieStorage.getId();

    if (window.localStorage) {
      storageId = localStorage.getItem("id");
    }

    if (databaseId) id = databaseId;
    if (storageId)  id = storageId;
    if (cookieId)   id = cookieId;

    if (_DEBUG) {
      console.log("WebSQL      :", databaseId);
      console.log("LocalStorage:", storageId);
      console.log("Cookie      :", cookieId);
    }

    if (!id) {
      id = generateUUID();
    }
    
    //console.log('id:', id);
    
    Database.setId(id);
    CookieStorage.setId(id);
    localStorage.setItem("id", id);

    if (typeof onGetHandler === "function") onGetHandler(id);
  })

  return {
    getId: function (callback) {
      if (typeof id === "undefined") {
        onGetHandler = callback;
      } else {
        callback(id);
      }
    },
    getDate: function (callback) {
      this.getId(function (uuid) {
        callback(new Date(parseInt(uuid.substr(25), 16)));
      });
    },
    clear: function () {
      // localStorage.removeItem("id");
      // setCookie("id", id, {expires: -1, path: "/"});
      // Database.remove();
    }
  }

})();


//UUID.clear();


UUID.getId(function (uuid) {
  console.log('uuid:', uuid);
})

UUID.getDate(function (date) {
  console.log('date:', date);
});