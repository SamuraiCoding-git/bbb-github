import React from 'react';
import styled from 'styled-components';

const BirdStyled = styled.div`
  width: 30px;
  height: 30px;
  background-color: yellow;
  position: absolute;
  top: ${(props) => props.position}px;
  left: 100px;
  border-radius: 50%;
`;

const Bird = ({ position }) => {
    return <BirdStyled position={position} />;
};

export default Bird;
