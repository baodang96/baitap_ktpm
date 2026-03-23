package ktpm.database_partition_demo.vertical.repository;

import ktpm.database_partition_demo.vertical.entity.UserBasic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserBasicRepository extends JpaRepository<UserBasic, Long> {
}
