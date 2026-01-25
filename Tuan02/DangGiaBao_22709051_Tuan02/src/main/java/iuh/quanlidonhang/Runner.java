package iuh.quanlidonhang;

import iuh.quanlidonhang.decorator.BasicOrder;
import iuh.quanlidonhang.decorator.InsuranceDecorator;
import iuh.quanlidonhang.decorator.OrderService;
import iuh.quanlidonhang.state.OrderContext;

public class Runner {
    public static void main(String[] args) {
        OrderContext order = new OrderContext();
        order.process();
        order.process();

        OrderService orderService =
                new InsuranceDecorator(new BasicOrder());
        System.out.println("Tổng tiền: " + orderService.cost());
    }
}
