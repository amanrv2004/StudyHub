const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Payment = require('../models/Payment');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    
    // Aggregation for attendance this month for all students
    const now = new Date();
    const istNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const istYear = istNow.getFullYear();
    const istMonth = istNow.getMonth();
    
    // Month-Year string for regex match (e.g., "MAR 2026")
    const monthYear = istNow.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toUpperCase();
    
    const attendanceStats = await Attendance.aggregate([
      { $match: { date: { $regex: monthYear + "$" } } },
      { $group: { _id: "$studentId", distinctDays: { $addToSet: "$date" } } },
      { $project: { studentId: "$_id", count: { $size: "$distinctDays" } } }
    ]);
    
    const attendanceMap = {};
    attendanceStats.forEach(stat => {
      attendanceMap[stat.studentId.toString()] = stat.count;
    });

    const studentsWithCalculatedAttendance = students.map(student => {
      const studentObj = student.toObject();
      const distinctDays = attendanceMap[student._id.toString()] || 0;
      
      // Calculate against total days in the month as requested by the user
      const totalDaysInMonth = new Date(istYear, istMonth + 1, 0).getDate();
      
      studentObj.attendancePercentage = Math.min(100, Math.round((distinctDays / totalDaysInMonth) * 100));
      studentObj.daysAttendedThisMonth = distinctDays;
      return studentObj;
    });

    res.json(studentsWithCalculatedAttendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET specific student
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const now = new Date();
    const istNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const istYear = istNow.getFullYear();
    const istMonth = istNow.getMonth();
    
    // Month-Year string for regex match (e.g., "MAR 2026")
    const monthYear = istNow.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toUpperCase();

    const distinctDaysThisMonth = await Attendance.distinct('date', { 
      studentId: student._id,
      date: { $regex: monthYear + "$" }
    });

    // Calculate against total days in the month as requested
    const totalDaysInMonth = new Date(istYear, istMonth + 1, 0).getDate();

    const studentObj = student.toObject();
    studentObj.attendancePercentage = Math.min(100, Math.round((distinctDaysThisMonth.length / totalDaysInMonth) * 100));
    studentObj.daysAttendedThisMonth = distinctDaysThisMonth.length;
    
    res.json(studentObj);
  } catch (err) {
    res.status(404).json({ message: 'Student not found' });
  }
});

// POST new student with uploads
router.post('/', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'idProof', maxCount: 1 }
]), async (req, res) => {
  try {
    const studentData = req.body;
    
    // Hash Password
    const salt = await bcrypt.genSalt(10);
    studentData.password = await bcrypt.hash(studentData.password || '123456', salt);
    
    // Assign file paths if uploaded
    if (req.files) {
      if (req.files.profilePhoto) studentData.profilePhoto = req.files.profilePhoto[0].path;
      if (req.files.idProof) studentData.idProof = req.files.idProof[0].path;
    }

    const student = new Student(studentData);
    const newStudent = await student.save();
    console.log('Student created:', newStudent.fullName, newStudent._id);

    // Create a payment record for Security Deposit if it's provided
    if (newStudent.securityDeposit > 0) {
      console.log('Creating security deposit record for amount:', newStudent.securityDeposit);
      const securityPayment = new Payment({
        studentId: newStudent._id,
        studentName: newStudent.fullName,
        amount: newStudent.securityDeposit,
        method: 'Cash', // Default for initial deposit
        month: 'Initial Deposit',
        status: 'Paid',
        transactionId: 'SEC-' + Math.random().toString(36).substr(2, 9).toUpperCase()
      });
      await securityPayment.save();
      console.log('Security deposit record created successfully');
    }

    res.status(201).json(newStudent);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'STUDY_ID_CONFLICT: This Study ID or Email is already registered.' });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
});

// PATCH update student
router.patch('/:id', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'idProof', maxCount: 1 }
]), async (req, res) => {
  try {
    const updateData = req.body;
    
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    if (req.files) {
      if (req.files.profilePhoto) updateData.profilePhoto = req.files.profilePhoto[0].path;
      if (req.files.idProof) updateData.idProof = req.files.idProof[0].path;
    }

    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE student
router.delete('/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
