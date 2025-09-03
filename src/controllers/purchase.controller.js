import * as purchaseService from "../services/purchase.service.js";

export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const ticket = await purchaseService.processPurchase(cid, req.user);
    res.status(200).json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
