"use strict";

System.register(["shared.js"], function (_export, _context) {
  "use strict";

  var shared;


  function getIndexTemplate() {
    var template = document.querySelector("#item-row").innerHTML;
    return template;
  }

  function addItemToPage(item) {
    if (document.getElementById(item._id)) return;

    var template = getIndexTemplate();
    template = template.replace("{{name}}", item.name);
    template = template.replace("{{cost}}", item.cost);
    template = template.replace("{{quantity}}", item.quantity);
    template = template.replace("{{subTotal}}", item.subTotal);
    template = template.replace("{{row-id}}", item._id);
    template = template.replace("{{item-id}}", item._id);
    document.getElementById("item-table").tBodies[0].innerHTML += template;

    var totalCost = Number.parseFloat(document.getElementById("total-cost").value);
    document.getElementById("total-cost").value = totalCost + item.subTotal;

    console.log(item);
  }

  function saveNewitem() {
    var name = document.getElementById("new-item-name").value;
    var cost = document.getElementById("new-item-cost").value;
    var quantity = document.getElementById("new-item-quantity").value;
    var subTotal = cost * quantity;

    if (name && cost && quantity) {
      hoodie.store.withIdPrefix("item").add({
        name: name,
        cost: cost,
        quantity: quantity,
        subTotal: subTotal
      });

      document.getElementById("new-item-name").value = "";
      document.getElementById("new-item-cost").value = "";
      document.getElementById("new-item-quantity").value = "";
    } else {
      var snackbarContainer = document.querySelector("#toast");
      snackbarContainer.MaterialSnackbar.showSnackbar({
        message: "All fields are required"
      });
    }
  }

  function deleteRow(deletedItem) {
    var row = document.getElementById(deletedItem._id);
    var totalCost = Number.parseFloat(document.getElementById("total-cost").value);
    document.getElementById("total-cost").value = totalCost - deletedItem.subTotal;
    row.parentNode.removeChild(row);
  }

  function saveList() {
    var cost = 0.0;

    hoodie.store.withIdPrefix("item").findAll().then(function (items) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          console.log(item);
          cost += item.subTotal;
        }

        //store the list
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      hoodie.store.withIdPrefix("list").add({
        cost: cost,
        items: items
      });

      //delete the items
      console.log("deleting items");
      hoodie.store.withIdPrefix("item").remove(items).then(function () {
        //clear the table
        document.getElementById("item-table").tBodies[0].innerHTML = "";

        //notify the user
        var snackbarContainer = document.querySelector("#toast");
        snackbarContainer.MaterialSnackbar.showSnackbar({
          message: "List saved succesfully"
        });
      }).catch(function (error) {
        //notify the user
        var snackbarContainer = document.querySelector("#toast");
        snackbarContainer.MaterialSnackbar.showSnackbar({
          message: error.message
        });
      });
    });
  }

  function deleteItem(itemId) {
    console.log("removing item with id " + itemId);
    hoodie.store.withIdPrefix("item").remove(itemId);
  }

  function init() {
    shared.updateDOMLoginStatus();
    hoodie.store.withIdPrefix("item").on("add", addItemToPage);
    hoodie.store.withIdPrefix("item").on("remove", deleteRow);

    document.getElementById("add-item").addEventListener("click", saveNewitem);

    window.pageEvents = {
      deleteItem: deleteItem,
      saveList: saveList,
      closeLogin: shared.closeLoginDialog,
      showLogin: shared.showLoginDialog,
      closeRegister: shared.closeRegisterDialog,
      showRegister: shared.showRegisterDialog,
      login: shared.login,
      register: shared.register,
      signout: shared.signOut
    };

    //retrieve items on the current list and display on the page
    hoodie.store.withIdPrefix("item").findAll().then(function (items) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var item = _step2.value;

          addItemToPage(item);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    });
  }

  return {
    setters: [function (_sharedJs) {
      shared = _sharedJs;
    }],
    execute: function () {
      init();
    }
  };
});