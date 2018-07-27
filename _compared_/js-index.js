function saveNewitem() {
    let name = document.getElementById("new-item-name").value;
    let cost = document.getElementById("new-item-cost").value;
    let quantity = document.getElementById("new-item-quantity").value;
    let subTotal = cost * quantity;
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
        let snackbarContainer = document.querySelector("#toast");
        snackbarContainer.MaterialSnackbar.showSnackbar({
            message: "All fields are required"
        });
    }
}

document.getElementById("add-item").addEventListener("click", saveNewitem);