const Log = require('../models/Log');

// Get all logs
exports.getLogs = async (req, res) => {
    try {
        const logs = await Log.find().sort({ createdAt: -1 }); // Fetch logs sorted by creation date (newest first)
        const transformedLogs = logs.map(log => ({
            id: log._id,
            productName: log.productName,
            action: log.action,
            details: log.details,
            createdAt: log.createdAt
        }));
        res.status(200).json({ success: true, data: transformedLogs });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ success: false, message: 'Error fetching logs' });
    }
};