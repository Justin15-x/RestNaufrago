// ===============================
// MÓDULO DATA - EL NAUFRAGO
// Maneja almacenamiento y CRUD
// ===============================

const STORAGE_KEY = "pedidos_naufrago";

export const DataModule = {

    getOrders() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    },

    saveOrders(orders) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    },

    addOrder(order) {
        const orders = this.getOrders();
        orders.push(order);
        this.saveOrders(orders);
    },

    updateOrder(updatedOrder) {
        let orders = this.getOrders();
        orders = orders.map(order =>
            order.id === updatedOrder.id ? updatedOrder : order
        );
        this.saveOrders(orders);
    },

    deleteOrder(id) {
        let orders = this.getOrders();
        orders = orders.filter(order => order.id !== id);
        this.saveOrders(orders);
    }
};