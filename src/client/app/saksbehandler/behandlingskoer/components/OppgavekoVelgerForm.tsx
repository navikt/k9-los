import React, { Component, Node } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Form, FormSpy } from 'react-final-form';
import {
  injectIntl, intlShape, FormattedMessage, FormattedHTMLMessage,
} from 'react-intl';
import { bindActionCreators, Dispatch } from 'redux';
import { Element, Undertittel, Normaltekst } from 'nav-frontend-typografi';

import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import Image from 'sharedComponents/Image';
import { getValueFromLocalStorage, setValueInLocalStorage, removeValueFromLocalStorage } from 'utils/localStorageHelper';
import { FlexContainer, FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import LabelWithHeader from 'sharedComponents/LabelWithHeader';
import oppgavekoPropType from 'saksbehandler/behandlingskoer/oppgavekoPropType';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import { SelectField } from 'form/FinalFields';
import gruppeHoverUrl from 'images/gruppe_hover.svg';
import gruppeUrl from 'images/gruppe.svg';
import { getOppgavekoensSaksbehandlere, fetchAntallOppgaverForBehandlingsko, fetchOppgavekoensSaksbehandlere } from '../duck';
import { Saksbehandler } from '../saksbehandlerTsType';
import saksbehandlerPropType from '../saksbehandlerPropType';

import styles from './oppgavekoVelgerForm.less';

interface TsProps {
  intl: any;
  oppgavekoer: Oppgaveko[];
  fetchOppgavekoOppgaver: (oppgavekoId: string) => void;
  fetchOppgavekoensSaksbehandlere: (oppgavekoId: string) => void;
  fetchAntallOppgaverForBehandlingsko: (oppgavekoId: string) => void;
  saksbehandlere?: Saksbehandler[];
}

interface Toolip {
  header: Node;
  body: Node;
}

const getDefaultOppgaveko = (oppgavekoer) => {
  const lagretOppgavekoId = getValueFromLocalStorage('oppgavekoId');
  if (lagretOppgavekoId) {
    if (oppgavekoer.some(s => `${s.oppgavekoId}` === lagretOppgavekoId)) {
      return parseInt(lagretOppgavekoId, 10);
    }
    removeValueFromLocalStorage('oppgavekoId');
  }

  const sortertOppgavekoer = oppgavekoer.sort((oppgaveko1, oppgaveko2) => oppgaveko1.navn.localeCompare(oppgaveko2.navn));
  return sortertOppgavekoer.length > 0 ? sortertOppgavekoer[0].oppgavekoId : undefined;
};

const getInitialValues = (oppgavekoer) => {
  if (oppgavekoer.length === 0) {
    return {
      oppgavekoId: undefined,
    };
  }
  const defaultOppgaveko = getDefaultOppgaveko(oppgavekoer);
  return {
    oppgavekoId: defaultOppgaveko ? `${defaultOppgaveko}` : undefined,
  };
};

const getValgtOppgaveko = (oppgavekoer: Oppgaveko[], oppgavekoId: string) => oppgavekoer.find(s => oppgavekoId === `${s.oppgavekoId}`);

const getStonadstyper = (oppgaveko?: Oppgaveko, intl: any) => (oppgaveko && oppgaveko.fagsakYtelseTyper.length > 0
    ? oppgaveko.fagsakYtelseTyper.map(type => type.navn) : [intl.formatMessage({ id: 'OppgavekoVelgerForm.Alle' })]);

const getBehandlingstyper = (oppgaveko?: Oppgaveko, intl: any) => (oppgaveko && oppgaveko.behandlingTyper.length > 0
    ? oppgaveko.behandlingTyper.map(type => type.navn) : [intl.formatMessage({ id: 'OppgavekoVelgerForm.Alle' })]);

const getAndreKriterier = (oppgaveko?: Oppgaveko, intl: any) => {
  if (oppgaveko && oppgaveko.andreKriterier.length > 0) {
    return oppgaveko.andreKriterier.map(ak => (ak.inkluder ? ak.andreKriterierType.navn
        : intl.formatMessage({ id: 'OppgavekoVelgerForm.Uten' }, { kriterie: ak.andreKriterierType.navn })));
  }
  return [intl.formatMessage({ id: 'OppgavekoVelgerForm.Alle' })];
};

const getSorteringsnavn = (oppgaveko?: Oppgaveko) => {
  if (!oppgaveko || !oppgaveko.sortering) {
    return '';
  }

  const {
    erDynamiskPeriode, sorteringType, fra, til, fomDato, tomDato,
  } = oppgaveko.sortering;
  let values = {};
  if (!erDynamiskPeriode) {
    if (!fomDato && !tomDato) {
      return sorteringType.navn;
    }
    values = {
      navn: sorteringType.navn,
      fomDato: fomDato ? moment(fomDato).format(DDMMYYYY_DATE_FORMAT) : undefined,
      tomDato: tomDato ? moment(tomDato).format(DDMMYYYY_DATE_FORMAT) : undefined,
    };
  } else {
    if (!fra && !til) {
      return sorteringType.navn;
    }
    values = {
      navn: sorteringType.navn,
      fomDato: fra ? moment().add(fra, 'days').format(DDMMYYYY_DATE_FORMAT) : undefined,
      tomDato: til ? moment().add(til, 'days').format(DDMMYYYY_DATE_FORMAT) : undefined,
    };
  }

  if (!values.fomDato) {
    return <FormattedHTMLMessage id="OppgavekoVelgerForm.SorteringsinfoTom" values={values} />;
  } if (!values.tomDato) {
    return <FormattedHTMLMessage id="OppgavekoVelgerForm.SorteringsinfoFom" values={values} />;
  }
  return <FormattedHTMLMessage id="OppgavekoVelgerForm.Sorteringsinfo" values={values} />;
};

const imageSrcFunction = isHovering => (isHovering ? gruppeHoverUrl : gruppeUrl);

/**
 * OppgavekoVelgerForm
 *
 */
export class OppgavekoVelgerForm extends Component<TsProps> {
  static propTypes = {
    intl: intlShape.isRequired,
    oppgavekoer: PropTypes.arrayOf(oppgavekoPropType).isRequired,
    fetchOppgavekoOppgaver: PropTypes.func.isRequired,
    fetchOppgavekoensSaksbehandlere: PropTypes.func.isRequired,
    fetchAntallOppgaverForBehandlingsko: PropTypes.func.isRequired,
    saksbehandlere: PropTypes.arrayOf(saksbehandlerPropType),
  };

  static defaultProps = {
    saksbehandlere: [],
  };

  componentDidMount = () => {
    const {
      oppgavekoer, fetchOppgavekoOppgaver, fetchOppgavekoensSaksbehandlere: fetchSaksbehandlere, fetchAntallOppgaverForBehandlingsko: fetchAntallOppgaver,
    } = this.props;
    if (oppgavekoer.length > 0) {
      const defaultOppgavekoId = getDefaultOppgaveko(oppgavekoer);
      if (defaultOppgavekoId) {
        fetchOppgavekoOppgaver(defaultOppgavekoId);
        fetchSaksbehandlere(defaultOppgavekoId);
        fetchAntallOppgaver(defaultOppgavekoId);
      }
    }
  }

  createTooltip = (): Toolip | undefined => {
    const {
      intl, saksbehandlere,
    } = this.props;
    if (!saksbehandlere || saksbehandlere.length === 0) {
      return undefined;
    }

    return {
      header: <Undertittel>{intl.formatMessage({ id: 'OppgavekoVelgerForm.SaksbehandlerToolip' })}</Undertittel>,
      body: saksbehandlere.map(s => s.navn).sort((n1, n2) => n1.localeCompare(n2)).map(navn => (<Normaltekst key={navn}>{navn}</Normaltekst>)),
    };
  }

  render = () => {
    const {
      intl, oppgavekoer, fetchOppgavekoOppgaver, fetchOppgavekoensSaksbehandlere: fetchSaksbehandlere, fetchAntallOppgaverForBehandlingsko: fetchAntallOppgaver,
    } = this.props;
    return (
      <Form
        onSubmit={() => undefined}
        initialValues={getInitialValues(oppgavekoer)}
        render={({ values = {} }) => (
          <form>
            <Element><FormattedMessage id="OppgavekoVelgerForm.Utvalgskriterier" /></Element>
            <VerticalSpacer eightPx />
            <FormSpy
              onChange={(val) => {
                        if (val && val.values.oppgavekoId && val.dirtyFields.oppgavekoId) {
                          setValueInLocalStorage('oppgavekoId', val.values.oppgavekoId);
                          const id = parseInt(val.values.oppgavekoId, 10);
                          fetchOppgavekoOppgaver(id);
                          fetchSaksbehandlere(id);
                          fetchAntallOppgaver(id);
                        }
                      }}
              subscription={{ values: true, dirtyFields: true }}
            />
            <FlexContainer>
              <FlexRow>
                <FlexColumn className={styles.navnInput}>
                  <SelectField
                    name="oppgavekoId"
                    label={intl.formatMessage({ id: 'OppgavekoVelgerForm.Oppgaveko' })}
                    selectValues={oppgavekoer
                                .map(oppgaveko => (<option key={oppgaveko.oppgavekoId} value={`${oppgaveko.oppgavekoId}`}>{oppgaveko.navn}</option>))}
                    bredde="l"
                  />
                </FlexColumn>
                {values.oppgavekoId && (
                  <>
                    <FlexColumn>
                      <div className={styles.saksbehandlerIkon} />
                      <Image
                        altCode="OppgavekoVelgerForm.Saksbehandlere"
                        imageSrcFunction={imageSrcFunction}
                        tabIndex="0"
                        tooltip={this.createTooltip()}
                        alignTooltipArrowLeft
                      />
                    </FlexColumn>
                    <FlexColumn className={styles.marginFilters}>
                      <LabelWithHeader
                        header={intl.formatMessage({ id: 'OppgavekoVelgerForm.Stonadstype' })}
                        texts={getStonadstyper(getValgtOppgaveko(oppgavekoer, values.oppgavekoId), intl)}
                      />
                    </FlexColumn>
                    <FlexColumn className={styles.marginFilters}>
                      <LabelWithHeader
                        header={intl.formatMessage({ id: 'OppgavekoVelgerForm.Behandlingstype' })}
                        texts={getBehandlingstyper(getValgtOppgaveko(oppgavekoer, values.oppgavekoId), intl)}
                      />
                    </FlexColumn>
                    <FlexColumn className={styles.marginFilters}>
                      <LabelWithHeader
                        header={intl.formatMessage({ id: 'OppgavekoVelgerForm.AndreKriterier' })}
                        texts={getAndreKriterier(getValgtOppgaveko(oppgavekoer, values.oppgavekoId), intl)}
                      />
                    </FlexColumn>
                    <FlexColumn className={styles.marginFilters}>
                      <LabelWithHeader
                        header={intl.formatMessage({ id: 'OppgavekoVelgerForm.Sortering' })}
                        texts={[getSorteringsnavn(getValgtOppgaveko(oppgavekoer, values.oppgavekoId))]}
                      />
                    </FlexColumn>
                  </>
                      )}
              </FlexRow>
            </FlexContainer>
          </form>
            )}
      />
    );
  }
}

const mapStateToProps = state => ({
  saksbehandlere: getOppgavekoensSaksbehandlere(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchOppgavekoensSaksbehandlere,
    fetchAntallOppgaverForBehandlingsko,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(OppgavekoVelgerForm));