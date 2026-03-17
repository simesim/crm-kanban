export const createCommentSchema = {
  body: {
    in: ['body'],
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: 'body is required',
    },
  },
};
