import { newsletterSubscriberService } from "../services/newsletterSubscriber.service.js";

export const newsletterSubscriberController = {
  create: async (req, res) => {
    try {
      const rec = await newsletterSubscriberService.create(req.body);
      return res.status(201).json({ message: "Subscribed", data: rec });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const list = await newsletterSubscriberService.getAll();
      return res.json(list);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const rec = await newsletterSubscriberService.getById(req.params.id);
      if (!rec) return res.status(404).json({ message: "Subscriber not found" });
      return res.json(rec);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const updated = await newsletterSubscriberService.update(req.params.id, req.body);
      return res.json({ message: "Updated", data: updated });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await newsletterSubscriberService.remove(req.params.id);
      return res.json({ message: "Deleted" });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
};
