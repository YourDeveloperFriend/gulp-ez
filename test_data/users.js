
import _ from 'lodash';
import BaseController from 'ez-ctrl';
import {NotFoundError} from 'ez-error';

let users = [{
  id: 0,
  name: 'Nathan Tate',
  username: 'nathantate88',
  password: 'password',
  male: true
}, {
  id: 1,
  name: 'Shirley Tate',
  username: 'shirl3ycurlz',
  password: 'password',
  male: false
}];

class UserController extends BaseController {
  getUserIndex(id) {
    let index = _.findIndex(users, (user)=> user.id === id);
    if(index === -1) {
      throw new NotFoundError();
    }
    return index;
  }
  getUser(id) {
    return users[this.getUserIndex(id)];
  }
  getByUsername(username) {
    return _.find(users, (user)=> user.username === username);
  }
}

UserController.modelName = 'User';

UserController.defineRoutes({
  query: {
    data: {
      male: {
        type: 'boolean',
        required: false
      },
      name: {
        type: 'text',
        required: false
      }
    },
    logic(_data) {
      return users.filter(function(user) {
        return _.every(_data, (val, key)=> {
          return user[key] === val;
        });
      });
    }
  },
  get: {
    data: {
      id: {
        type: 'int',
        required: true
      }
    },
    logic(id) {
      return this.getUser(id);
    }
  },
  create: {
    data: {
      male: {
        type: 'boolean',
        required: true
      },
      name: {
        type: 'text',
        required: true
      },
      username: {
        type: 'text',
        required: true
      },
      password: {
        type: 'text',
        required: true
      }
    },
    logic(_data) {
      _data.id = users[users.length - 1].id || 0;
      if(this.getByUsername(_data.username)) {
        throw new ValidationError({username: ['duplicate']});
      }
      users.push(_data);
      return _data;
    }
  },
  update: {
    data: {
      id: {
        type: 'int',
        required: true
      },
      male: {
        type: 'boolean',
        required: false
      },
      name: {
        type: 'text',
        required: false
      },
      username: {
        type: 'text',
        required: true
      },
      password: {
        type: 'text',
        required: true
      }
    },
    logic(id, _data) {
      let user = this.getUser(id);
      if(_data.username && user !== this.getByUsername(_data.username)) {
        throw new ValidationError({username: ['duplicate']});
      }
      _.assign(user, _data);
      return user;
    }
  },
  delete: {
    data: {
      id: {
        type: 'int',
        required: true
      }
    },
    logic(id) {
      let index = this.getUserIndex(id);
      users.splice(index, 1);
    }
  },
  login: {
    method: 'post',
    data: {
      username: {
        type: 'text',
        required: true
      },
      password: {
        type: 'text',
        required: true
      }
    },
    logic(username, password) {
      let user = this.getByUsername(username);      
      if(!user || user.password !== password) {
        throw new UserError('InvalidCredentials');
      }
      _.set(this, 'request.session.user', user);
      return user;
    }
  },
  postLogout() {
    if(_.get(this, 'request.session.user')) {
      delete this.request.session.user;
    }
  },
  getMe() {
    return _.get(this, 'request.session.user');
  }
});

export default UserController;
