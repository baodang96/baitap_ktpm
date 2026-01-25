package iuh.tinhthue.decorator;

import iuh.tinhthue.strategy.TaxStrategy;

public class EnvironmentalTaxDecorator implements TaxStrategy {
    private TaxStrategy tax;
    public EnvironmentalTaxDecorator(TaxStrategy tax) {
        this.tax = tax;
    }

    public double calculate(double price) {
        return tax.calculate(price) + 5;
    }
}

