package iuh.tinhthue;

import iuh.tinhthue.decorator.EnvironmentalTaxDecorator;
import iuh.tinhthue.state.LuxuryProduct;
import iuh.tinhthue.state.ProductState;
import iuh.tinhthue.strategy.TaxStrategy;

public class Runner {
    public static void main(String[] args) {
        ProductState product = new LuxuryProduct();
        TaxStrategy tax =
                new EnvironmentalTaxDecorator(product.getTaxStrategy());

        System.out.println("Thuế phải trả: " + tax.calculate(1000));
    }
}
