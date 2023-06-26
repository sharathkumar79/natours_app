class ApiFeatures {
    constructor(query, querystr) {
      this.query = query;
      this.querystr = querystr;
    }
    filtering = () => {
      const queryObj = { ...this.querystr };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach((el) => delete queryObj[el]);
  
      let queryString = JSON.stringify(queryObj);
      queryString = queryString.replace(
        /\b(gt|gte|lt|lte)\b/g,
        (match) => `$${match}`
      );
      this.query = this.query.find(JSON.parse(queryString));
      return this;
    };
    sort() {
      if (this.querystr.sort) {
        this.query = this.query.sort(this.querystr.sort);
      }
      return this;
    }
    limitFields() {
      if (this.querystr.fields) {
        const fields = this.querystr.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
      return this;
    }
    pagination() {
      const page = this.querystr.page * 1 || 1;
      const limit = this.querystr.limit * 1 || 100;
      this.query = this.query.skip((page - 1) * limit).limit(limit);
      return this;
    }
  }
module.exports = ApiFeatures;