import { prisma } from '../../lib/prisma.js';
import { generateHotspotContent } from '../../utils/ai.js';
import { successResponse, errorResponse } from '../../utils/response.js';
import { STATUS_CODES, MESSAGES } from '../../constants/constants.js';

export const createHotspot = async (req, res) => {
  try {
    const { productId } = req.params;
    const { x, y, z, title, generateAi } = req.body;

    let content = req.body.content || "Select this feature to learn more.";

    if (generateAi) {
      const product = await prisma.product.findUnique({ where: { id: productId } });
      content = await generateHotspotContent(title, product.description);
    }

    const hotspot = await prisma.hotspot.create({
      data: {
        productId,
        x: parseFloat(x),
        y: parseFloat(y),
        z: parseFloat(z),
        title,
        content,
        isAiGenerated: !!generateAi
      }
    });

    return successResponse(res, STATUS_CODES.CREATED, "Hotspot created", hotspot);
  } catch (error) {
    return errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const getHotspotsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const hotspots = await prisma.hotspot.findMany({
      where: { productId }
    });
    return successResponse(res, STATUS_CODES.OK, "Hotspots fetched", hotspots);
  } catch (error) {
    return errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const deleteHotspot = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.hotspot.delete({ where: { id } });
    return successResponse(res, STATUS_CODES.OK, "Hotspot deleted");
  } catch (error) {
    return errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error.message);
  }
};
