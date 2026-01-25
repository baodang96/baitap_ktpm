package iuh.quanlidonhang.state;

public class NewOrderState implements OrderState {
    @Override
    public void handle(OrderContext order) {
        System.out.println("Kiểm tra thông tin đơn hàng");
        order.setState(new ProcessingState());
    }
}

