
//D:\resumeproject\server\src\modules\tenant\tenant.controller.ts
import { Request, Response } from 'express';
import { Tenant } from './tenant.model';
import {
  createTenantSchema,
  updateTenantSchema
} from './tenant.validation';

import { logAudit } from "../audit/audit.service";
/**
 * CREATE TENANT (ADMIN)
 */
export const createTenant = async (req: Request, res: Response) => {
  const data = createTenantSchema.parse(req.body);
  const tenant = await Tenant.create(data);
  res.status(201).json(tenant);
};

/**
 * GET TENANTS (PAGINATED)
 */
export const getTenants = async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Tenant.find({ isDeleted: false }).skip(skip).limit(limit),
    Tenant.countDocuments({ isDeleted: false })
  ]);

  res.json({
    data,
    page,
    total,
    totalPages: Math.ceil(total / limit)
  });
};

/**
 * UPDATE TENANT
 */
export const updateTenant = async (req: Request, res: Response) => {
  const data = updateTenantSchema.parse(req.body);

  const updated = await Tenant.findByIdAndUpdate(
    req.params.id,
    data,
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ message: 'Tenant not found' });
  }

  res.json(updated);
};

/**
 * SOFT DELETE TENANT (ADMIN)
 */
export const deleteTenant = async (req: Request, res: Response) => {
  const deleted = await Tenant.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );

  if (!deleted) {
    return res.status(404).json({ message: 'Tenant not found' });
  }

  res.json({ success: true });
};

// src/modules/tenant/tenant.controller.ts
export const getTenantById = async (req: Request, res: Response) => {
  const tenant = await Tenant.findById(req.params.tenantId);

  if (!tenant) {
    return res.status(404).json({ message: "Tenant not found" });
  }

  await logAudit({
    req,
    action: "READ_TENANT",
    resource: "TENANT",
    resourceId: tenant.id,
    outcome: "ALLOW",
  });

  res.json(tenant);
};

/**
 * GET ALL TENANTS (SUPER_ADMIN ONLY)
 */
export const getAllTenants = async (req: Request, res: Response) => {
  const tenants = await Tenant.find({}, '_id name createdAt').lean();
  res.json({
    success: true,
    data: tenants
  });
};

