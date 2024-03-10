const {
  app: { baseUrl },
} = require('../config/index');
const logoPath = 'public/logo/invoice.png';
module.exports = {
  roleType: {
    ADMIN: 'admin',
    CUSTOMER: 'user',
    ALL: ['superAdmin', 'user', 'admin'],
  },

  sortType: {
    ASC: 1,
    DESC: -1,
  },

  userStatus: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    DELETED: 'deleted',
    ALL: ['active', 'inactive', 'deleted', 'pending'],
  },

  logo: {
    image: `${baseUrl}${logoPath}`,
  },
};
