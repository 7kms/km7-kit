import React from 'react';
import { Modal } from 'antd';
import { syntaxHighlight } from '../utils/index';

export default {
  onError(err: any) {
    console.log('plugin/onError.js');
    let error = Array.isArray(err) ? err[0] : err;
    Modal.error({
      title: 'Error',
      content: (
        <pre
          style={{ maxHeight: '500px', overflow: 'auto' }}
          className="lightJSON"
          dangerouslySetInnerHTML={{ __html: syntaxHighlight(error, 2) }}
        />
      ),
      width: 800,
      centered: true,
    });
  },
};
