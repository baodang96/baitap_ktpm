package iuh.quanlidonhang.decorator;

public abstract class OrderDecorator implements OrderService {
    protected OrderService order;
    public OrderDecorator(OrderService order) {
        this.order = order;
    }
}

