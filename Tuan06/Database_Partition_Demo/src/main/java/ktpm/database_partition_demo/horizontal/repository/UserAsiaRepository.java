package ktpm.database_partition_demo.horizontal.repository;

import ktpm.database_partition_demo.horizontal.entity.UserAsia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAsiaRepository extends JpaRepository<UserAsia, Long> {
}
