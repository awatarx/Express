const { body, validationResult } = require('express-validator');

const taskValidations = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .notEmpty()
    .withMessage('Title cannot be empty'),

  body('description')
    .optional() // Description is optional, so not required
    .isString()
    .withMessage('Description must be a string'),

  body('priority')
    .optional() // Priority is optional, so not required
    .isString()
    .trim()
    .toUpperCase() 
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Priority must be one of: LOW, MEDIUM, HIGH'),

  body('deadline')
    .optional() // Deadline is optional, so not required
    .isISO8601()
    .toDate()
    .withMessage('Invalid deadline format'),

  body('is_completed')
    .optional() // is_completed is optional, so not required
    .isBoolean()
    .withMessage('is_completed must be a boolean'),

  // Add more validations as needed
];

const validateTask = (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // No validation errors, proceed to the next middleware or route handler
  next();
};

module.exports = { taskValidations, validateTask };
