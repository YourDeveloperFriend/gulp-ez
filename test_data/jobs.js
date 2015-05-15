
import _ from 'lodash';
import BaseController from 'ez-ctrl';
import {NotFoundError} from 'ez-error';

let jobs = [{
  id: 0,
  name: 'Job 1',
}, {
  id: 1,
  name: 'Job 2'
}];

class JobController extends BaseController {
  getJobIndex(id) {
    let index = _.findIndex(jobs, (job)=> job.id === id);
    if(index === -1) {
      throw new NotFoundError();
    }
    return index;
  }
  getJob(id) {
    return jobs[this.getJobIndex(id)];
  }
  getByJobname(jobname) {
    return _.find(jobs, (job)=> job.jobname === jobname);
  }
}

JobController.modelName = 'Job';

JobController.defineRoutes({
  query: {
    data: {
      name: {
        type: 'text',
        required: false
      }
    },
    logic(_data) {
      return jobs.filter(function(job) {
        return _.every(_data, (val, key)=> {
          return job[key] === val;
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
      return this.getJob(id);
    }
  },
  create: {
    data: {
      name: {
        type: 'text',
        required: true
      }
    },
    logic(_data) {
      _data.id = jobs[jobs.length - 1].id || 0;
      jobs.push(_data);
      return _data;
    }
  },
  update: {
    data: {
      id: {
        type: 'int',
        required: true
      },
      name: {
        type: 'text',
        required: false
      }
    },
    logic(id, _data) {
      let job = this.getJob(id);
      _.assign(job, _data);
      return job;
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
      let index = this.getJobIndex(id);
      jobs.splice(index, 1);
    }
  }
});

export default JobController;
