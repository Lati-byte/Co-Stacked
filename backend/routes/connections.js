const express = require("express");
const router = express.Router();
const User = require("../models/User");

/* =============================
   SEND CONNECTION REQUEST
============================= */
router.post("/request/:targetId", async (req, res) => {
  try {
    const { userId } = req.body;

    if (userId === req.params.targetId)
      return res.status(400).json({ error: "You cannot connect with yourself" });

    const me = await User.findById(userId);
    const target = await User.findById(req.params.targetId);

    if (!me || !target)
      return res.status(404).json({ error: "User not found" });

    // Already connected?
    if (me.connections.includes(target._id))
      return res.json({ message: "Already connected" });

    // Already requested?
    if (me.sentRequests.includes(target._id))
      return res.json({ message: "Request already sent" });

    // Add request to target's "incoming"
    target.connectionRequests.push(me._id);

    // Add request to my "sent"
    me.sentRequests.push(target._id);

    await me.save();
    await target.save();

    res.json({ message: "Request sent" });
  } catch (err) {
    res.status(500).json(err);
  }
});

/* =============================
   WITHDRAW REQUEST
============================= */
router.post("/withdraw/:targetId", async (req, res) => {
  try {
    const { userId } = req.body;

    const me = await User.findById(userId);
    const target = await User.findById(req.params.targetId);

    me.sentRequests = me.sentRequests.filter(id => id.toString() !== target._id.toString());
    target.connectionRequests = target.connectionRequests.filter(id => id.toString() !== me._id.toString());

    await me.save();
    await target.save();

    res.json({ message: "Request withdrawn" });
  } catch (err) {
    res.status(500).json(err);
  }
});

/* =============================
   ACCEPT REQUEST
============================= */
router.post("/accept/:requesterId", async (req, res) => {
  try {
    const { userId } = req.body; // me

    const me = await User.findById(userId);
    const requester = await User.findById(req.params.requesterId);

    if (!me || !requester)
      return res.status(404).json({ error: "User not found" });

    // Remove from incoming
    me.connectionRequests = me.connectionRequests.filter(id => id.toString() !== requester._id.toString());

    // Remove from requester's sent
    requester.sentRequests = requester.sentRequests.filter(id => id.toString() !== me._id.toString());

    // Add each other to connections
    me.connections.push(requester._id);
    requester.connections.push(me._id);

    await me.save();
    await requester.save();

    res.json({ message: "Connection accepted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

/* =============================
   IGNORE REQUEST
============================= */
router.post("/ignore/:requesterId", async (req, res) => {
  try {
    const { userId } = req.body;

    const me = await User.findById(userId);
    const requester = await User.findById(req.params.requesterId);

    me.connectionRequests = me.connectionRequests.filter(id => id.toString() !== requester._id.toString());
    requester.sentRequests = requester.sentRequests.filter(id => id.toString() !== me._id.toString());

    await me.save();
    await requester.save();

    res.json({ message: "Request ignored" });
  } catch (err) {
    res.status(500).json(err);
  }
});

/* =============================
   REMOVE CONNECTION
============================= */
router.post("/remove/:targetId", async (req, res) => {
  try {
    const { userId } = req.body;

    const me = await User.findById(userId);
    const target = await User.findById(req.params.targetId);

    me.connections = me.connections.filter(id => id.toString() !== target._id.toString());
    target.connections = target.connections.filter(id => id.toString() !== me._id.toString());

    await me.save();
    await target.save();

    res.json({ message: "Connection removed" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;