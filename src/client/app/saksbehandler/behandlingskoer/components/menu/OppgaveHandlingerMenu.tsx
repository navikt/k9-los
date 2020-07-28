import React, { Component, MouseEvent } from 'react';
import { FormattedMessage } from 'react-intl';
import { getDateAndTime } from 'utils/dateUtils';
import Oppgave from 'saksbehandler/oppgaveTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import MenuButton from './MenuButton';
import OpphevReservasjonModal from './OpphevReservasjonModal';
import OppgaveReservasjonForlengetModal from './OppgaveReservasjonForlengetModal';
import FlyttReservasjonModal from './FlyttReservasjonModal';
import OppgaveReservasjonEndringDatoModal from './OppgaveReservasjonEndringDatoModal';

import styles from './oppgaveHandlingerMenu.less';

const getOffsetPositionStyle = (offset) => (window.innerWidth > (offset.left + 250)
  ? { left: `${42 + offset.left}px`, top: `${offset.top - 20}px` }
  : { left: `${offset.left - 200}px`, top: `${offset.top + 38}px` });

const toggleEventListeners = (turnOnEventListeners, handleOutsideClick) => {
  if (turnOnEventListeners) {
    document.addEventListener('click', handleOutsideClick, false);
    document.addEventListener('mousedown', handleOutsideClick, false);
    document.addEventListener('keydown', handleOutsideClick, false);
  } else {
    document.removeEventListener('click', handleOutsideClick, false);
    document.removeEventListener('mousedown', handleOutsideClick, false);
    document.removeEventListener('keydown', handleOutsideClick, false);
  }
};

interface OwnProps {
  toggleMenu: (valgtOppgave: Oppgave) => void;
  offset: {
    top: number;
    left: number;
  };
  oppgave: Oppgave;
  imageNode: any;
  opphevOppgaveReservasjon: (oppgaveId: string, begrunnelse: string) => Promise<string>;
  forlengOppgaveReservasjon: (oppgaveId: string) => Promise<string>;
  endreOppgaveReservasjon: (oppgaveId: string, reserverTil: string) => Promise<string>;
  finnSaksbehandler: (brukerIdent: string) => Promise<string>;
  resetSaksbehandler: () => Promise<string>;
  flyttReservasjon: (oppgaveId: string, brukerident: string, begrunnelse: string) => Promise<string>;
}

interface OwnState {
  showOpphevReservasjonModal: boolean;
  showForlengetReservasjonModal: boolean;
  showFlyttReservasjonModal: boolean;
  showReservasjonEndringDatoModal: boolean;
}

/**
 * OppgaveHandlingerMenu
 */
export class OppgaveHandlingerMenu extends Component<OwnProps, OwnState> {
  node: any;

  menuButtonRef: any;

  constructor(props) {
    super(props);

    this.state = {
      showOpphevReservasjonModal: false,
      showForlengetReservasjonModal: false,
      showReservasjonEndringDatoModal: false,
      showFlyttReservasjonModal: false,
    };

    this.menuButtonRef = React.createRef();
    toggleEventListeners(true, this.handleOutsideClick);
  }

  componentDidMount = () => {
    if (this.menuButtonRef && this.menuButtonRef.current) {
      this.menuButtonRef.current.focus();
    }
  }

  componentWillUnmount = () => {
    toggleEventListeners(false, this.handleOutsideClick);
  }

  handleOutsideClick = (event: MouseEvent<HTMLButtonElement>) => {
    const { imageNode } = this.props;
    // ignore clicks on the component itself
    const harKlikketMeny = this.node && this.node.contains(event.target);
    const harKlikketIkon = imageNode && imageNode.contains(event.target);
    if (harKlikketMeny || harKlikketIkon) {
      return;
    }

    const { toggleMenu, oppgave } = this.props;
    toggleMenu(oppgave);
  }

  showBegrunnelseModal = () => {
    toggleEventListeners(false, this.handleOutsideClick);
    this.setState((prevState) => ({ ...prevState, showOpphevReservasjonModal: true }));
  }

  closeBegrunnelseModal = () => {
    const { toggleMenu, oppgave } = this.props;
    toggleMenu(oppgave);
    toggleEventListeners(true, this.handleOutsideClick);
    this.setState((prevState) => ({ ...prevState, showOpphevReservasjonModal: false }));
  }

  showFlytteModal = () => {
    toggleEventListeners(false, this.handleOutsideClick);
    this.setState((prevState) => ({ ...prevState, showFlyttReservasjonModal: true }));
  }

  showReservasjonEndringDato = () => {
    toggleEventListeners(false, this.handleOutsideClick);
    this.setState((prevState) => ({ ...prevState, showReservasjonEndringDatoModal: true }));
  }

  closeFlytteModal = () => {
    const { toggleMenu, oppgave } = this.props;
    toggleMenu(oppgave);
    toggleEventListeners(true, this.handleOutsideClick);
    this.setState((prevState) => ({ ...prevState, showFlyttReservasjonModal: false }));
  }

  endreReservasjon = (reserverTil: string) => {
    const { oppgave, endreOppgaveReservasjon } = this.props;
    endreOppgaveReservasjon(oppgave.eksternId, reserverTil).then(() => {
      toggleEventListeners(false, this.handleOutsideClick);
      this.setState((prevState) => ({ ...prevState, showForlengetReservasjonModal: true }));
    });
  }

  closeReservasjonEndringDatoModal = (event: MouseEvent<HTMLButtonElement>) => {
    const { toggleMenu, oppgave } = this.props;
    toggleMenu(oppgave);
    this.handleOutsideClick(event);
  }

  closeForlengReservasjonModal = (event: MouseEvent<HTMLButtonElement>) => {
    const { toggleMenu, oppgave } = this.props;
    toggleMenu(oppgave);
    this.handleOutsideClick(event);
  }

  forlengReserverasjon = () => {
    const { oppgave, forlengOppgaveReservasjon } = this.props;
    forlengOppgaveReservasjon(oppgave.eksternId).then(() => {
      toggleEventListeners(false, this.handleOutsideClick);
      this.setState((prevState) => ({ ...prevState, showForlengetReservasjonModal: true }));
    });
  }

  opphevReserverasjon = (oppgaveId: string, begrunnelse: string) => {
    const { opphevOppgaveReservasjon } = this.props;
    opphevOppgaveReservasjon(oppgaveId, begrunnelse);
    const { toggleMenu, oppgave } = this.props;
    toggleMenu(oppgave);
  }

  flyttReservasjon = (oppgaveId: string, brukerident: string, begrunnelse: string) => {
    const { flyttReservasjon } = this.props;
    flyttReservasjon(oppgaveId, brukerident, begrunnelse);
    const { toggleMenu, oppgave } = this.props;
    toggleMenu(oppgave);
  }


  render = () => {
    const {
      oppgave, offset, finnSaksbehandler, resetSaksbehandler,
    } = this.props;
    const {
      showOpphevReservasjonModal, showForlengetReservasjonModal, showFlyttReservasjonModal, showReservasjonEndringDatoModal,
    } = this.state;

    return (
      <>
        <div className={styles.containerMenu} style={getOffsetPositionStyle(offset)} ref={(node) => { this.node = node; }}>
          <FormattedMessage
            id="OppgaveHandlingerMenu.ReservertTil"
            values={{
              ...getDateAndTime(oppgave.status.reservertTilTidspunkt),
              b: (...chunks) => <b>{chunks}</b>,
            }}
          />
          <VerticalSpacer eightPx />
          <MenuButton onClick={this.showBegrunnelseModal} ref={this.menuButtonRef}>
            <FormattedMessage id="OppgaveHandlingerMenu.LeggTilbake" values={{ br: <br /> }} />
          </MenuButton>
          <MenuButton onClick={this.forlengReserverasjon}>
            <FormattedMessage id="OppgaveHandlingerMenu.ForlengReservasjon" values={{ br: <br /> }} />
          </MenuButton>
          <MenuButton onClick={this.showReservasjonEndringDato}>
            <FormattedMessage id="OppgaveHandlingerMenu.EndreReservasjon" />
          </MenuButton>
          <MenuButton onClick={this.showFlytteModal}>
            <FormattedMessage id="OppgaveHandlingerMenu.FlyttReservasjon" values={{ br: <br /> }} />
          </MenuButton>
        </div>
        {showOpphevReservasjonModal && (
          <OpphevReservasjonModal
            oppgave={oppgave}
            showModal={showOpphevReservasjonModal}
            cancel={this.closeBegrunnelseModal}
            submit={this.opphevReserverasjon}
          />
        )}
        {showReservasjonEndringDatoModal && (
        <OppgaveReservasjonEndringDatoModal
          showModal={showReservasjonEndringDatoModal}
          oppgaveId={oppgave.eksternId}
          endreOppgaveReservasjon={this.endreReservasjon}
          closeModal={this.closeReservasjonEndringDatoModal}
          reserverTilDefault={oppgave.status.reservertTilTidspunkt}
        />
        )}
        {showForlengetReservasjonModal
          && <OppgaveReservasjonForlengetModal oppgave={oppgave} showModal={showForlengetReservasjonModal} closeModal={this.closeForlengReservasjonModal} />}
        { showFlyttReservasjonModal && (
          <FlyttReservasjonModal
            oppgaveId={oppgave.eksternId}
            showModal={showFlyttReservasjonModal}
            closeModal={this.closeFlytteModal}
            submit={this.flyttReservasjon}
            finnSaksbehandler={finnSaksbehandler}
            resetSaksbehandler={resetSaksbehandler}
          />
        )}
      </>
    );
  }
}

export default OppgaveHandlingerMenu;
