package ktpm.database_partition_demo.vertical.repository;

import ktpm.database_partition_demo.vertical.entity.UserDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDetailRepository extends JpaRepository<UserDetail, Long> {
}
