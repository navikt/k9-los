import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import behandlingType from 'kodeverk/behandlingType';
import { CheckboxField } from 'form/FinalFields';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import RestApiTestMocker from 'testHelpers/RestApiTestMocker';
import { K9LosApiKeys } from 'api/k9LosApi';
import BehandlingstypeVelger from './BehandlingstypeVelger';

const behandlingTyper = [{
  kode: behandlingType.ANKE,
  navn: 'Anke',
}, {
  kode: behandlingType.FORSTEGANGSSOKNAD,
  navn: 'Førstegangssøknad',
}, {
  kode: behandlingType.INNSYN,
  navn: 'Dokumentinnsyn',
}, {
  kode: behandlingType.KLAGE,
  navn: 'Klage',
}, {
  kode: behandlingType.REVURDERING,
  navn: 'Revurdering',
},
{
  kode: behandlingType.TILBAKEBETALING,
  navn: 'Tilbakebetaling',
}, {
  kode: behandlingType.PAPIRSØKNAD,
  navn: 'Papirsøknad',
}, {
  kode: behandlingType.PAPIRETTERSENDELSE,
  navn: 'Papirettersendelse',
}, {
  kode: behandlingType.DIGITAL_ETTERSENDELSE,
  navn: 'Digital ettersendelse',
}, {
  kode: behandlingType.PAPIRINNTEKTSOPPLYSNINGER,
  navn: 'Papirinntektsopplysninger',
}, {
  kode: behandlingType.INNLOGGET_CHAT,
  navn: 'Innlogget chat',
}, {
  kode: behandlingType.SKRIV_TIL_OSS_SPØRSMÅL,
  navn: 'Skriv til oss spørsmål',
}, {
  kode: behandlingType.SKRIV_TIL_OSS_SVAR,
  navn: 'Srkiv til oss svar',
}, {
  kode: behandlingType.UKJENT,
  navn: 'Ukjent',
},
{
  kode: behandlingType.SAMTALEREFERAT,
  navn: 'Samtalereferat',
},
];

describe('<BehandlingstypeVelger>', () => {
  it('skal vise checkboxer for behandlingstyper', () => {
    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.BEHANDLING_TYPE, behandlingTyper)
      .withDummyRunner()
      .runTest(() => {
        const wrapper = shallow(<BehandlingstypeVelger
          valgtOppgavekoId="1"
          hentOppgaveko={sinon.spy()}
        />);

        const checkboxer = wrapper.find(CheckboxField);
        expect(checkboxer).to.have.length(15);
        expect(checkboxer.first().prop('name')).to.eql(behandlingType.ANKE);
        expect(checkboxer.last().prop('name')).to.eql(behandlingType.UKJENT);
      });
  });

  it('skal lagre behandlingstype ved klikk på checkbox', () => {
    const lagreBehandlingTypeFn = sinon.spy();
    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.BEHANDLING_TYPE, behandlingTyper)
      .withRestCallRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_BEHANDLINGSTYPE,
        { startRequest: (params) => { lagreBehandlingTypeFn(params); return Promise.resolve(); } })
      .runTest(() => {
        const wrapper = shallow(<BehandlingstypeVelger
          valgtOppgavekoId="1"
          hentOppgaveko={sinon.spy()}
        />);

        const checkbox = wrapper.find(CheckboxField);
        checkbox.first().prop('onChange')(true);

        expect(lagreBehandlingTypeFn.calledOnce).to.be.true;
        const { args } = lagreBehandlingTypeFn.getCalls()[0];
        expect(args).to.have.length(1);
        expect(args[0].id).to.eql('1');
        expect(args[0].behandlingType).to.eql(behandlingTyper[0]);
        expect(args[0].checked).is.true;
      });
  });
});
