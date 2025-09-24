import { validationResult } from 'express-validator';
import {
  validateCreateAchievement,
  validateUpdateAchievement,
  validateAchievementId,
  validateApproval,
  validateRejectionReason,
  validateQueryParams
} from '../../src/middleware/validators/achievementValidator.js';

describe('Achievement Validator Middleware', () => {
  // Mock Express request/response objects
  const mockRequest = (body = {}, params = {}, query = {}) => ({
    body,
    params,
    query
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const next = jest.fn();

  describe('validateCreateAchievement', () => {
    it('should pass validation with valid data', async () => {
      const req = mockRequest({
        title: 'Test Achievement',
        type: 'academic',
        description: 'This is a test achievement',
        category: 'individual',
        skillsGained: ['JavaScript', 'Node.js'],
        isPublic: true
      });
      
      const res = mockResponse();
      
      // Run all validation middlewares
      for (const middleware of validateCreateAchievement) {
        if (typeof middleware === 'function') {
          await middleware(req, res, next);
          
          // If the middleware called res.status, it means validation failed
          if (res.status.mock.calls.length > 0) {
            break;
          }
        }
      }
      
      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('should fail validation with missing required fields', async () => {
      const req = mockRequest({
        // Missing title, type, description
        category: 'individual'
      });
      
      const res = mockResponse();
      
      // Run all validation middlewares
      for (const middleware of validateCreateAchievement) {
        if (typeof middleware === 'function') {
          await middleware(req, res, next);
          
          // If the middleware called res.status, it means validation failed
          if (res.status.mock.calls.length > 0) {
            break;
          }
        }
      }
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          expect.objectContaining({ msg: 'Title is required' }),
          expect.objectContaining({ msg: 'Description is required' }),
          expect.objectContaining({ msg: 'Invalid achievement type' })
        ])
      });
    });
  });

  describe('validateUpdateAchievement', () => {
    it('should pass validation with valid update data', async () => {
      const req = mockRequest(
        {
          title: 'Updated Title',
          description: 'Updated description'
        },
        { id: '507f1f77bcf86cd799439011' } // Valid ObjectId
      );
      
      const res = mockResponse();
      
      // Run all validation middlewares
      for (const middleware of validateUpdateAchievement) {
        if (typeof middleware === 'function') {
          await middleware(req, res, next);
          
          if (res.status.mock.calls.length > 0) {
            break;
          }
        }
      }
      
      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('should fail validation with invalid achievement ID', async () => {
      const req = mockRequest(
        { title: 'Updated Title' },
        { id: 'invalid-id' }
      );
      
      const res = mockResponse();
      
      // Run all validation middlewares
      for (const middleware of validateUpdateAchievement) {
        if (typeof middleware === 'function') {
          await middleware(req, res, next);
          
          if (res.status.mock.calls.length > 0) {
            break;
          }
        }
      }
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          expect.objectContaining({ msg: 'Invalid achievement ID' })
        ])
      });
    });
  });

  describe('validateAchievementId', () => {
    it('should pass validation with valid ObjectId', async () => {
      const req = mockRequest({}, { id: '507f1f77bcf86cd799439011' });
      const res = mockResponse();
      
      // Run all validation middlewares
      for (const middleware of validateAchievementId) {
        if (typeof middleware === 'function') {
          await middleware(req, res, next);
          
          if (res.status.mock.calls.length > 0) {
            break;
          }
        }
      }
      
      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('validateApproval', () => {
    it('should pass validation with valid achievement ID', async () => {
      const req = mockRequest({}, { id: '507f1f77bcf86cd799439011' });
      const res = mockResponse();
      
      // Run all validation middlewares
      for (const middleware of validateApproval) {
        if (typeof middleware === 'function') {
          await middleware(req, res, next);
          
          if (res.status.mock.calls.length > 0) {
            break;
          }
        }
      }
      
      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('validateRejectionReason', () => {
    it('should pass validation with valid reason', async () => {
      const req = mockRequest({ reason: 'Insufficient evidence provided' });
      const res = mockResponse();
      
      // Run all validation middlewares
      for (const middleware of validateRejectionReason) {
        if (typeof middleware === 'function') {
          await middleware(req, res, next);
          
          if (res.status.mock.calls.length > 0) {
            break;
          }
        }
      }
      
      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('should fail validation with missing reason', async () => {
      const req = mockRequest({});
      const res = mockResponse();
      
      // Run all validation middlewares
      for (const middleware of validateRejectionReason) {
        if (typeof middleware === 'function') {
          await middleware(req, res, next);
          
          if (res.status.mock.calls.length > 0) {
            break;
          }
        }
      }
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          expect.objectContaining({ msg: 'Rejection reason is required' })
        ])
      });
    });
  });

  describe('validateQueryParams', () => {
    it('should pass validation with valid query parameters', async () => {
      const req = mockRequest({}, {}, {
        page: '1',
        limit: '10',
        sort: 'title',
        status: 'approved',
        type: 'academic',
        category: 'individual',
        isPublic: 'true'
      });
      
      const res = mockResponse();
      
      // Run all validation middlewares
      for (const middleware of validateQueryParams) {
        if (typeof middleware === 'function') {
          await middleware(req, res, next);
          
          if (res.status.mock.calls.length > 0) {
            break;
          }
        }
      }
      
      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('should fail validation with invalid query parameters', async () => {
      const req = mockRequest({}, {}, {
        page: 'not-a-number',
        limit: '1000', // Exceeds max limit
        status: 'invalid-status',
        type: 'invalid-type',
        category: 'invalid-category'
      });
      
      const res = mockResponse();
      
      // Run all validation middlewares
      for (const middleware of validateQueryParams) {
        if (typeof middleware === 'function') {
          await middleware(req, res, next);
          
          if (res.status.mock.calls.length > 0) {
            break;
          }
        }
      }
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          expect.objectContaining({ msg: 'Page must be a positive integer' }),
          expect.objectContaining({ msg: 'Limit must be between 1 and 100' }),
          expect.objectContaining({ msg: 'Invalid status value' }),
          expect.objectContaining({ msg: 'Invalid achievement type' }),
          expect.objectContaining({ msg: 'Invalid category' })
        ])
      });
    });
  });
});
