import { Request, Response } from 'express';
import { User, IUser } from './user.model';
import bcrypt from 'bcrypt';
import { Role as StaticRoleEnum } from '../../constants/roles';
import { Role as CustomRoleModel } from '../role/role.model';

/**
 * Valid tenant roles. 
 * Explicitly excludes SUPER_ADMIN and ADMIN (Platform-level roles).
 */
const VALID_TENANT_ROLES = [StaticRoleEnum.TENANT_ADMIN, StaticRoleEnum.MANAGER, StaticRoleEnum.TENANT];

export const getUsers = async (req: Request, res: Response) => {
    try {
        if (req.user?.role === 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'SUPER_ADMIN cannot access tenant user management directly.' });
        }

        const tenantId = req.user?.tenantId;
        if (!tenantId) {
            return res.status(401).json({ message: 'Unauthorized: No tenant context' });
        }

        // Strictly project only safe fields.
        const users = await User.find(
            { tenantId },
            '_id email role customRoleId createdAt'
        ).populate('customRoleId', 'name').lean();

        res.json({
            success: true,
            data: users
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        if (req.user?.role === 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'SUPER_ADMIN cannot access tenant user management directly.' });
        }

        const tenantId = req.user?.tenantId;
        const { email, password, role, customRoleId } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        if (customRoleId) {
            const roleDoc = await CustomRoleModel.findOne({ _id: customRoleId, tenantId });
            if (!roleDoc) {
                return res.status(404).json({ message: 'Custom role not found in this tenant.' });
            }
        } else {
            if (!role) {
                return res.status(400).json({ message: 'Role is required.' });
            }
            // STRICT: Validate role is a valid tenant-level role
            if (!VALID_TENANT_ROLES.includes(role)) {
                return res.status(403).json({ message: 'Invalid or restricted role assignment.' });
            }
        }

        const effectiveRole = customRoleId ? StaticRoleEnum.TENANT : role;

        // Check email uniqueness within the tenant specifically
        const existing = await User.findOne({ email, tenantId });
        if (existing) {
            return res.status(409).json({ message: 'User with this email already exists in this tenant.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            role: effectiveRole,
            tenantId, // STRICT: Force tenantId from JWT context implicitly.
            customRoleId: customRoleId || null
        });

        res.status(201).json({
            success: true,
            data: {
                _id: newUser._id,
                email: newUser.email,
                role: newUser.role,
                customRoleId: newUser.customRoleId,
                createdAt: (newUser as any).createdAt
            }
        });

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        if (req.user?.role === 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'SUPER_ADMIN cannot access tenant user management directly.' });
        }

        const tenantId = req.user?.tenantId;
        const targetUserId = req.params.id;
        const { role, customRoleId } = req.body;

        // Reject self-modification
        if (req.user?.id === targetUserId) {
            return res.status(403).json({ message: 'Cannot modify your own role.' });
        }

        if (customRoleId) {
            const roleDoc = await CustomRoleModel.findOne({ _id: customRoleId, tenantId });
            if (!roleDoc) {
                return res.status(404).json({ message: 'Custom role not found in this tenant.' });
            }
        } else {
            if (!role) {
                return res.status(400).json({ message: 'Role is required.' });
            }
            if (!VALID_TENANT_ROLES.includes(role)) {
                return res.status(403).json({ message: 'Invalid or restricted role assignment.' });
            }
        }

        const effectiveRole = customRoleId ? StaticRoleEnum.TENANT : role;
        const mappedCustomRoleId = customRoleId || null;

        // STRICT: Bind update to both user ID AND the caller's tenantId 
        const updated = await User.findOneAndUpdate(
            { _id: targetUserId, tenantId },
            { role: effectiveRole, customRoleId: mappedCustomRoleId },
            { new: true, select: '_id email role customRoleId createdAt' }
        ).populate('customRoleId', 'name');

        if (!updated) {
            return res.status(404).json({ message: 'User not found in your tenant.' });
        }

        res.json({
            success: true,
            data: updated
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        if (req.user?.role === 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'SUPER_ADMIN cannot access tenant user management directly.' });
        }

        const tenantId = req.user?.tenantId;
        const targetUserId = req.params.id;

        // Reject self-deletion
        if (req.user?.id === targetUserId) {
            return res.status(403).json({ message: 'Cannot delete your own account.' });
        }

        // STRICT: Bind deletion to both user ID AND the caller's tenantId
        const deleted = await User.findOneAndDelete({ _id: targetUserId, tenantId });

        if (!deleted) {
            return res.status(404).json({ message: 'User not found in your tenant.' });
        }

        res.json({
            success: true,
            message: 'User deleted successfully.'
        });

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
