import { Tenant } from "../modules/tenant/tenant.model";
import { User } from "../modules/user/user.model";
import { Role } from "../constants/roles";
import bcrypt from "bcrypt";

export async function seedDevData() {
    if (process.env.NODE_ENV !== "development") {
        return;
    }

    try {
        let tenant = await Tenant.findOne({ name: "Tenant A" });
        if (!tenant) {
            tenant = await Tenant.create({ name: "Tenant A" });
        }

        const hashedPassword = await bcrypt.hash("password123", 10);

        let user = await User.findOne({ email: "admin@test.com" });
        if (!user) {
            await User.create({
                email: "admin@test.com",
                password: hashedPassword,
                role: Role.TENANT_ADMIN,
                tenantId: tenant._id,
            });
            console.log("Development seed complete (Created)");
        } else {
            user.password = hashedPassword;
            user.role = Role.TENANT_ADMIN;
            user.tenantId = tenant._id as any;
            await user.save();
            console.log("Development seed complete (Updated)");
        }
    } catch (error) {
        console.error("Failed to seed development data:", error);
    }
}
