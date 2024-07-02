DO $$ BEGIN
 ALTER TABLE "OrganizationUser" ADD CONSTRAINT "OrganizationUser_organizationId_Organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
