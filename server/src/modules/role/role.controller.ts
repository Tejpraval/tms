import { Request, Response } from 'express';
import { Role } from './role.model';
import { User } from '../user/user.model';
import { Permission } from '../../constants/permissions';

export const getRoles = async (req: Request, res: Response) => {
    try {
        if (req.user?.role === 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'SUPER_ADMIN cannot access tenant roles directly.' });
        }
        const tenantId = req.user?.tenantId;
        const roles = await Role.find({ tenantId }).lean();
        res.json({ success: true, data: roles });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createRole = async (req: Request, res: Response) => {
    try {
        if (req.user?.role === 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'SUPER_ADMIN cannot create tenant roles.' });
        }

        const tenantId = req.user?.tenantId;
        const { name, permissions } = req.body;

        if (!name || typeof name !== 'string' || !permissions || !Array.isArray(permissions) || permissions.length === 0) {
            return res.status(400).json({ message: 'Name and a non-empty permissions array are required.' });
        }

        const validPermissions = Object.values(Permission);
        const invalid = permissions.some((p: any) => !validPermissions.includes(p));
        if (invalid) {
            return res.status(400).json({ message: 'Invalid permission in array.' });
        }

        const existing = await Role.findOne({ name, tenantId });
        if (existing) {
            return res.status(409).json({ message: 'Role with this name already exists in this tenant.' });
        }

        const role = await Role.create({ name, tenantId, permissions });
        res.status(201).json({ success: true, data: role });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateRolePermissions = async (req: Request, res: Response) => {
    try {
        if (req.user?.role === 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'SUPER_ADMIN cannot update tenant roles.' });
        }

        const tenantId = req.user?.tenantId;
        const roleId = req.params.id;
        const { permissions } = req.body;

        if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
            return res.status(400).json({ message: 'Non-empty permissions array is required.' });
        }

        const validPermissions = Object.values(Permission);
        const invalid = permissions.some((p: any) => !validPermissions.includes(p));
        if (invalid) {
            return res.status(400).json({ message: 'Invalid permission in array.' });
        }

        const updated = await Role.findOneAndUpdate(
            { _id: roleId, tenantId },
            { permissions },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Role not found in your tenant.' });
        }

        res.json({ success: true, data: updated });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteRole = async (req: Request, res: Response) => {
    try {
        if (req.user?.role === 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'SUPER_ADMIN cannot delete tenant roles.' });
        }

        const tenantId = req.user?.tenantId;
        const roleId = req.params.id;

        const assignedUsersCount = await User.countDocuments({ customRoleId: roleId, tenantId });
        if (assignedUsersCount > 0) {
            return res.status(400).json({ message: 'Cannot delete a role that is currently assigned to users.' });
        }

        const deleted = await Role.findOneAndDelete({ _id: roleId, tenantId });
        if (!deleted) {
            return res.status(404).json({ message: 'Role not found in your tenant.' });
        }

        res.json({ success: true, message: 'Role deleted successfully.' });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
