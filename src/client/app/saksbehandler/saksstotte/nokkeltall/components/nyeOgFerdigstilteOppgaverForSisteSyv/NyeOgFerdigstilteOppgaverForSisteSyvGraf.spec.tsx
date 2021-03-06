import React from 'react';
import { expect } from 'chai';
import { IntlShape } from 'react-intl';
import {
  XYPlot, LineSeries, Crosshair,
} from 'react-vis';
import moment from 'moment';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import behandlingType from 'kodeverk/behandlingType';
import NyeOgFerdigstilteOppgaverForSisteSyvGraf from './NyeOgFerdigstilteOppgaverForSisteSyvGraf';

describe('<NyeOgFerdigstilteOppgaverForSisteSyvGraf>', () => {
  const intl: Partial<IntlShape> = {
    ...intlMock,
  };
  it('skal vise graf med default-verdier på x og y-aksen når datagrunnlaget er tom', () => {
    const wrapper = shallowWithIntl(<NyeOgFerdigstilteOppgaverForSisteSyvGraf.WrappedComponent
      intl={intl as IntlShape}
      width={300}
      height={200}
      nyeOgFerdigstilteOppgaver={[]}
    />);

    const xYPlot = wrapper.find(XYPlot);
    expect(xYPlot).to.have.length(1);
    expect(xYPlot.prop('xDomain')).to.eql([moment().subtract(7, 'd').startOf('day').toDate(), moment().subtract(1, 'd').startOf('day').toDate()]);
    expect(xYPlot.prop('yDomain')).to.eql([0, 50]);
  });

  it('skal vise graf med tre kurver for ferdigstilte, mine ferdigstilte og nye oppgaver', () => {
    const nyeOgFerdigstilteOppgaver = [{
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'FORSTEGANGSSOKNAD',
      },
      fagsakYtelseType: {
        kode: 'PSB',
        navn: 'Pleiepenger',
      },
      antallNye: 11,
      antallFerdigstilte: 1,
      antallFerdigstilteMine: 1,
      dato: moment().subtract(1, 'd').format(ISO_DATE_FORMAT),
    }, {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'FORSTEGANGSSOKNAD',
      },
      fagsakYtelseType: {
        kode: 'PSB',
        navn: 'Pleiepenger',
      },
      antallNye: 12,
      antallFerdigstilte: 2,
      antallFerdigstilteMine: 1,
      dato: moment().subtract(2, 'd').format(ISO_DATE_FORMAT),
    }, {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'FORSTEGANGSSOKNAD',
      },
      fagsakYtelseType: {
        kode: 'PSB',
        navn: 'Pleiepenger',
      },
      antallNye: 13,
      antallFerdigstilte: 3,
      antallFerdigstilteMine: 1,
      dato: moment().subtract(3, 'd').format(ISO_DATE_FORMAT),
    }, {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'FORSTEGANGSSOKNAD',
      },
      fagsakYtelseType: {
        kode: 'PSB',
        navn: 'Pleiepenger',
      },
      antallNye: 14,
      antallFerdigstilte: 4,
      antallFerdigstilteMine: 1,
      dato: moment().subtract(4, 'd').format(ISO_DATE_FORMAT),
    }, {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'FORSTEGANGSSOKNAD',
      },
      fagsakYtelseType: {
        kode: 'PSB',
        navn: 'Pleiepenger',
      },
      antallNye: 15,
      antallFerdigstilte: 5,
      antallFerdigstilteMine: 1,
      dato: moment().subtract(5, 'd').format(ISO_DATE_FORMAT),
    }, {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'FORSTEGANGSSOKNAD',
      },
      fagsakYtelseType: {
        kode: 'PSB',
        navn: 'Pleiepenger',
      },
      antallNye: 16,
      antallFerdigstilte: 6,
      antallFerdigstilteMine: 1,
      dato: moment().subtract(6, 'd').format(ISO_DATE_FORMAT),
    }, {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'FORSTEGANGSSOKNAD',
      },
      fagsakYtelseType: {
        kode: 'PSB',
        navn: 'Pleiepenger',
      },
      antallNye: 17,
      antallFerdigstilte: 7,
      antallFerdigstilteMine: 1,
      dato: moment().subtract(7, 'd').format(ISO_DATE_FORMAT),
    }];

    const wrapper = shallowWithIntl(<NyeOgFerdigstilteOppgaverForSisteSyvGraf.WrappedComponent
      intl={intl as IntlShape}
      width={300}
      height={200}
      nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver}
    />);

    const lineSeries = wrapper.find(LineSeries);
    expect(lineSeries).to.have.length(3);

    const ferdigstilteOppgaver = [{
      x: moment().subtract(7, 'd').startOf('day').toDate(),
      y: 7,
    }, {
      x: moment().subtract(6, 'd').startOf('day').toDate(),
      y: 6,
    }, {
      x: moment().subtract(5, 'd').startOf('day').toDate(),
      y: 5,
    }, {
      x: moment().subtract(4, 'd').startOf('day').toDate(),
      y: 4,
    }, {
      x: moment().subtract(3, 'd').startOf('day').toDate(),
      y: 3,
    }, {
      x: moment().subtract(2, 'd').startOf('day').toDate(),
      y: 2,
    }, {
      x: moment().subtract(1, 'd').startOf('day').toDate(),
      y: 1,
    }];
    const dataArea1 = lineSeries.first().prop('data');
    expect(dataArea1).to.eql(ferdigstilteOppgaver);

    const nyeOppgaver = [{
      x: moment().subtract(7, 'd').startOf('day').toDate(),
      y: 17,
    }, {
      x: moment().subtract(6, 'd').startOf('day').toDate(),
      y: 16,
    }, {
      x: moment().subtract(5, 'd').startOf('day').toDate(),
      y: 15,
    }, {
      x: moment().subtract(4, 'd').startOf('day').toDate(),
      y: 14,
    }, {
      x: moment().subtract(3, 'd').startOf('day').toDate(),
      y: 13,
    }, {
      x: moment().subtract(2, 'd').startOf('day').toDate(),
      y: 12,
    }, {
      x: moment().subtract(1, 'd').startOf('day').toDate(),
      y: 11,
    }];
    const dataArea2 = lineSeries.last().prop('data');
    expect(dataArea2).to.eql(nyeOppgaver);
  });

  it('skal vise crosshair med antall nye og ferdigstilte og mine ferdigstiltefor valgt dato', () => {
    const nyeOgFerdigstilteOppgaver = [{
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'FORSTEGANGSSOKNAD',
      },
      fagsakYtelseType: {
        kode: 'PSB',
        navn: 'Pleiepenger',
      },
      antallNye: 12,
      antallFerdigstilte: 2,
      antallFerdigstilteMine: 1,
      dato: moment().subtract(1, 'd').format(ISO_DATE_FORMAT),
    }];

    const wrapper = shallowWithIntl(<NyeOgFerdigstilteOppgaverForSisteSyvGraf.WrappedComponent
      intl={intl as IntlShape}
      width={300}
      height={200}
      nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver}
    />);

    const lineSeries = wrapper.find(LineSeries);
    expect(lineSeries).to.have.length(3);
    const valgtPunkt = { x: moment().startOf('day').subtract(1, 'd').toDate(), y: 1 };
    const func = lineSeries.first().prop('onNearestX') as (value: {x: Date; y: number}) => void;
    func(valgtPunkt);

    const crosshair = wrapper.find(Crosshair);
    expect(crosshair).to.have.length(1);

    expect(crosshair.find(Normaltekst).childAt(0).text()).to.eql(moment().subtract(1, 'd').format(DDMMYYYY_DATE_FORMAT));
    const tekst = crosshair.find(Undertekst);
    expect(tekst).to.have.length(3);
    expect(tekst.first().childAt(0).prop('values').antall).to.eql(2);
    expect(tekst.last().childAt(0).prop('values').antall).to.eql(12);
  });
});
