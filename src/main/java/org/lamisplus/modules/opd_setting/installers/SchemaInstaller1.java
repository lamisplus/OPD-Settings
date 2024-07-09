package org.lamisplus.modules.opd_setting.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(1)
@Installer(name = "schema-installer-opd_setting",
        description = "Installs the required opd_setting tables",
        version = 1)
public class SchemaInstaller1 extends AcrossLiquibaseInstaller {
    public SchemaInstaller1() {
        super("classpath:installers/starter/schema/schema-1.xml");
    }
}
