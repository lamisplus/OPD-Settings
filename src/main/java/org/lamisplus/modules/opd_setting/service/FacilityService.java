package org.lamisplus.modules.opd_setting.service;
import org.lamisplus.modules.opd_setting.domain.dto.PostDto;
import org.lamisplus.modules.opd_setting.domain.entity.Facility;
import org.lamisplus.modules.opd_setting.domain.entity.Post;
import org.lamisplus.modules.opd_setting.repository.FacilityRepository;
import org.lamisplus.modules.opd_setting.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;
@Service
public class FacilityService {
    @Autowired
    private FacilityRepository facilityRepository;

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public Optional<Facility> getFacilityById(Long id) {
        return facilityRepository.findById(id);
    }
}
