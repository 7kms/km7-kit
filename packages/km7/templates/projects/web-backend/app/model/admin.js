const Mongoose = require('mongoose');
const crypto = require('crypto');
const ObjectId = Mongoose.Schema.Types.ObjectId;

// 资源集合
module.exports = app => {
  const mongoose = app.mongoose;
  const schema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      hashed_password: { type: String, default: '' },
      salt: { type: String, default: '' },
      isMaster: {
        type: Boolean,
        default: false,
      },
      active: {
        type: Boolean,
        default: true,
      },
    },
    {
      collection: 'admin',
      timestamps: true,
    },
  );
  const validatePresenceOf = value => value && value.length;
  /**
   * Virtuals
   */
  schema
    .virtual('password')
    .set(function(password) {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
      return this._password || this.hashed_password;
    });
  /**
   * Validations
   */
  schema.path('email').validate(function(email) {
    return email && email.length;
  }, 'email cannot be blank');

  schema.path('hashed_password').validate(function(hashed_password) {
    return hashed_password && hashed_password.length && this._password.length;
  }, 'Password cannot be blank');
  /**
   * Pre-save hook
   */
  schema.pre('save', function(next) {
    if (!validatePresenceOf(this._password)) {
      next(new Error('Invalid password'));
    } else {
      next();
    }
  });

  schema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function(plainText) {
      return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function() {
      return Math.round(new Date().valueOf() * Math.random()) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
      if (!password) return '';
      try {
        return crypto
          .createHmac('sha1', this.salt)
          .update(password)
          .digest('hex');
      } catch (err) {
        return '';
      }
    },
  };
  return mongoose.model('Admin', schema);
};
