package org.lamisplus.modules.opd_setting.repository;

import org.lamisplus.modules.opd_setting.domain.entity.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {
}
