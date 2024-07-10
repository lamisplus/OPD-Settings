package org.lamisplus.modules.opd_setting.domain.entity;

import javax.persistence.*;

import lombok.*;
@Table(name="patient_check_post_service")
@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "facility_id")
    private Long facilityId;
    @Column(name = "module_service_code")
    private String moduleServiceCode;
    @Column(name = "module_service_name")
    private String moduleServiceName;
    @Column(name = "encounter_type")
    private String encounterType;

    public Post(Long id, Long facilityId, String moduleServiceName, String moduleServiceCode, String encounterType) {
        this.id = id;
        this.facilityId = facilityId;
        this.moduleServiceName = moduleServiceName;
        this.moduleServiceCode = moduleServiceCode;
        this.encounterType = encounterType;
    }
    public Post() {
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFacilityId() {
        return facilityId;
    }

    public void setFacilityId(Long facilityId) {
        this.facilityId = facilityId;
    }

    public String getModuleServiceName() {
        return moduleServiceName;
    }

    public void setModuleServiceName(String moduleServiceName) {
        this.moduleServiceName = moduleServiceName;
    }

    public String getModuleServiceCode() {
        return moduleServiceCode;
    }

    public void setModuleServiceCode(String moduleServiceCode) {
        this.moduleServiceCode = moduleServiceCode;
    }

    public String getEncounter() {
        return encounterType;
    }

    public void setEncounterType(String encounter) {
        this.encounterType = encounter;
    }
}
