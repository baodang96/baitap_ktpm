package ktpm.database_partition_demo.horizontal.repository;

import ktpm.database_partition_demo.horizontal.entity.UserUS;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserUSRepository extends JpaRepository<UserUS, Long> {
}
