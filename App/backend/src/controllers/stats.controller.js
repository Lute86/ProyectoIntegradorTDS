import * as statsService from '../services/stats.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success } from '../utils/response.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await statsService.getDashboardStats();
  return success(res, stats, 'Estadísticas obtenidas exitosamente');
});
