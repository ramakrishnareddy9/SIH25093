// utils/response.js
const createSuccessResponse = (data, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };

  // Remove message if not needed for some endpoints
  if (!message || message === 'Success') {
    delete response.message;
  }

  return response;
};

const createErrorResponse = (message = 'An error occurred', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (errors) {
    response.errors = errors;
  }

  return response;
};

const createPaginatedResponse = (data, page, limit, total, message = 'Data retrieved successfully') => {
  return {
    success: true,
    message,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse
};
