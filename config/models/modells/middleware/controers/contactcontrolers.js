const Contact = require('../models/Contact');
const User = require('../models/User');
const Email = require('../utils/emailTemplates');
const { validationResult } = require('express-validator');
const geoip = require('geoip-lite');

// @desc    Create new contact form submission
// @route   POST /api/contact
// @access  Public
exports.createContact = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, company, phone, service, message } = req.body;

    // Get client information
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    const geo = geoip.lookup(ipAddress);

    // Create contact
    const contact = await Contact.create({
      name,
      email,
      company,
      phone,
      service,
      message,
      ipAddress,
      userAgent,
      location: geo ? {
        country: geo.country,
        city: geo.city,
        region: geo.region
      } : undefined
    });

    // Send confirmation email to user
    try {
      await Email.sendContactConfirmation({
        email: contact.email,
        name: contact.name,
        subject: 'Thank you for contacting Cyber Guard Solutions',
        message: contact.message
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    // Send notification to admin
    try {
      const adminUsers = await User.find({ role: 'admin' }).select('email');
      const adminEmails = adminUsers.map(user => user.email);
      
      if (adminEmails.length > 0) {
        await Email.sendAdminNotification({
          emails: adminEmails,
          contact: contact.toObject()
        });
      }
    } catch (notificationError) {
      console.error('Admin notification failed:', notificationError);
    }

    res.status(201).json({
      status: 'success',
      message: 'Thank you for your message! We will contact you soon.',
      data: {
        contact: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          service: contact.service
        }
      }
    });

  } catch (error) {
    console.error('Contact creation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process your request. Please try again.'
    });
  }
};

// @desc    Get all contact submissions (with filtering, sorting, pagination)
// @route   GET /api/contact
// @access  Private/Admin
exports.getAllContacts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      status,
      priority,
      service,
      search
    } = req.query;

    // Build query
    let query = {};
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (service) query.service = service;
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const contacts = await Contact.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('assignedTo', 'name email')
      .populate('notes.createdBy', 'name');

    // Get total count for pagination
    const total = await Contact.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: contacts.length,
      data: {
        contacts,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch contacts'
    });
  }
};

// @desc    Get contact by ID
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('notes.createdBy', 'name');

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { contact }
    });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch contact'
    });
  }
};

// @desc    Update contact status
// @route   PATCH /api/contact/:id
// @access  Private/Admin
exports.updateContact = async (req, res) => {
  try {
    const { status, priority, assignedTo, notes, followUpDate, tags } = req.body;

    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
    }

    // Update fields
    if (status) contact.status = status;
    if (priority) contact.priority = priority;
    if (assignedTo) contact.assignedTo = assignedTo;
    if (followUpDate) contact.followUpDate = followUpDate;
    if (tags) contact.tags = tags;

    // Add note if provided
    if (notes && notes.content) {
      await contact.addNote(notes.content, req.user._id);
    }

    await contact.save();

    // Populate before sending response
    await contact.populate('assignedTo', 'name email');
    await contact.populate('notes.createdBy', 'name');

    res.status(200).json({
      status: 'success',
      message: 'Contact updated successfully',
      data: { contact }
    });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update contact'
    });
  }
};

// @desc    Get contact statistics
// @route   GET /api/contact/stats/overview
// @access  Private/Admin
exports.getContactStats = async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $facet: {
          statusCounts: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          priorityCounts: [
            {
              $group: {
                _id: '$priority',
                count: { $sum: 1 }
              }
            }
          ],
          serviceCounts: [
            {
              $group: {
                _id: '$service',
                count: { $sum: 1 }
              }
            }
          ],
          monthlyTrend: [
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 12 }
          ]
        }
      }
    ]);

    // Calculate total contacts
    const totalContacts = await Contact.countDocuments();

    // Calculate today's contacts
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysContacts = await Contact.countDocuments({
      createdAt: { $gte: today }
    });

    res.status(200).json({
      status: 'success',
      data: {
        overview: {
          total: totalContacts,
          today: todaysContacts
        },
        ...stats[0]
      }
    });

  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch contact statistics'
    });
  }
};