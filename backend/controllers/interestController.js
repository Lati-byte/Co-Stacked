// backend/controllers/interestController.js

// Ensure the casing of the model import matches your actual filenames
const Interest = require('../models/Interest');
const Project = require('../models/Project');
const Conversation = require('../models/Conversation');

/**
 * @desc    Create a new interest/connection request
 * @route   POST /api/interests
 * @access  Private (Requires authentication)
 */
const createInterest = async (req, res) => {
  try {
    const { projectId } = req.body;
    const senderId = req.user._id; // Attached by the 'protect' middleware

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required.' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // --- Business Logic & Security Checks ---
    if (senderId.toString() === project.founderId.toString()) {
      return res.status(400).json({ message: 'You cannot connect to your own project.' });
    }

    if (await Interest.findOne({ projectId, senderId })) {
      return res.status(400).json({ message: 'You have already shown interest in this project.' });
    }
    // ------------------------------------

    const interest = await Interest.create({
      projectId,
      senderId,
      receiverId: project.founderId,
    });

    res.status(201).json(interest);
  } catch (error) {
    console.error(`[CREATE INTEREST ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error while creating interest request.' });
  }
};

/**
 * @desc    Get all interest requests RECEIVED by the logged-in user (for Founders)
 * @route   GET /api/interests/received
 * @access  Private
 */
const getReceivedInterests = async (req, res) => {
  try {
    const interests = await Interest.find({ receiverId: req.user._id })
      .populate('senderId', 'name role avatarUrl') // Get the sender's details
      .populate('projectId', 'title')             // Get the project's title
      .sort({ createdAt: -1 });
    res.json(interests);
  } catch (error) {
    console.error(`[GET RECEIVED INTERESTS ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching received interests.' });
  }
};

/**
 * @desc    Get all interest requests SENT by the logged-in user (for Developers)
 * @route   GET /api/interests/sent
 * @access  Private
 */
const getSentInterests = async (req, res) => {
  try {
    const interests = await Interest.find({ senderId: req.user._id })
        .populate('projectId', 'title description skillsNeeded compensation stage founder founderId') 
      .populate('receiverId', 'name')
      .sort({ createdAt: -1 });
    res.json(interests);;
  } catch (error) {
    console.error(`[GET SENT INTERESTS ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching sent interests.' });
  }
};

/**
 * @desc    Respond to an interest request (approve/reject)
 * @route   PUT /api/interests/:id/respond
 * @access  Private (Founders only)
 */
/**
 * @desc    Respond to an interest request (approve/reject)
 * @route   PUT /api/interests/:id/respond
 * @access  Private
 */
const respondToInterest = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'A valid status ("approved" or "rejected") is required.' });
    }

    const interest = await Interest.findById(req.params.id)
        .populate('senderId', 'name')
        .populate('receiverId', 'name')
        .populate('projectId', 'title');

    if (!interest) {
      return res.status(404).json({ message: 'Interest request not found.' });
    }

    // Security & Logic Checks
    if (interest.receiverId._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to respond to this request.' });
    }
    if (interest.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been responded to.' });
    }

    interest.status = status;
    const updatedInterest = await interest.save();

    let conversation;
    // If the request was approved, create or find the relevant conversation
    if (status === 'approved') {
      const participants = [interest.senderId._id, interest.receiverId._id];
      
      // Look for an existing conversation
      let existingConversation = await Conversation.findOne({
        projectId: interest.projectId._id,
        participants: { $all: participants },
      }).populate('participants', 'name role avatarUrl'); // Also populate the new convo

      // If no conversation exists, create a new one
      if (!existingConversation) {
        const newConversation = await Conversation.create({
          participants,
          projectId: interest.projectId._id,
        });
        // Populate the new conversation to match the structure of an existing one
        existingConversation = await Conversation.findById(newConversation._id).populate('participants', 'name role avatarUrl');
        console.log(`New conversation created: ${existingConversation._id}`);
      }
      conversation = existingConversation;
    }
    
    // Respond with the updated interest and include the conversation if it was approved.
    // .toObject() converts the Mongoose document to a plain JS object so we can add properties.
    const responsePayload = updatedInterest.toObject();
    if (conversation) {
      responsePayload.conversation = conversation;
    }

    res.json(responsePayload);

  } catch (error) {
    console.error(`[RESPOND TO INTEREST ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error while responding to interest.' });
  }
};

// Ensure all functions are exported
module.exports = { 
  createInterest,
  getReceivedInterests,
  respondToInterest,
  getSentInterests,
};


console.log("Verifying exports from interestController.js:", module.exports.getSentInterests ? "getSentInterests is exported." : "getSentInterests is NOT exported.");