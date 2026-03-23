package ktpm.database_partition_demo.functional.entity;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class Order {
    @Entity
    @Table(name = "orders")
    public class Order {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private Long userId;
        private Double total;
    }
}
