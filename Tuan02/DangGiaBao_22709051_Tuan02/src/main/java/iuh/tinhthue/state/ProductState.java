package iuh.tinhthue.state;

import iuh.tinhthue.strategy.TaxStrategy;

public interface ProductState {
    TaxStrategy getTaxStrategy();
}

