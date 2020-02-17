import React from 'react';
import styled from 'styled-components';
import { Subject } from 'rxjs';

interface ControlProps {
  setTaxiCount: (taxiCount: string) => {};
  mapReady: () => void;
  taxiCount: string;
  pickupEta: number;
  errorMessage?: string;
}

interface ControlState {
}

interface StyledProps {
  padding?: string;
  fontSize?: string;
}

const ControlWrapper = styled.span`
  width: 25vw;
  display: flex;
  flex-flow: column wrap;

  @media all and (max-width: 1024px) {
    width: 100vw;
  }
`;

const Span = styled.span`
   text-align: center;
   padding: ${(props: StyledProps) => props.padding || '0'};
   color: ${props => props.color};
   font-size: ${(props: StyledProps) => props.fontSize};
`;

const InputWrapper = styled.div`
  padding: 1em;
`;

const Input = styled.input`
  width: 100%;
  text-align: center;
`;

const SectionSeparator = styled.hr`
  border: 0;
  clear: both;
  display: block;
  width: 90%;
  background-color: #2e3131;
  height: 1px;
`;

const EtaIndicatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const EtaIndicator = styled.div`
  border-radius: 50%;
  width: 5em;
  height: 5em;
  padding: 0.5em;
  border: 0.07em dashed #2e3131;
  color: #2e3131;
  text-align: center;

  font-size: 2em;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

class Control extends React.Component<ControlProps, ControlState> {
  private unsubscribe: Subject<void> = new Subject();

  constructor(props: ControlProps) {
    super(props);
    // bind context of 'this' to event handler
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillUnmount() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const taxiAmount: string = event.target.value;
    this.props.setTaxiCount(taxiAmount);
  }

  render() {
    return(
      <ControlWrapper>
        <Span padding="1em"> Number of Taxis to Display: </Span>
        <InputWrapper>
          <Input
            id="taxiRangeSliderInput"
            type="range"
            min="1"
            max="50"
            value={this.props.taxiCount}
            onChange={this.handleInputChange}
            step="1"
          />
          <Input
            id="taxiTextInput"
            type="text"
            min="1"
            max="50"
            value={this.props.taxiCount}
            onChange={this.handleInputChange}
          />
          {this.props.errorMessage && <Span color="#96281b" fontSize="0.6em">{this.props.errorMessage}</Span>}
        </InputWrapper>
        <SectionSeparator />
        <EtaIndicatorWrapper>
          <Span padding="1em"> Your taxi will arrive in approximately </Span>
          <EtaIndicator>
            <Span fontSize="2.5em" color="#049372">{this.props.pickupEta}</Span>
            <Span>mins</Span>
          </EtaIndicator>
        </EtaIndicatorWrapper>
      </ControlWrapper>
    );
  }

}

export default Control;
