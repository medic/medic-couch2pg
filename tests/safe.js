const expect = require('chai').expect,
      safe = require('../libs/medic/safe');

describe('safe', () => {
  const opts = {
    withPasswords: {
      debug: true,
      v4Mode: false,
      couchdbUrl: 'https://simon:vato@rhc-ghana.app.medicmobile.org/medic',
      postgresqlUrl: 'postgres://pilon:palon@localhost:5432/rhc_ghana_upgrade',
      docLimit: 100,
      changesLimit: undefined,
      retryCount: 5,
      sleepMins: 120
    },
    withoutPasswords: {
      couchdbUrl: 'https://rhc-ghana.app.medicmobile.org/medic',
      postgresqlUrl: 'postgres://localhost:5432/rhc_ghana_upgrade',
    }
  };

  const expected = {
    withPasswords: {
      debug: true,
      v4Mode: false,
      couchdbUrl: 'rhc-ghana.app.medicmobile.org/medic',
      postgresqlUrl: 'localhost:5432/rhc_ghana_upgrade',
      docLimit: 100,
      changesLimit: undefined,
      retryCount: 5,
      sleepMins: 120
    }
  };

  it('keeps initial opts and removes passwords from returned obj', () => {
    const optsWithPasswords = Object.assign({}, opts.withPasswords);
    const safeOpts = safe(optsWithPasswords);
    expect(optsWithPasswords).to.deep.equal(opts.withPasswords);
    expect(safeOpts).to.deep.equal(expected.withPasswords);
  });

  it('returns valid couch/pg urls for urls without passwords', () => {
    expect(safe(opts.withoutPasswords)).to.deep.equal(opts.withoutPasswords);
  });

});
