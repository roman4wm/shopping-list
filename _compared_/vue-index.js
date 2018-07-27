const vm = new Vue({
    el: "#app",
    data: {
        name: "",
        cost: "",
        quantity: ""
    },
    methods: {
        onSubmit: function(event) {
            if (this.name && this.cost && this.quantity) {
                hoodie.store.withIdPrefix("item").add({
                    name: this.name,
                    cost: this.cost,
                    quantity: this.quantity,
                    subTotal: this.cost * this.quantity
                });

                this.name = "";
                this.cost = "";
                this.quantity = "";
            } else {
                const snackbarContainer = document.querySelector("#toast");
                snackbarContainer.MaterialSnackbar.showSnackbar({
                    message: "All fields are required"
                });
            }
        }
    }
});