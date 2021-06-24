import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';
import behandlingType from 'kodeverk/behandlingType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import RestApiTestMocker from 'testHelpers/RestApiTestMocker';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { K9LosApiKeys } from 'api/k9LosApi';
import { GjeldendeOppgavekoerTabell } from './GjeldendeOppgavekoerTabell';

describe('<GjeldendeOppgavekoerTabell>', () => {
  const restApiMocker = new RestApiTestMocker();
  afterEach(() => {
    restApiMocker.resetMock();
  });
  const behandlingstyper = [{
    kode: behandlingType.FORSTEGANGSSOKNAD,
    navn: '',
  }, {
    kode: behandlingType.REVURDERING,
    navn: '',
  },
  ];
  const fagsakYtelseTyper = [{
    kode: fagsakYtelseType.OMSORGSPENGER,
    navn: '',
  }, {
    kode: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
    navn: '',
  },
  ];

  it('skal ikke vise tabell når ingen oppgavekoer finnes', () => {
    const oppgavekoer = [];

    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.BEHANDLING_TYPE, behandlingstyper)
      .withKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE, fagsakYtelseTyper)
      .withDummyRunner()
      .runTest(() => {
        const wrapper = shallow(<GjeldendeOppgavekoerTabell
          oppgavekoer={oppgavekoer}
          setValgtOppgavekoId={sinon.spy()}
          resetValgtOppgavekoId={sinon.spy()}
          hentAlleOppgavekoer={sinon.spy()}
          requestFinished
        />);

        const tekstComp = wrapper.find(FormattedMessage);
        expect(tekstComp).to.have.length(2);
        expect(tekstComp.at(1).prop('id')).to.eql('GjeldendeOppgavekoerTabell.IngenLister');
        expect(wrapper.find(Table)).to.have.length(0);
      });
  });

  it('skal vise to oppgavekoer', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Nyansatte',
      sistEndret: '2017-08-31',
      erTilBeslutter: false,
      erRegistrerPapirsoknad: false,
      saksbehandlere: [],
      skjermet: false,
      antallBehandlinger: 38,
    }, {
      id: '2',
      navn: 'Kun foreldrepenger',
      sistEndret: '2018-08-31',
      erTilBeslutter: false,
      erRegistrerPapirsoknad: false,
      saksbehandlere: [],
      skjermet: false,
      antallBehandlinger: 54,
    }];

    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.BEHANDLING_TYPE, behandlingstyper)
      .withKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE, fagsakYtelseTyper)
      .withDummyRunner()
      .runTest(() => {
        const wrapper = shallow(<GjeldendeOppgavekoerTabell
          oppgavekoer={oppgavekoer}
          setValgtOppgavekoId={sinon.spy()}
          resetValgtOppgavekoId={sinon.spy()}
          hentAlleOppgavekoer={sinon.spy()}
          requestFinished
        />);

        expect(wrapper.find(FormattedMessage)).to.have.length(3);
        expect(wrapper.find(Table)).to.have.length(1);
        const rader = wrapper.find(TableRow);
        expect(rader).to.have.length(2);

        const kolonnerForRad1 = rader.first().find(TableColumn);
        expect(kolonnerForRad1).to.have.length(6);
        expect(kolonnerForRad1.first().childAt(0).text()).to.eql('Nyansatte');

        const kolonnerForRad2 = rader.last().find(TableColumn);
        expect(kolonnerForRad2).to.have.length(6);
        expect(kolonnerForRad2.first().childAt(0).text()).to.eql('Kun foreldrepenger');
      });
  });

  it('skal sette valgt oppgavekø ved trykk på rad i tabell', async () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Nyansatte',
      sistEndret: '2017-08-31',
      erTilBeslutter: false,
      erRegistrerPapirsoknad: false,
      saksbehandlere: [],
      skjermet: false,
      antallBehandlinger: 78,
    }];
    const setValgtOppgavekoIdFn = sinon.spy();

    restApiMocker
      .withKodeverk(kodeverkTyper.BEHANDLING_TYPE, behandlingstyper)
      .withKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE, fagsakYtelseTyper)
      .withDummyRunner()
      .mock();

    const wrapper = shallow(<GjeldendeOppgavekoerTabell
      oppgavekoer={oppgavekoer}
      setValgtOppgavekoId={setValgtOppgavekoIdFn}
      resetValgtOppgavekoId={sinon.spy()}
      hentAlleOppgavekoer={sinon.spy()}
      requestFinished
    />);

    const rader = wrapper.find(TableRow);
    expect(rader).to.have.length(1);

    const keyFn = rader.prop('onKeyDown') as () => void;
    await keyFn();

    expect(setValgtOppgavekoIdFn.calledOnce).to.be.true;
  });

  it('skal vise antall saksbehandlere tilknyttet oppgavekøen', () => {
    const oppgavekoer = [{
      id: '1',
      navn: 'Nyansatte',
      sistEndret: '2017-08-31',
      erTilBeslutter: false,
      skjermet: false,
      erRegistrerPapirsoknad: false,
      saksbehandlere: [{
        navn: 'Sara',
        brukerIdent: 'fslkjd',
        epost: 'epost',
        oppgavekoer: ['OMP'],

      }],
      antallBehandlinger: 78,
    }];

    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.BEHANDLING_TYPE, behandlingstyper)
      .withKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE, fagsakYtelseTyper)
      .withRestCallRunner(K9LosApiKeys.HENT_OPPGAVEKO, { startRequest: () => undefined, data: oppgavekoer[0] })
      .withRestCallRunner(K9LosApiKeys.SLETT_OPPGAVEKO, { startRequest: () => undefined })
      .withRestCallRunner(K9LosApiKeys.OPPRETT_NY_OPPGAVEKO, { startRequest: () => undefined })
      .runTest(() => {
        const wrapper = shallow(<GjeldendeOppgavekoerTabell
          oppgavekoer={oppgavekoer}
          setValgtOppgavekoId={sinon.spy()}
          resetValgtOppgavekoId={sinon.spy()}
          hentAlleOppgavekoer={sinon.spy()}
          requestFinished
        />);

        expect(wrapper.find(Table)).to.have.length(1);
        const rader = wrapper.find(TableRow);
        expect(rader).to.have.length(1);

        const kolonnerForRad = rader.first().find(TableColumn);
        expect(kolonnerForRad).to.have.length(6);
        expect(kolonnerForRad.at(2).childAt(0).text()).to.eql('1');
      });
  });
});
