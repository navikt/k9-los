import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { BemanningIndex } from './BemanningIndex';
import SaksbehandlerePanel from './components/SaksbehandlerePanel';

describe('<BemanningIndex>', () => {
  it('skal hente saksbehandlere ved lasting av komponent og så vise desse i panel', () => {
    const fetchAlleSaksbehandlere = sinon.spy();
    const wrapper = shallow(<BemanningIndex
      fetchAlleSaksbehandlere={fetchAlleSaksbehandlere}
      findSaksbehandler={sinon.spy()}
      resetSaksbehandlerSok={sinon.spy()}
      addSaksbehandler={sinon.spy()}
      alleSaksbehandlere={[]}
      removeSaksbehandler={sinon.spy()}
    />);

    expect(wrapper.find(SaksbehandlerePanel)).to.have.length(1);
    expect(fetchAlleSaksbehandlere.calledOnce).to.be.true;
    const { args } = fetchAlleSaksbehandlere.getCalls()[0];
    expect(args).to.have.length(0);
  });
});
