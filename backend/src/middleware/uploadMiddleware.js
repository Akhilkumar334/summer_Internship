const multer = require('multer');
const path = require('path');

// Configure Disk Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/resumes'));
  },
  filename: (req, file, cb) => {
    // Generate unique name: userId-timestamp-cleanName
    const userId = req.user ? req.user.id : 'anonymous';
    const timestamp = Date.now();
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `${userId}-${timestamp}-${cleanName}`);
  }
});

// File Filter (PDF and Word docs only)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF (.pdf) and Word documents (.doc, .docx) are allowed'), false);
  }
};

// Initialize Multer
const uploadResume = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('resume'); // field name: 'resume'

module.exports = uploadResume;
