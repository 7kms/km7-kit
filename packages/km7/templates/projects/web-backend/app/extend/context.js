module.exports = {
  respondData(status, json) {
    if (!json) {
      json = {};
      switch (status) {
        case 401:
          json.msg = 'session expired';
          break;
        case 403:
          json.msg = 'permission denied';
          break;
        case 200:
          json.msg = 'success';
          break;
      }
    }
    if (typeof json === 'string') {
      json = { msg: json };
    }
    if (json instanceof Error) {
      json = {
        name: json.name,
        message: json.message,
        stack: json.stack,
        data: 'Node_Error',
      };
    }
    this.status = status;
    this.body = {
      result: json,
    };
  },
};
