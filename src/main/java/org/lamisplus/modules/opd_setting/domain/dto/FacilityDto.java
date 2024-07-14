package org.lamisplus.modules.opd_setting.domain.dto;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

public class FacilityDto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long parentOrganisationUnitId;
    private String archived;
    private String details;
    private String dateCreated;
    private String dateModified;
    private String organisationUnitLevelId;
    private String name;
    private String description;
    private String uuid;
    private String modifiedBy;
    private String createdBy;

    public FacilityDto(Long id, Long parentOrganisationUnitId, String archived, String details, String dateCreated, String dateModified, String organisationUnitLevelId, String name, String description, String uuid, String modifiedBy, String createdBy) {
        this.id = id;
        this.parentOrganisationUnitId = parentOrganisationUnitId;
        this.archived = archived;
        this.details = details;
        this.dateCreated = dateCreated;
        this.dateModified = dateModified;
        this.organisationUnitLevelId = organisationUnitLevelId;
        this.name = name;
        this.description = description;
        this.uuid = uuid;
        this.modifiedBy = modifiedBy;
        this.createdBy = createdBy;
    }

    public FacilityDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getParentOrganisationUnitId() {
        return parentOrganisationUnitId;
    }

    public void setParentOrganisationUnitId(Long parentOrganisationUnitId) {
        this.parentOrganisationUnitId = parentOrganisationUnitId;
    }

    public String getArchived() {
        return archived;
    }

    public void setArchived(String archived) {
        this.archived = archived;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(String dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getDateModified() {
        return dateModified;
    }

    public void setDateModified(String dateModified) {
        this.dateModified = dateModified;
    }

    public String getOrganisationUnitLevelId() {
        return organisationUnitLevelId;
    }

    public void setOrganisationUnitLevelId(String organisationUnitLevelId) {
        this.organisationUnitLevelId = organisationUnitLevelId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}
