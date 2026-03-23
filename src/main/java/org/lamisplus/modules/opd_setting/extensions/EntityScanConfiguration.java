package org.lamisplus.modules.opd_setting.extensions;

import com.foreach.across.core.annotations.ModuleConfiguration;
import com.foreach.across.modules.hibernate.provider.HibernatePackageConfigurer;
import com.foreach.across.modules.hibernate.provider.HibernatePackageRegistry;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.opd_setting.domain.OpdDomain;
import org.lamisplus.modules.patient.domain.PatientDomain;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
@ModuleConfiguration({"AcrossHibernateJpaModule"})
public class EntityScanConfiguration implements HibernatePackageConfigurer {

    public void configureHibernatePackage(HibernatePackageRegistry hibernatePackageRegistry) {
        hibernatePackageRegistry.addPackageToScan(OpdDomain.class, PatientDomain.class);
    }
}
