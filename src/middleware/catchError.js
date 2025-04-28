export const asyncHandler = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch((err) => {
        console.error(err);
        const status = err.statusCode || 500;
        res.status(status).json({ message: err.message || 'Internal Server Error' });
      });
    };
  };  