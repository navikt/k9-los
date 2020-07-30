import React, { Component, ReactNode } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';

import Reservasjon from 'avdelingsleder/reservasjoner/reservasjonTsType';
import Image from 'sharedComponents/Image';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import CalendarToggleButton from 'sharedComponents/datepicker/CalendarToggleButton';
import OppgaveReservasjonEndringDatoModal from 'saksbehandler/behandlingskoer/components/menu/OppgaveReservasjonEndringDatoModal';
import FlyttReservasjonModal from 'saksbehandler/behandlingskoer/components/menu/FlyttReservasjonModal';
import { getDateAndTime } from 'utils/dateUtils';

import removeIcon from 'images/remove.svg';
import gruppeHoverUrl from 'images/gruppe_hover.svg';
import gruppeUrl from 'images/gruppe.svg';

import TableColumn from 'sharedComponents/TableColumn';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import styles from './reservasjonerTabell.less';

const headerTextCodes = [
  'ReservasjonerTabell.Navn',
  'ReservasjonerTabell.Saksnr',
  'ReservasjonerTabell.BehandlingType',
  'ReservasjonerTabell.ReservertTil',
  'ReservasjonerTabell.Endre',
  'ReservasjonerTabell.Flytt',
  'ReservasjonerTabell.Slett',
];

interface OwnProps {
  reservasjoner: Reservasjon[];
  opphevReservasjon: (oppgaveId: string) => Promise<string>;
  hentAlleReservasjoner: () => void;
  endreOppgaveReservasjon: (oppgaveId: string, reserverTil: string) => Promise<string>;
  finnSaksbehandler: (brukerIdent: string) => Promise<string>;
  resetSaksbehandler: () => Promise<string>;
  flyttReservasjon: (oppgaveId: string, brukerident: string, begrunnelse: string) => Promise<string>;
}

interface StateTsProps {
  showReservasjonEndringDatoModal: boolean;
  showFlyttReservasjonModal: boolean;
  valgtReservasjon?: Reservasjon;
}

class ReservasjonerTabell extends Component<OwnProps, StateTsProps> {
  constructor(props: OwnProps) {
    super(props);

    this.state = {
      showReservasjonEndringDatoModal: false,
      showFlyttReservasjonModal: false,
      valgtReservasjon: undefined,
    };
  }


  closeReservasjonEndringDatoModal = (): void => {
    this.setState((prevState) => ({ ...prevState, showReservasjonEndringDatoModal: false }));
  }

  showReservasjonEndringDato = (reservasjon: Reservasjon): void => {
    this.setState((prevState) => ({ ...prevState, showReservasjonEndringDatoModal: true, valgtReservasjon: reservasjon }));
  }

  showFlytteModal = (reservasjon: Reservasjon): void => {
    this.setState((prevState) => ({ ...prevState, showFlyttReservasjonModal: true, valgtReservasjon: reservasjon }));
  }

  closeFlytteModal = (): void => {
    this.setState((prevState) => ({ ...prevState, showFlyttReservasjonModal: false }));
  }

  toggleMenu = (): void => {
    this.setState((prevState) => ({ ...prevState, showFlyttReservasjonModal: false }));
  }

  endreReservasjon = (oppgaveId: string, reserverTil: string) => {
    const { endreOppgaveReservasjon } = this.props;
    endreOppgaveReservasjon(oppgaveId, reserverTil).then((this.closeReservasjonEndringDatoModal));
  }

  flyttReservasjon = (oppgaveId: string, brukerident: string, begrunnelse: string) => {
    const { flyttReservasjon } = this.props;
    flyttReservasjon(oppgaveId, brukerident, begrunnelse).then((this.closeFlytteModal));
  }

  render = (): ReactNode => {
    const {
      reservasjoner, opphevReservasjon, hentAlleReservasjoner, finnSaksbehandler, resetSaksbehandler,
    } = this.props;
    const {
      showReservasjonEndringDatoModal, showFlyttReservasjonModal, valgtReservasjon,
    } = this.state;

    const sorterteReservasjoner = reservasjoner.sort((reservasjon1, reservasjon2) => reservasjon1.reservertAvNavn.localeCompare(reservasjon2.reservertAvNavn));

    return (
      <>
        <Element><FormattedMessage id="ReservasjonerTabell.Reservasjoner" /></Element>
        {sorterteReservasjoner.length === 0 && (
          <>
            <VerticalSpacer eightPx />
            <Normaltekst><FormattedMessage id="ReservasjonerTabell.IngenReservasjoner" /></Normaltekst>
            <VerticalSpacer eightPx />
          </>
        )}
        {sorterteReservasjoner.length > 0 && (
          <Table headerTextCodes={headerTextCodes} noHover>
            {sorterteReservasjoner.map((reservasjon) => (
              <TableRow key={reservasjon.oppgaveId}>
                <TableColumn>{reservasjon.reservertAvNavn}</TableColumn>
                <TableColumn>{reservasjon.saksnummer}</TableColumn>
                <TableColumn>{reservasjon.behandlingType.navn}</TableColumn>
                <TableColumn>
                  <FormattedMessage
                    id="ReservasjonerTabell.ReservertTilFormat"
                    values={getDateAndTime(reservasjon.reservertTilTidspunkt)}
                  />
                </TableColumn>
                <TableColumn>
                  <CalendarToggleButton
                    toggleShowCalendar={() => this.showReservasjonEndringDato(reservasjon)}
                    className={styles.calendarToggleButton}
                  />
                </TableColumn>
                <TableColumn>
                  <Image
                    src={gruppeUrl}
                    srcHover={gruppeHoverUrl}
                    onMouseDown={() => this.showFlytteModal(reservasjon)}
                  />
                </TableColumn>
                <TableColumn>
                  <Image
                    src={removeIcon}
                    className={styles.removeImage}
                    onMouseDown={() => opphevReservasjon(reservasjon.oppgaveId)}
                  />
                </TableColumn>
              </TableRow>
            ))}
          </Table>
        )}
        {showReservasjonEndringDatoModal
          && (
            <OppgaveReservasjonEndringDatoModal
              showModal={showReservasjonEndringDatoModal}
              closeModal={this.closeReservasjonEndringDatoModal}
              reserverTilDefault={valgtReservasjon.reservertTilTidspunkt}
              endreOppgaveReservasjon={this.endreReservasjon}
              oppgaveId={valgtReservasjon.oppgaveId}
            />
          )}
        { showFlyttReservasjonModal && (
          <FlyttReservasjonModal
            showModal={showFlyttReservasjonModal}
            closeModal={this.closeFlytteModal}
            oppgaveId={valgtReservasjon.oppgaveId}
            finnSaksbehandler={finnSaksbehandler}
            resetSaksbehandler={resetSaksbehandler}
            submit={this.flyttReservasjon}
          />
        )}
      </>
    );
  }
}

export default ReservasjonerTabell;