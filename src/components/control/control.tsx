import React from 'react';
import styled from 'styled-components';
import { Subject } from 'rxjs';

interface ControlProps {
  toggleDisplayTransmissionClusters: (displayTransmissionClusters: boolean) => {};
  displayTransmissionClusters: boolean;
}

interface StyledProps {
  padding?: string;
  fontSize?: string;
}

const ControlWrapper = styled.div`
  background-color: rgba(0,0,0, 0.5);
  color: white;
  width: 20vw;
  height: 10vh;
  position: absolute;
  z-index: 1;
  top: 1em;
  left: 1em;
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

const Control: React.FC<ControlProps> = (props) => {
  const { toggleDisplayTransmissionClusters, displayTransmissionClusters } = props;
  const unsubscribe: Subject<void> = new Subject();

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    toggleDisplayTransmissionClusters(e.target.checked);
  };

  return (
    <ControlWrapper>
    <span>Toggle Options</span>
    <input type='checkbox' checked={displayTransmissionClusters} onChange={handleCheck} />
    <label>Transmission Clusters</label>
    </ControlWrapper>
  );

}

export default Control;
