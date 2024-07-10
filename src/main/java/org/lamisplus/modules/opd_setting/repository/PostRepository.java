package org.lamisplus.modules.opd_setting.repository;

import org.lamisplus.modules.opd_setting.domain.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
}
