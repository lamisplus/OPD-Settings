package org.lamisplus.modules.opd_setting.controller;

import org.lamisplus.modules.opd_setting.domain.dto.PostDto;
import org.lamisplus.modules.opd_setting.domain.entity.Facility;
import org.lamisplus.modules.opd_setting.domain.entity.Post;
import org.lamisplus.modules.opd_setting.service.FacilityService;
import org.lamisplus.modules.opd_setting.service.PostService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/v1/opd/facilities")
public class FaclityController {
    @Autowired
    private FacilityService facilityService;

    @GetMapping
    public List<Facility> getAllFacilities() {
        return facilityService.getAllFacilities();
    }
}

