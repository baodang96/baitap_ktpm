package iuh.quanlidonhang.decorator;

public class InsuranceDecorator extends OrderDecorator {
    public InsuranceDecorator(OrderService order) {
        super(order);
    }
    public double cost() {
        return order.cost() + 20;
    }
}

